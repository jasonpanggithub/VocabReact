import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'

const initialForm = {
  spelling: '',
  stem: '',
  definition: '',
  needTest: 'Y',
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
    <div className="container py-4">
      <div className="card bg-dark text-light border-secondary p-4">
        <h1 className="h4 mb-3">Add Vocabulary</h1>
        {error && <div className="text-danger mb-2">Error: {error}</div>}
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="spelling" className="form-label">
              Spelling
            </label>
            <input
              type="text"
              id="spelling"
              name="spelling"
              className="form-control bg-dark text-light border-secondary"
              value={form.spelling}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="stem" className="form-label">
              Stem
            </label>
            <input
              type="text"
              id="stem"
              name="stem"
              className="form-control bg-dark text-light border-secondary"
              value={form.stem}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="pronunciation" className="form-label">
              Pronunciation
            </label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              className="form-control bg-dark text-light border-secondary"
              value={form.pronunciation}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="needTest" className="form-label">
              Need Test
            </label>
            <input
              type="text"
              id="needTest"
              name="needTest"
              className="form-control bg-dark text-light border-secondary"
              value={form.needTest}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label htmlFor="definition" className="form-label">
              Definition
            </label>
            <input
              type="text"
              id="definition"
              name="definition"
              className="form-control bg-dark text-light border-secondary"
              value={form.definition}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="example" className="form-label">
              Example
            </label>
            <textarea
              id="example"
              name="example"
              rows="3"
              className="form-control bg-dark text-light border-secondary"
              value={form.example}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add
