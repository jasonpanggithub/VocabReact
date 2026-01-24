import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Add.css'

const API_BASE_URL = '/api'

const initialForm = {
  spelling: '',
  stem: '',
  definition: '',
  needTest: 's',
  example: '',
  pronunciation: '',
}

function Add() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/Vocabularies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        throw new Error(`Failed to add vocabulary (${response.status})`)
      }
      navigate('/list')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/list')
  }

  return (
    <div className="add-form">
      <h1>Add Vocabulary</h1>
      {error && <div className="add-form__error">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="spelling">Spelling</label>
          <input
            type="text"
            id="spelling"
            name="spelling"
            value={form.spelling}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stem">Stem</label>
          <input
            type="text"
            id="stem"
            name="stem"
            value={form.stem}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pronunciation">Pronunciation</label>
          <input
            type="text"
            id="pronunciation"
            name="pronunciation"
            value={form.pronunciation}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="definition">Definition</label>
          <input
            type="text"
            id="definition"
            name="definition"
            value={form.definition}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="example">Example</label>
          <textarea
            id="example"
            name="example"
            rows="3"
            value={form.example}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="needTest">Need Test</label>
          <input
            type="text"
            id="needTest"
            name="needTest"
            value={form.needTest}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
