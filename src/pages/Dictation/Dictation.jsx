import { useEffect, useRef, useState } from 'react'
import './Dictation.css'

const handlePlay = (saySomething) => {
  if (!window.responsiveVoice || typeof window.responsiveVoice.speak !== 'function') {
    return
  }
  if (!saySomething) return
  window.responsiveVoice.speak(saySomething)
}

function Dictation({ vocabList = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [spellingInput, setSpellingInput] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [hasMatched, setHasMatched] = useState(false)
  const lastSpokenRef = useRef(null)

  const total = vocabList.length
  const currentVocab = vocabList[currentIndex] || null
  const isNextDisabled = currentIndex >= vocabList.length - 1

  useEffect(() => {
    setCurrentIndex(0)
    setCorrectCount(0)
    setSpellingInput('')
    setHasMatched(false)
  }, [vocabList])

  useEffect(() => {
    setSpellingInput('')
    setHasMatched(false)
  }, [currentVocab?.spelling])

  useEffect(() => {
    const spelling = currentVocab?.spelling
    if (!spelling) return
    if (lastSpokenRef.current === spelling) return
    handlePlay(spelling)
    lastSpokenRef.current = spelling
  }, [currentVocab?.spelling])

  const handleSpellingSubmit = (event) => {
    event.preventDefault()
    if (hasMatched) return
    const expected = (currentVocab?.spelling || '').trim()
    const actual = spellingInput.trim()
    if (!expected || !actual) return
    if (expected === actual) {
      setHasMatched(true)
      setCorrectCount((prev) => prev + 1)
      if (currentIndex < vocabList.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      }
    } else {
      handlePlay('wrong')
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, vocabList.length - 1))
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
          />
        </form>
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
      </div>
    </div>
  )
}

export default Dictation
