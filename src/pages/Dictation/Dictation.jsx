import { useEffect, useState } from 'react'
import './Dictation.css'

function Dictation({
  spelling,
  pronunciation,
  definition,
  example,
  total = 0,
  current = 0,
  correct = 0,
  onCheck,
  onShow,
  onNext,
  isNextDisabled = false,
}) {
  const [spellingInput, setSpellingInput] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    setSpellingInput('')
  }, [pronunciation, definition, example])

  
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
        <div className="dictation__field">
          <label htmlFor="spelling">Spelling</label>
          <input
            id="spelling"
            type="text"
            value={spellingInput}
            onChange={(event) => setSpellingInput(event.target.value)}
          />
        </div>
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
        <button type="button" className="dictation__button" onClick={onCheck}>
          Check
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
  

const handlePlay = (saySomething) => {
    //responsiveVoice.speak(spellingInput, "UK English Male");
    responsiveVoice.speak(saySomething)
}