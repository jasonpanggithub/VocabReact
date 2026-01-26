import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import './Edit.css'

import { API_BASE_URL } from '../../config/api'

function Edit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vocab, setVocab] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVocab = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/Vocabularies/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch vocabulary data')
        }
        const data = await response.json()
        setVocab(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVocab()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setVocab((prevVocab) => ({
      ...prevVocab,
      [name]: value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/Vocabularies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vocab),
      })
      if (!response.ok) {
        throw new Error('Failed to save vocabulary data')
      }
      console.log('Save successful')
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

  if (!id) {
    return (
      <div className="edit-form">
        <h1>Edit Vocabulary Entry</h1>
        <p>Please choose a vocabulary item from the list to edit.</p>
        <Link to="/list" className="btn btn-primary">
          Go to List
        </Link>
      </div>
    )
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!vocab) return null

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    return dateTimeString.slice(0, 16) // Format for datetime-local
  }

  return (
    <div className="edit-form">
      <h1>Edit Vocabulary Entry</h1>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="spelling">Spelling</label>
          <input
            type="text"
            id="spelling"
            name="spelling"
            value={vocab.spelling || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="stem">Stem</label>
          <input
            type="text"
            id="stem"
            name="stem"
            value={vocab.stem || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pronunciation">Pronunciation</label>
          <input
            type="text"
            id="pronunciation"
            name="pronunciation"
            value={vocab.pronunciation || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="definition">Definition</label>
          <input
            type="text"
            id="definition"
            name="definition"
            value={vocab.definition || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="example">Example</label>
          <textarea
            id="example"
            name="example"
            rows="3"
            value={vocab.example || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="attempt">Attempt</label>
            <input
              type="number"
              id="attempt"
              name="attempt"
              value={vocab.attempt || 0}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="successTotal">Success Total</label>
            <input
              type="number"
              id="successTotal"
              name="successTotal"
              value={vocab.successTotal || 0}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="failTotal">Fail Total</label>
            <input
              type="number"
              id="failTotal"
              name="failTotal"
              value={vocab.failTotal || 0}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="needTest">Need Test</label>
            <input
              type="text"
              id="needTest"
              name="needTest"
              value={vocab.needTest || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastResult">Last Result</label>
            <input
              type="text"
              id="lastResult"
              name="lastResult"
              value={vocab.lastResult || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="createdDate">Created Date</label>
            <input
              type="datetime-local"
              id="createdDate"
              name="createdDate"
              value={formatDateTime(vocab.createdDate)}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="updatedDate">Updated Date</label>
            <input
              type="datetime-local"
              id="updatedDate"
              name="updatedDate"
              value={formatDateTime(vocab.updatedDate)}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastAttempt">Last Attempt</label>
            <input
              type="datetime-local"
              id="lastAttempt"
              name="lastAttempt"
              value={formatDateTime(vocab.lastAttempt)}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastCorrect">Last Correct</label>
            <input
              type="datetime-local"
              id="lastCorrect"
              name="lastCorrect"
              value={formatDateTime(vocab.lastCorrect)}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastFail">Last Fail</label>
            <input
              type="datetime-local"
              id="lastFail"
              name="lastFail"
              value={formatDateTime(vocab.lastFail)}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="button" className="btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit

