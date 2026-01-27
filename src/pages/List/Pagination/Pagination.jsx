import { useEffect, useMemo, useState } from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [jumpInput, setJumpInput] = useState(String(currentPage))

  useEffect(() => {
    setJumpInput(String(currentPage))
  }, [currentPage])

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const handlePageClick = (pageNum) => {
    onPageChange(pageNum)
  }

  const jumpTarget = useMemo(() => {
    if (!jumpInput) return null
    const parsed = Number.parseInt(jumpInput, 10)
    if (!Number.isFinite(parsed)) return null
    if (parsed < 1 || parsed > totalPages) return null
    return parsed
  }, [jumpInput, totalPages])

  const handleJump = (event) => {
    event.preventDefault()
    if (jumpTarget == null) return
    if (jumpTarget === currentPage) return
    onPageChange(jumpTarget)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
      <nav aria-label="Vocabulary pagination">
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link bg-dark text-light border-secondary" onClick={handlePrevious}>
              Previous
            </button>
          </li>

          {pageNumbers[0] > 1 && (
            <>
              <li className="page-item">
                <button className="page-link bg-dark text-light border-secondary" onClick={() => handlePageClick(1)}>
                  1
                </button>
              </li>
              {pageNumbers[0] > 2 && (
                <li className="page-item disabled">
                  <span className="page-link bg-dark text-light border-secondary">...</span>
                </li>
              )}
            </>
          )}

          {pageNumbers.map((pageNum) => (
            <li
              key={pageNum}
              className={`page-item ${pageNum === currentPage ? 'active' : ''}`}
            >
              <button
                className="page-link bg-dark text-light border-secondary"
                onClick={() => handlePageClick(pageNum)}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            </li>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link bg-dark text-light border-secondary">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link bg-dark text-light border-secondary"
                  onClick={() => handlePageClick(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link bg-dark text-light border-secondary" onClick={handleNext}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      <form className="d-flex align-items-center gap-2" onSubmit={handleJump}>
        <label className="form-label m-0" htmlFor="pagination-jump">
          Jump to
        </label>
        <input
          id="pagination-jump"
          className="form-control form-control-sm bg-dark text-light border-secondary"
          type="number"
          min="1"
          max={totalPages}
          inputMode="numeric"
          value={jumpInput}
          onChange={(event) => setJumpInput(event.target.value)}
          aria-label="Jump to page"
          style={{ width: '5rem' }}
        />
        <button className="btn btn-sm btn-outline-light" type="submit" disabled={jumpTarget == null}>
          Go
        </button>
      </form>
    </div>
  )
}

export default Pagination
