import './Pagination.css'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const handlePageClick = (pageNum) => {
    onPageChange(pageNum)
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
    <div className="pagination">
      <button
        className="pagination__button pagination__button--prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            className="pagination__page-num"
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="pagination__ellipsis">...</span>}
        </>
      )}

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          className={`pagination__page-num ${
            pageNum === currentPage ? 'pagination__page-num--active' : ''
          }`}
          onClick={() => handlePageClick(pageNum)}
          aria-current={pageNum === currentPage ? 'page' : undefined}
        >
          {pageNum}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="pagination__ellipsis">...</span>
          )}
          <button
            className="pagination__page-num"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination__button pagination__button--next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>

    </div>
  )
}

export default Pagination
