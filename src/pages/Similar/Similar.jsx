import { useEffect, useMemo, useRef, useState } from 'react'
import Calendar from '../../components/Calendar/Calendar'
import { API_BASE_URL } from '../../config/api'
import './Similar.css'

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeDateValue(value) {
  if (typeof value !== 'string') return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return toDateKey(parsed)
}

function shuffle(items) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = next[i]
    next[i] = next[j]
    next[j] = temp
  }
  return next
}

function normalizeSimilarSpellings(result) {
  if (!Array.isArray(result)) return []

  return result
    .map((item) => {
      if (typeof item === 'string') {
        return { spelling: item.trim(), definition: null }
      }
      if (item && typeof item === 'object') {
        const spelling =
          typeof item.spelling === 'string'
            ? item.spelling.trim()
            : typeof item.word === 'string'
            ? item.word.trim()
            : ''
        if (!spelling) return null
        const definition =
          typeof item.definition === 'string' ? item.definition.trim() || null : null
        return { spelling, definition }
      }
      return null
    })
    .filter((item) => item?.spelling)
}

function playWord(word) {
  if (!window.responsiveVoice || typeof window.responsiveVoice.speak !== 'function') {
    return
  }
  if (!word) return
  window.responsiveVoice.speak(word)
}

function Similar() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [definitionCache, setDefinitionCache] = useState({})
  const [wrongDetailsByIndex, setWrongDetailsByIndex] = useState({})
  const [optionWarning, setOptionWarning] = useState(null)
  const spokenRef = useRef(null)
  const autoNextTimerRef = useRef(null)

  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoadingDates(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/Vocabularies/updated-dates`)
        if (!response.ok) {
          throw new Error(`Failed to load dates (${response.status})`)
        }
        const result = await response.json()
        const normalized = Array.isArray(result)
          ? result.map(normalizeDateValue).filter(Boolean)
          : []
        setAvailableDates(normalized)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingDates(false)
      }
    }

    fetchAvailableDates()
  }, [])

  useEffect(() => {
    if (!selectedDate) return

    const fetchQuiz = async () => {
      setLoadingQuiz(true)
      setError(null)
      setOptionWarning(null)
      try {
        const dateKey = toDateKey(selectedDate)
        const response = await fetch(
          `${API_BASE_URL}/Vocabularies/by-updated-date?date=${dateKey}`
        )
        if (!response.ok) {
          throw new Error(`Failed to load vocabularies (${response.status})`)
        }

        const vocabResult = await response.json()
        const vocabList = Array.isArray(vocabResult) ? vocabResult : []

        let failedOptionCalls = 0
        let skippedNoSimilarCount = 0
        const quizQuestionCandidates = await Promise.all(
          vocabList.map(async (vocab) => {
            const originalSpelling = (vocab?.spelling || '').trim()
            if (!originalSpelling) {
              skippedNoSimilarCount += 1
              return null
            }

            try {
              const query = encodeURIComponent(originalSpelling)
              const similarResponse = await fetch(
                `${API_BASE_URL}/Vocabularies/similar-spellings?spelling=${query}`
              )
              if (!similarResponse.ok) {
                failedOptionCalls += 1
                return null
              }

              const similarResult = await similarResponse.json()
              const lowerOriginal = originalSpelling.toLowerCase()
              const similarOnly = normalizeSimilarSpellings(similarResult).filter(
                (item) => item.spelling.toLowerCase() !== lowerOriginal
              )

              if (similarOnly.length === 0) {
                skippedNoSimilarCount += 1
                return null
              }

              const merged = [
                ...similarOnly,
                {
                  spelling: originalSpelling,
                  definition: (vocab?.definition || '').trim() || null,
                },
              ]
              const unique = []
              const seen = new Set()
              const optionDefinitions = {}
              merged.forEach((item) => {
                const key = item.spelling.toLowerCase()
                if (seen.has(key)) return
                seen.add(key)
                unique.push(item.spelling)
                optionDefinitions[key] = item.definition || null
              })

              return { vocab, options: shuffle(unique), optionDefinitions }
            } catch {
              failedOptionCalls += 1
              return null
            }
          })
        )

        const quizQuestions = quizQuestionCandidates.filter(Boolean)
        setQuestions(quizQuestions)
        setCurrentIndex(0)
        setAnswers({})
        setWrongDetailsByIndex({})
        const warnings = []
        if (failedOptionCalls > 0) warnings.push(`Could not load ${failedOptionCalls} word(s)`)
        if (skippedNoSimilarCount > 0) {
          warnings.push(`Skipped ${skippedNoSimilarCount} word(s) with no similar options`)
        }
        setOptionWarning(warnings.length ? `${warnings.join('. ')}.` : null)
      } catch (err) {
        setError(err.message)
        setQuestions([])
      } finally {
        setLoadingQuiz(false)
      }
    }

    fetchQuiz()
  }, [selectedDate])

  const currentQuestion = questions[currentIndex] || null
  const currentSpelling = currentQuestion?.vocab?.spelling || ''
  const currentAnswer = answers[currentIndex]

  useEffect(() => {
    if (!currentSpelling) return
    if (spokenRef.current === currentSpelling) return
    playWord(currentSpelling)
    spokenRef.current = currentSpelling
  }, [currentSpelling])

  useEffect(
    () => () => {
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current)
      }
    },
    []
  )

  const correctCount = useMemo(
    () => Object.values(answers).filter((answer) => answer.isCorrect).length,
    [answers]
  )

  const handleSelectDate = (date) => {
    if (!date) return
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current)
      autoNextTimerRef.current = null
    }
    spokenRef.current = null
    setSelectedDate(date)
  }

  const fetchDefinitionBySpelling = async (spelling) => {
    const trimmed = (spelling || '').trim()
    if (!trimmed) return null

    const cacheKey = trimmed.toLowerCase()
    if (Object.prototype.hasOwnProperty.call(definitionCache, cacheKey)) {
      return definitionCache[cacheKey]
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/Vocabularies/search?q=${encodeURIComponent(trimmed)}`
      )
      if (!response.ok) {
        throw new Error(`Failed to load definition (${response.status})`)
      }

      const result = await response.json()
      const list = Array.isArray(result) ? result : []
      const exact = list.find(
        (item) =>
          typeof item?.spelling === 'string' &&
          item.spelling.trim().toLowerCase() === cacheKey
      )
      const definition = (exact?.definition || '').trim() || null
      setDefinitionCache((prev) => ({ ...prev, [cacheKey]: definition }))
      return definition
    } catch {
      setDefinitionCache((prev) => ({ ...prev, [cacheKey]: null }))
      return null
    }
  }

  const handleChoose = (option) => {
    if (!currentQuestion || currentAnswer) return
    const expected = (currentSpelling || '').trim().toLowerCase()
    const actual = (option || '').trim().toLowerCase()
    const isCorrect = expected && expected === actual
    const questionIndex = currentIndex
    const isLast = questionIndex >= questions.length - 1
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        selected: option,
        isCorrect,
      },
    }))

    if (!isCorrect) {
      const selectedFromOptions =
        currentQuestion.optionDefinitions?.[(option || '').trim().toLowerCase()] || null
      const correctFromOptions =
        currentQuestion.optionDefinitions?.[(currentSpelling || '').trim().toLowerCase()] || null
      const vocabDefinition = (currentQuestion.vocab?.definition || '').trim() || null

      setWrongDetailsByIndex((prev) => ({
        ...prev,
        [questionIndex]: {
          loading: true,
          selectedDefinition: selectedFromOptions,
          correctDefinition: correctFromOptions || vocabDefinition,
        },
      }))

      Promise.all([
        selectedFromOptions
          ? Promise.resolve(selectedFromOptions)
          : fetchDefinitionBySpelling(option),
        correctFromOptions || vocabDefinition
          ? Promise.resolve(correctFromOptions || vocabDefinition)
          : fetchDefinitionBySpelling(currentSpelling),
      ]).then(([selectedDefinition, correctDefinition]) => {
        setWrongDetailsByIndex((prev) => ({
          ...prev,
          [questionIndex]: {
            loading: false,
            selectedDefinition,
            correctDefinition,
          },
        }))
      })

      if (isLast) {
        playWord('it is the last vocabulary')
      }
      return
    }

    if (isLast) {
      playWord('it is the last vocabulary')
      return
    }

    autoNextTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      spokenRef.current = null
      autoNextTimerRef.current = null
    }, 450)
  }

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) return
    setCurrentIndex((prev) => prev + 1)
    spokenRef.current = null
  }

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date selected'

  return (
    <div className="similar-page">
      <h1>Similar</h1>
      {!selectedDate && (
        <p className="similar-page__hint">
          {loadingDates ? 'Loading available dates...' : 'Select a date from the available list.'}
        </p>
      )}
      {error && <div className="similar-page__error">Error: {error}</div>}

      {selectedDate ? (
        <>
          <div className="similar-page__selected">
            Selected: <span>{selectedLabel}</span>
          </div>
          <div className="similar-page__toolbar">
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                setSelectedDate(null)
                setQuestions([])
                setAnswers({})
                setWrongDetailsByIndex({})
                setCurrentIndex(0)
                setOptionWarning(null)
                if (autoNextTimerRef.current) {
                  clearTimeout(autoNextTimerRef.current)
                  autoNextTimerRef.current = null
                }
                spokenRef.current = null
              }}
            >
              Change Date
            </button>
          </div>

          {loadingQuiz ? (
            <div className="similar-page__loading">Loading vocabularies...</div>
          ) : (
            <div className="card bg-dark text-light border-secondary p-3">
              <div className="row g-2 text-center mb-3">
                <div className="col-sm">
                  <div className="fw-semibold">Total</div>
                  <div>{questions.length}</div>
                </div>
                <div className="col-sm">
                  <div className="fw-semibold">Current</div>
                  <div>{questions.length ? currentIndex + 1 : 0}</div>
                </div>
                <div className="col-sm">
                  <div className="fw-semibold">Correct</div>
                  <div>{correctCount}</div>
                </div>
              </div>

              {optionWarning && <div className="similar-page__warning mb-3">{optionWarning}</div>}

              {!currentQuestion ? (
                <div className="text-muted text-center">No vocabularies available.</div>
              ) : (
                <>
                  <p className="similar-page__instruction">
                    Listen to the word and select the correct spelling.
                  </p>

                  <div className="d-flex gap-2 mb-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => playWord(currentSpelling)}
                    >
                      Play
                    </button>
                    {!currentAnswer?.isCorrect && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={!currentAnswer || currentIndex >= questions.length - 1}
                      >
                        Next
                      </button>
                    )}
                  </div>

                  <div className="similar-page__options">
                    {currentQuestion.options.map((option) => {
                      const isSelected = currentAnswer?.selected === option
                      const isCorrectOption =
                        option.trim().toLowerCase() === currentSpelling.trim().toLowerCase()
                      const isAnswered = Boolean(currentAnswer)

                      let extraClass = ''
                      if (isAnswered && isCorrectOption) extraClass = 'similar-page__option--correct'
                      if (isAnswered && isSelected && !isCorrectOption) {
                        extraClass = 'similar-page__option--wrong'
                      }

                      return (
                        <button
                          key={`${currentSpelling}-${option}`}
                          type="button"
                          className={`btn btn-outline-light btn-sm similar-page__option ${extraClass}`}
                          onClick={() => handleChoose(option)}
                          disabled={isAnswered}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {currentAnswer && (
                    <div className="mt-3">
                      {currentAnswer.isCorrect ? (
                        <span className="text-success">Correct.</span>
                      ) : (
                        <div className="similar-page__wrong-details">
                          <div className="text-danger">Incorrect. Correct answer: {currentSpelling}</div>
                          {wrongDetailsByIndex[currentIndex]?.loading ? (
                            <div className="text-light-emphasis mt-1">Loading definitions...</div>
                          ) : (
                            <>
                              <div className="mt-1">
                                Your choice definition:{' '}
                                <span className="text-danger">
                                  {wrongDetailsByIndex[currentIndex]?.selectedDefinition || '-'}
                                </span>
                              </div>
                              <div>
                                Correct definition:{' '}
                                <span className="text-success">
                                  {wrongDetailsByIndex[currentIndex]?.correctDefinition || '-'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <Calendar
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      )}
    </div>
  )
}

export default Similar
