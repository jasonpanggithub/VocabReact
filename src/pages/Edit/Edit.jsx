import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
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
      <div className="container py-4">
        <div className="card bg-dark text-light border-secondary p-4 text-center">
          <h1 className="h4">Edit Vocabulary Entry</h1>
          <p>Please choose a vocabulary item from the list to edit.</p>
          <Link to="/list" className="btn btn-primary">
            Go to List
          </Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-center py-4">Loading...</div>
  if (error) return <div className="text-center text-danger py-4">Error: {error}</div>
  if (!vocab) return null

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    return dateTimeString.slice(0, 16)
  }

  return (
    <div className="container py-4">
      <div className="card bg-dark text-light border-secondary p-4">
        <h1 className="h4 mb-3">Edit Vocabulary Entry</h1>
        <form onSubmit={handleSave} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="spelling" className="form-label">Spelling</label>
            <input
              type="text"
              id="spelling"
              name="spelling"
              className="form-control bg-dark text-light border-secondary"
              value={vocab.spelling || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="stem" className="form-label">Stem</label>
            <input
              type="text"
              id="stem"
              name="stem"
              className="form-control bg-dark text-light border-secondary"
              value={vocab.stem || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="pronunciation" className="form-label">Pronunciation</label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              className="form-control bg-dark text-light border-secondary"
              value={vocab.pronunciation || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="definition" className="form-label">Definition</label>
            <input
              type="text"
              id="definition"
              name="definition"
              className="form-control bg-dark text-light border-secondary"
              value={vocab.definition || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label htmlFor="example" className="form-label">Example</label>
            <textarea
              id="example"
              name="example"
              rows="3"
              className="form-control bg-dark text-light border-secondary"
              value={vocab.example || ''}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="attempt" className="form-label">Attempt</label>
                <input
                  type="number"
                  id="attempt"
                  name="attempt"
                  className="form-control bg-dark text-light border-secondary"
                  value={vocab.attempt || 0}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="successTotal" className="form-label">Success Total</label>
                <input
                  type="number"
                  id="successTotal"
                  name="successTotal"
                  className="form-control bg-dark text-light border-secondary"
                  value={vocab.successTotal || 0}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="failTotal" className="form-label">Fail Total</label>
                <input
                  type="number"
                  id="failTotal"
                  name="failTotal"
                  className="form-control bg-dark text-light border-secondary"
                  value={vocab.failTotal || 0}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="needTest" className="form-label">Need Test</label>
                <input
                  type="text"
                  id="needTest"
                  name="needTest"
                  className="form-control bg-dark text-light border-secondary"
                  value={vocab.needTest || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="lastResult" className="form-label">Last Result</label>
                <input
                  type="text"
                  id="lastResult"
                  name="lastResult"
                  className="form-control bg-dark text-light border-secondary"
                  value={vocab.lastResult || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="createdDate" className="form-label">Created Date</label>
                <input
                  type="datetime-local"
                  id="createdDate"
                  name="createdDate"
                  className="form-control bg-dark text-light border-secondary"
                  value={formatDateTime(vocab.createdDate)}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="updatedDate" className="form-label">Updated Date</label>
                <input
                  type="datetime-local"
                  id="updatedDate"
                  name="updatedDate"
                  className="form-control bg-dark text-light border-secondary"
                  value={formatDateTime(vocab.updatedDate)}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="lastAttempt" className="form-label">Last Attempt</label>
                <input
                  type="datetime-local"
                  id="lastAttempt"
                  name="lastAttempt"
                  className="form-control bg-dark text-light border-secondary"
                  value={formatDateTime(vocab.lastAttempt)}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="lastCorrect" className="form-label">Last Correct</label>
                <input
                  type="datetime-local"
                  id="lastCorrect"
                  name="lastCorrect"
                  className="form-control bg-dark text-light border-secondary"
                  value={formatDateTime(vocab.lastCorrect)}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="lastFail" className="form-label">Last Fail</label>
                <input
                  type="datetime-local"
                  id="lastFail"
                  name="lastFail"
                  className="form-control bg-dark text-light border-secondary"
                  value={formatDateTime(vocab.lastFail)}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-12 d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Edit

