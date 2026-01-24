import { useState } from 'react'
import './Dictation.css'

function Dictation() {
  const [pronunciation, setPronunciation] = useState('')
  const [definition, setDefinition] = useState('')
  const [example, setExample] = useState('')

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

      <div className="dictation__fields">
        <div className="dictation__field">
          <label htmlFor="pronunciation">Pronunciation</label>
          <input
            id="pronunciation"
            type="text"
            value={pronunciation}
            onChange={(event) => setPronunciation(event.target.value)}
          />
        </div>
        <div className="dictation__field">
          <label htmlFor="definition">Definition</label>
          <textarea
            id="definition"
            rows="3"
            value={definition}
            onChange={(event) => setDefinition(event.target.value)}
          />
        </div>
        <div className="dictation__field">
          <label htmlFor="example">Example</label>
          <textarea
            id="example"
            rows="3"
            value={example}
            onChange={(event) => setExample(event.target.value)}
          />
        </div>
      </div>

      <div className="dictation__actions">
        <button type="button" className="dictation__button">
          Play
        </button>
        <button type="button" className="dictation__button">
          Check
        </button>
        <button type="button" className="dictation__button">
          Show
        </button>
        <button type="button" className="dictation__button">
          Next
        </button>
      </div>
    </div>
  )
}

export default Dictation
