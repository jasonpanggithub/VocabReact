import { useEffect, useRef, useState } from 'react'
import './Dictation.css'

const handlePlay = (saySomething) => {
  if (!window.responsiveVoice || typeof window.responsiveVoice.speak !== 'function') {
    return
  }
  window.responsiveVoice.speak(saySomething)
}

function Dictation({
  spelling,
  pronunciation,
  definition,
  example,
  total = 0,
  current = 0,
  correct = 0,
  onShow,
  onNext,
  onCorrect,
  isNextDisabled = false,
}) {
  const [spellingInput, setSpellingInput] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [hasMatched, setHasMatched] = useState(false)
  const lastSpokenRef = useRef(null)
  
  useEffect(() => {
    setSpellingInput('')
    setHasMatched(false)
  }, [pronunciation, definition, example])

  useEffect(() => {
    if (!spelling) return
    if (lastSpokenRef.current === spelling) return
    handlePlay(spelling)
    lastSpokenRef.current = spelling
  }, [spelling])

  const handleSpellingSubmit = (event) => {
    event.preventDefault()
    if (hasMatched) return
    const expected = (spelling || '').trim()
    const actual = spellingInput.trim()
    if (!expected || !actual) return
    if (expected === actual) {
      setHasMatched(true)
      if (onCorrect) onCorrect()
    } else {
      handlePlay('wrong')
    }
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
          <span className="dictation__value">{current}</span>
        </div>
        <div className="dictation__stat">
          <span className="dictation__label">Correct</span>
          <span className="dictation__value">{correct}</span>
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
                {pronunciation || '-'}
              </span>
            </div>
            <div className="dictation__field">
              <label className="dictation__label-inline">Definition</label>
              <span className="dictation__readonly-value">
                {definition || '-'}
              </span>
            </div>
            <div className="dictation__field">
              <label className="dictation__label-inline">Example</label>
              <span className="dictation__readonly-value">
                {example || '-'}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="dictation__actions">
        <button
          type="button"
          className="dictation__button"
          onClick={() => handlePlay(spelling)}
        >
          Play
        </button>
        <button
          type="button"
          className="dictation__button"
          onClick={() => {
            setShowDetails((prev) => !prev)
            if (onShow) onShow()
          }}
        >
          {showDetails ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          className="dictation__button"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Dictation
