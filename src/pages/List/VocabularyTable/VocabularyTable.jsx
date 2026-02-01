import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination/Pagination'
import { API_BASE_URL } from '../../../config/api'
import './VocabularyTable.css'

const PAGE_LENGTH = 5

function VocabularyTable() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchVocabulary = async (pageNum) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${API_BASE_URL}/Vocabularies?page=${pageNum}&pageSize=${PAGE_LENGTH}`
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch vocabulary data (${response.status})`)
      }
      const result = await response.json()
      setData(result.items)
      setTotalRecords(result.totalCount)
      setCurrentPage(pageNum)
    } catch (err) {
      setError(err.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVocabulary(1)
  }, [])

  const searchVocabulary = async (term, pageNum = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${API_BASE_URL}/Vocabularies/search?q=${encodeURIComponent(
          term
        )}&page=${pageNum}&pageSize=${PAGE_LENGTH}`
      )
      if (!response.ok) {
        throw new Error(`Failed to search vocabulary (${response.status})`)
      }
      const result = await response.json()
      const items = Array.isArray(result) ? result : result.items || []
      const totalCount = result.totalCount ?? items.length
      setData(items)
      setTotalRecords(totalCount)
      setCurrentPage(pageNum)
    } catch (err) {
      setError(err.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const trimmed = searchTerm.trim()
    if (trimmed) {
      searchVocabulary(trimmed, 1)
    } else {
      fetchVocabulary(1)
    }
  }

  const totalPages = Math.ceil(totalRecords / PAGE_LENGTH)

  const handlePageChange = (pageNum) => {
    const trimmed = searchTerm.trim()
    if (trimmed) {
      searchVocabulary(trimmed, pageNum)
    } else {
      fetchVocabulary(pageNum)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this vocabulary entry?')
    if (!confirmed) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/Vocabularies/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`Failed to delete vocabulary (${response.status})`)
      }
      const trimmed = searchTerm.trim()
      if (trimmed) {
        await searchVocabulary(trimmed, currentPage)
        return
      }
      const nextPage =
        data.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage
      await fetchVocabulary(nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-4">Loading...</div>
  if (error) return <div className="text-center text-danger py-4">Error: {error}</div>

  return (
    <div className="container py-3">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3">
        <h2 className="h4 m-0">Vocabulary List</h2>
        <form className="d-flex gap-2" onSubmit={handleSearchSubmit}>
          <input
            className="form-control bg-dark text-light border-secondary"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Type a term..."
            aria-label="Search vocabulary"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Spelling</th>
              <th>Pronunciation</th>
              <th>Definition</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((vocab) => (
                <tr key={vocab.id} className="vocabulary-table__row-hover">
                  <td>{vocab.spelling}</td>
                  <td>{vocab.pronunciation || '—'}</td>
                  <td>{vocab.definition}</td>
                  <td className="text-end">
                    <Link
                      to={`/edit/${vocab.id}`}
                      className="btn btn-sm btn-outline-light me-2"
                      aria-label={`Edit ${vocab.spelling}`}
                      title="Edit"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(vocab.id)}
                      aria-label={`Delete ${vocab.spelling}`}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No vocabulary data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default VocabularyTable

