import { useState, useEffect } from 'react'
import './VocabularyTable.css'
import Pagination from '../Pagination/Pagination'

const API_BASE_URL = '/api'
const PAGE_LENGTH = 10

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
      const start = (pageNum - 1) * PAGE_LENGTH
      const response = await fetch(
        `${API_BASE_URL}/Vocabulary/Search?draw=1&start=${start/PAGE_LENGTH}&length=${PAGE_LENGTH}`
      )
      if (!response.ok) throw new Error('Failed to fetch vocabulary data')
      const result = await response.json()
      setData(result.data || [])
      setTotalRecords(result.recordsTotal || 0)
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
      <h2 className="vocabulary-table__title">Vocabulary Practice</h2>
      <table className="vocabulary-table__data">
        <thead>
          <tr>
            <th className="vocabulary-table__header">Spelling</th>
            <th className="vocabulary-table__header">Pronunciation</th>
            <th className="vocabulary-table__header">Definition</th>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="vocabulary-table__empty">
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
