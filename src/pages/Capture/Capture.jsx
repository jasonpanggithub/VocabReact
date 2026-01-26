import { useState } from 'react'
import NewWord from './NewWord'
import './Capture.css'

const API_BASE_URL = '/api'

function Capture() {
  const [text, setText] = useState('')
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult([])
    try {
      const response = await fetch(
        `${API_BASE_URL}/Vocabularies/capture-new-vocabularies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(text),
        }
      )
      if (!response.ok) {
        throw new Error(`Failed to capture (${response.status})`)
      }
      const data = await response.json()
      setResult(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = (index, nextWord) => {
    setResult((prev) => {
      const next = [...prev]
      next[index] = nextWord
      return next
    })
  }

  const handleSave = async () => {
    if (saving) return
    const payload = result
      .filter((item) => item?.add)
      .map((item) => ({
        spelling: item.spelling || '',
        stem: item.stem || '',
        definition: item.definition || '',
        needTest: item.needTest ? 'Y' : 'N',
        example: item.example || null,
        pronunciation: item.pronunciation || null,
      }))

    if (payload.length === 0) {
      setSaveError('No items selected to save.')
      return
    }

    setSaving(true)
    setSaveError(null)
    try {
      const response = await fetch(
        `${API_BASE_URL}/Vocabularies/upsert-by-spelling`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
      if (!response.ok) {
        throw new Error(`Failed to save (${response.status})`)
      }
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="capture">
      <h1 className="capture__title">Capture</h1>
      <textarea
        className="capture__textarea"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste or type vocabularies here..."
        rows="10"
      />
      <div className="capture__actions">
        <button
          type="button"
          className="capture__button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Process'}
        </button>
        <button
          type="button"
          className="capture__button capture__button--secondary"
          onClick={handleSave}
          disabled={saving || result.length === 0}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {error && <div className="capture__error">Error: {error}</div>}
      {saveError && <div className="capture__error">Error: {saveError}</div>}
      {Array.isArray(result) && result.length > 0 && (
        <div className="capture__result">
          {result.map((item, index) => (
            <NewWord
              key={item.id || item.spelling || index}
              data={item}
              onChange={(nextWord) => handleUpdate(index, nextWord)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Capture
