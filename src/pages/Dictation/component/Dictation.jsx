import { useEffect, useRef, useState } from 'react'
import './Dictation.css'

const handlePlay = (saySomething) => {
  if (!window.responsiveVoice || typeof window.responsiveVoice.speak !== 'function') {
    return
  }
  if (!saySomething) return
  window.responsiveVoice.speak(saySomething)
}

function Dictation({ vocabList = [], onUpdateList }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [spellingInput, setSpellingInput] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [hasMatched, setHasMatched] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [spellingDisabled, setSpellingDisabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [isSaveDisabled, setIsSaveDisabled] = useState(false)
  const lastSpokenRef = useRef(null)

  const total = vocabList.length
  const currentVocab = vocabList[currentIndex] || null
  const isNextDisabled = currentIndex >= vocabList.length - 1

  useEffect(() => {
    const spelling = currentVocab?.spelling
    if (!spelling) return
    if (lastSpokenRef.current === spelling) return
    handlePlay(spelling)
    lastSpokenRef.current = spelling
  }, [currentVocab?.spelling])


  const handleSpellingSubmit = (event) => {
    event.preventDefault()
    const now = new Date().toISOString()
    const expected = (currentVocab?.spelling || '').trim()
    const actual = spellingInput.trim()
    if (!expected || !actual) return
    if (expected === actual) {
      if (onUpdateList) {
        onUpdateList((prev) =>
          prev.map((item, idx) =>
            idx === currentIndex
              ? {
                  ...item,
                  attempt: (item.attempt || 0) + 1,
                  successTotal: (item.successTotal || 0) + 1,
                  lastAttempt: now,
                  lastCorrect: now,
                  lastResult: 'SUCCESS',
                }
              : item
          )
        )
      }
      if (currentIndex >= vocabList.length - 1) {
        if (hasMatched) return
        setHasMatched(true)
        setCorrectCount((prev) => prev + 1)
        return
      }
      setCorrectCount((prev) => prev + 1)
      setCurrentIndex((prev) => prev + 1)
      setSpellingInput('')
      setHasMatched(false)
    } else {
      if (onUpdateList) {
        onUpdateList((prev) =>
          prev.map((item, idx) =>
            idx === currentIndex
              ? {
                  ...item,
                  attempt: (item.attempt || 0) + 1,
                  failTotal: (item.failTotal || 0) + 1,
                  lastAttempt: now,
                  lastFail: now,
                  lastResult: 'FAIL',
                }
              : item
          )
        )
      }
      handlePlay('wrong')
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, vocabList.length - 1))
    setSpellingInput('')
    setHasMatched(false)
    setShowAnswer(false)
    setSpellingDisabled(false)
  }

  const handleAnswer = () => {
    if (showAnswer) return
    const now = new Date().toISOString()
    if (onUpdateList) {
      onUpdateList((prev) =>
        prev.map((item, idx) =>
          idx === currentIndex
            ? {
                ...item,
                attempt: (item.attempt || 0) + 1,
                failTotal: (item.failTotal || 0) + 1,
                lastAttempt: now,
                lastFail: now,
                lastResult: 'FAIL',
              }
            : item
        )
      )
    }
    setShowAnswer(true)
    setSpellingDisabled(true)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const response = await fetch('/api/Vocabularies/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vocabList),
      })
      if (!response.ok) {
        throw new Error(`Failed to save (${response.status})`)
      } else {
        setIsSaveDisabled(true)
        handlePlay('save successfully')
      }
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!currentVocab) {
    return (
      <div className="dictation">
        <div className="dictation__stats">
          <div className="dictation__stat">
            <span className="dictation__label">Total</span>
            <span className="dictation__value">0</span>
          </div>
          <div className="dictation__stat">
            <span className="dictation__label">Current</span>
            <span className="dictation__value">0</span>
          </div>
          <div className="dictation__stat">
            <span className="dictation__label">Correct</span>
            <span className="dictation__value">0</span>
          </div>
        </div>
        <div className="dictation__empty">No vocabularies available.</div>
      </div>
    )
  }

  return (
    <div className="dictation">
      <div className="dictation__stats">
        <div className="dictation__stat">
          <span className="dictation__label">Total</span>
          <span className="dictation__value">{total}</span>
        </div>
        <div className="dictation__stat">
          <span className="dictation__label">Current</span>
          <span className="dictation__value">{currentIndex + 1}</span>
        </div>
        <div className="dictation__stat">
          <span className="dictation__label">Correct</span>
          <span className="dictation__value">{correctCount}</span>
        </div>
      </div>

      <div className="dictation__fields">
        <form className="dictation__field" onSubmit={handleSpellingSubmit}>
          <label htmlFor="spelling">Spelling</label>
          <input
            id="spelling"
            type="text"
            value={spellingInput}
            onChange={(event) => setSpellingInput(event.target.value)}
            disabled={spellingDisabled}
          />
        </form>
        {showAnswer && (
          <div className="dictation__answer">
            <span className="dictation__answer-label">Answer</span>
            <span className="dictation__answer-value">{currentVocab.spelling}</span>
          </div>
        )}
        {showDetails && (
          <>
            <div className="dictation__field">
              <label className="dictation__label-inline">Pronunciation</label>
              <span className="dictation__readonly-value">
                {currentVocab.pronunciation || '-'}
              </span>
            </div>
            <div className="dictation__field">
              <label className="dictation__label-inline">Definition</label>
              <span className="dictation__readonly-value">
                {currentVocab.definition || '-'}
              </span>
            </div>
            <div className="dictation__field">
              <label className="dictation__label-inline">Example</label>
              <span className="dictation__readonly-value">
                {currentVocab.example || '-'}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="dictation__actions">
        <button
          type="button"
          className="dictation__button"
          onClick={() => handlePlay(currentVocab.spelling)}
        >
          Play
        </button>
        <button
          type="button"
          className="dictation__button"
          onClick={handleAnswer}
        >
          Answer
        </button>
        <button
          type="button"
          className="dictation__button"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          className="dictation__button"
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          Next
        </button>
        <button
          type="button"
          className="dictation__button"
          onClick={handleSave}
          disabled={saving || isSaveDisabled}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {saveError && <div className="dictation__error">Error: {saveError}</div>}
    </div>
  )
}

export default Dictation
