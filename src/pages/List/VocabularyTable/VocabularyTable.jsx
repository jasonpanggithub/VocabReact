import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './VocabularyTable.css'
import Pagination from '../Pagination/Pagination'

const API_BASE_URL = '/api'
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

  const searchVocabulary = async (term) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${API_BASE_URL}/Vocabularies/search?q=${encodeURIComponent(term)}`
      )
      if (!response.ok) {
        throw new Error(`Failed to search vocabulary (${response.status})`)
      }
      const result = await response.json()
      const items = Array.isArray(result) ? result : result.items || []
      setData(items)
      setTotalRecords(items.length)
      setCurrentPage(1)
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
      searchVocabulary(trimmed)
    } else {
      fetchVocabulary(1)
    }
  }

  const totalPages = Math.ceil(totalRecords / PAGE_LENGTH)
  const isSearching = searchTerm.trim().length > 0

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
      if (isSearching) {
        const trimmed = searchTerm.trim()
        if (trimmed) {
          await searchVocabulary(trimmed)
          return
        }
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

  if (loading) return <div className="vocabulary-table__loading">Loading...</div>
  if (error) return <div className="vocabulary-table__error">Error: {error}</div>

  return (
    <div className="vocabulary-table">
      <form className="vocabulary-table__header-row" onSubmit={handleSearchSubmit}>
        <h2 className="vocabulary-table__title">Vocabulary List</h2>
        <div className="vocabulary-table__search-controls">
          
            
            <input
              className="vocabulary-table__search-input"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Type a term..."
              aria-label="Search vocabulary"
            />
          
          <button className="vocabulary-table__search-button" type="submit">
            Search
          </button>
        </div>
      </form>
      <table className="vocabulary-table__data">
        <thead>
          <tr>
            <th className="vocabulary-table__header">Spelling</th>
            <th className="vocabulary-table__header">Pronunciation</th>
            <th className="vocabulary-table__header">Definition</th>
            <th className="vocabulary-table__header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((vocab) => (
              <tr key={vocab.id} className="vocabulary-table__row">
                <td className="vocabulary-table__cell">{vocab.spelling}</td>
                <td className="vocabulary-table__cell">
                  {vocab.pronunciation || '—'}
                </td>
                <td className="vocabulary-table__cell">{vocab.definition}</td>
                <td className="vocabulary-table__cell">
                  <Link
                    to={`/edit/${vocab.id}`}
                    className="vocabulary-table__action-link"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="vocabulary-table__delete-button"
                    onClick={() => handleDelete(vocab.id)}
                    aria-label={`Delete ${vocab.spelling}`}
                    title="Delete"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="vocabulary-table__empty">
                No vocabulary data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isSearching && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={fetchVocabulary}
        />
      )}
    </div>
  )
}

export default VocabularyTable
