import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../../../config/api'
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
      const response = await fetch(`${API_BASE_URL}/Vocabularies/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vocabList),
      })
      if (!response.ok) {
        throw new Error(`Failed to save (${response.status})`)
      }
      setIsSaveDisabled(true)
      handlePlay('save successfully')
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!currentVocab) {
    return (
      <div className="card bg-dark text-light border-secondary p-3">
        <div className="row g-2 text-center">
          <div className="col-sm">
            <div className="fw-semibold">Total</div>
            <div>0</div>
          </div>
          <div className="col-sm">
            <div className="fw-semibold">Current</div>
            <div>0</div>
          </div>
          <div className="col-sm">
            <div className="fw-semibold">Correct</div>
            <div>0</div>
          </div>
        </div>
        <div className="text-center text-muted mt-3">No vocabularies available.</div>
      </div>
    )
  }

  return (
    <div className="card bg-dark text-light border-secondary p-3">
      <div className="row g-2 text-center mb-3">
        <div className="col-sm">
          <div className="fw-semibold">Total</div>
          <div>{total}</div>
        </div>
        <div className="col-sm">
          <div className="fw-semibold">Current</div>
          <div>{currentIndex + 1}</div>
        </div>
        <div className="col-sm">
          <div className="fw-semibold">Correct</div>
          <div>{correctCount}</div>
        </div>
      </div>

      <form className="row g-2 align-items-center mb-2" onSubmit={handleSpellingSubmit}>
        <div className="col-sm-3 text-start">
          <label htmlFor="spelling" className="col-form-label">
            Spelling
          </label>
        </div>
        <div className="col-sm-9 text-start">
          <input
            id="spelling"
            type="text"
            className="form-control bg-dark text-light border-secondary"
            value={spellingInput}
            onChange={(event) => setSpellingInput(event.target.value)}
            disabled={spellingDisabled}
          />
        </div>
      </form>

      {showAnswer && (
        <div className="row g-2 align-items-center mb-2">
          <div className="col-sm-3 fw-semibold text-start">Answer</div>
          <div className="col-sm-9 text-danger fw-semibold text-start">
            {currentVocab.spelling}
          </div>
        </div>
      )}

      {showDetails && (
        <div className="mb-3">
          <div className="row g-2 align-items-center mb-2">
            <div className="col-sm-3 fw-semibold text-start">Pronunciation</div>
            <div className="col-sm-9 text-start">{currentVocab.pronunciation || '-'}</div>
          </div>
          <div className="row g-2 align-items-center mb-2">
            <div className="col-sm-3 fw-semibold text-start">Definition</div>
            <div className="col-sm-9 text-start">{currentVocab.definition || '-'}</div>
          </div>
          <div className="row g-2 align-items-center">
            <div className="col-sm-3 fw-semibold text-start">Example</div>
            <div className="col-sm-9 text-start">{currentVocab.example || '-'}</div>
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary dictation__btn"
          onClick={() => handlePlay(currentVocab.spelling)}
        >
          Play
        </button>
        <button type="button" className="btn btn-primary dictation__btn" onClick={handleAnswer}>
          Answer
        </button>
        <button
          type="button"
          className="btn btn-primary dictation__btn"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          className="btn btn-primary dictation__btn"
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          Next
        </button>
        <button
          type="button"
          className="btn btn-danger dictation__btn dictation__btn--save"
          onClick={handleSave}
          disabled={saving || isSaveDisabled}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {saveError && <div className="text-danger mt-2">Error: {saveError}</div>}
    </div>
  )
}

export default Dictation
