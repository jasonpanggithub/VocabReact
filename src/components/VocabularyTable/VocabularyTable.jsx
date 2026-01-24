import { useState, useEffect } from 'react'
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
      const items = Array.isArray(result)
        ? result
        : result.items || result.data || result.results || []
      const totalCountHeader = response.headers.get('x-total-count')
      const totalCount = Number.isFinite(Number(totalCountHeader))
        ? Number(totalCountHeader)
        : result.totalCount || result.total || result.count || items.length
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

  useEffect(() => {
    fetchVocabulary(1)
  }, [])

  const totalPages = Math.ceil(totalRecords / PAGE_LENGTH)

  if (loading) return <div className="vocabulary-table__loading">Loading...</div>
  if (error) return <div className="vocabulary-table__error">Error: {error}</div>

  return (
    <div className="vocabulary-table">
      <h2 className="vocabulary-table__title">Vocabulary List</h2>
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchVocabulary}
      />
    </div>
  )
}

export default VocabularyTable
