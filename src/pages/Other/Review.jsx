import { useEffect, useState } from 'react'
import Calendar from '../../components/Calendar/Calendar'
import { API_BASE_URL } from '../../config/api'
import './Review.css'

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeDateValue(value) {
  if (typeof value !== 'string') return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return toDateKey(parsed)
}

function speakWord(word) {
  if (!window.responsiveVoice || typeof window.responsiveVoice.speak !== 'function') {
    return
  }
  if (!word) return
  window.responsiveVoice.speak(word)
}

function Review() {
  const [sourceType, setSourceType] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(null)
  const [lastSelectedDate, setLastSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [error, setError] = useState(null)
  const [vocabList, setVocabList] = useState([])

  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoadingDates(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/Vocabularies/updated-dates`)
        if (!response.ok) {
          throw new Error(`Failed to load dates (${response.status})`)
        }
        const result = await response.json()
        const normalized = Array.isArray(result)
          ? result.map(normalizeDateValue).filter(Boolean)
          : []
        setAvailableDates(normalized)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingDates(false)
      }
    }

    fetchAvailableDates()
  }, [])

  useEffect(() => {
    const endpointBySource = {
      failed: `${API_BASE_URL}/Vocabularies/failed-to-test`,
      tnplus: `${API_BASE_URL}/Vocabularies/tn-plus`,
    }
    const isCalendar = sourceType === 'calendar'
    if (isCalendar && !selectedDate) return

    const fetchVocabularies = async () => {
      setLoadingList(true)
      setError(null)
      try {
        const endpoint = isCalendar
          ? `${API_BASE_URL}/Vocabularies/by-updated-date?date=${toDateKey(selectedDate)}`
          : endpointBySource[sourceType]
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`Failed to load vocabularies (${response.status})`)
        }
        const result = await response.json()
        setVocabList(Array.isArray(result) ? result : [])
      } catch (err) {
        setError(err.message)
        setVocabList([])
      } finally {
        setLoadingList(false)
      }
    }

    fetchVocabularies()
  }, [selectedDate, sourceType])

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date selected'

  return (
    <div className="review-page">
      <h1>Review</h1>
      <div className="review-page__toolbar">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="review-source"
            id="review-source-calendar"
            value="calendar"
            checked={sourceType === 'calendar'}
            onChange={() => {
              setSourceType('calendar')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="review-source-calendar">
            Calendar
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="review-source"
            id="review-source-failed"
            value="failed"
            checked={sourceType === 'failed'}
            onChange={() => {
              setSourceType('failed')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="review-source-failed">
            By Failed
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="review-source"
            id="review-source-tnplus"
            value="tnplus"
            checked={sourceType === 'tnplus'}
            onChange={() => {
              setSourceType('tnplus')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="review-source-tnplus">
            By TN+
          </label>
        </div>
      </div>

      {sourceType === 'calendar' && !selectedDate && (
        <p className="review-page__hint">
          {loadingDates ? 'Loading available dates...' : 'Select a date from the available list.'}
        </p>
      )}
      {error && <div className="review-page__error">Error: {error}</div>}

      {sourceType === 'calendar' && selectedDate ? (
        <>
          <div className="review-page__selected">
            Selected: <span>{selectedLabel}</span>
          </div>
          <div className="review-page__toolbar">
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                setSelectedDate(null)
                setVocabList([])
                setError(null)
              }}
            >
              Change Date
            </button>
          </div>

          {loadingList ? (
            <div className="review-page__loading">Loading vocabularies...</div>
          ) : vocabList.length === 0 ? (
            <div className="review-page__empty">No vocabularies available.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover align-middle review-page__table">
                <thead>
                  <tr>
                    <th scope="col">Spelling</th>
                    <th scope="col">Stem</th>
                    <th scope="col">Definition</th>
                    <th scope="col">Example</th>
                    <th scope="col">Pronunciation</th>
                    <th scope="col" className="text-center">
                      Speak
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vocabList.map((item) => (
                    <tr key={item.id || item.spelling}>
                      <td>{item.spelling || '-'}</td>
                      <td>{item.stem || '-'}</td>
                      <td>{item.definition || '-'}</td>
                      <td>{item.example || '-'}</td>
                      <td>{item.pronunciation || '-'}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light review-page__speak-btn"
                          onClick={() => speakWord(item.spelling)}
                          aria-label={`Speak ${item.spelling || 'vocabulary'}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M9 3.5a.5.5 0 0 1 .8-.4L12.2 5H14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.8L9.8 12.9A.5.5 0 0 1 9 12.5v-9zM4 6h2v4H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
                            <path d="M11.5 6.2a.5.5 0 0 1 .7.1c.7.9.7 2.5 0 3.4a.5.5 0 1 1-.8-.6c.4-.6.4-1.6 0-2.2a.5.5 0 0 1 .1-.7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : sourceType === 'calendar' ? (
        <Calendar
          availableDates={availableDates}
          selectedDate={selectedDate ?? lastSelectedDate}
          focusedDate={lastSelectedDate}
          onSelectDate={(date) => {
            if (!date) return
            setSelectedDate(date)
            setLastSelectedDate(date)
          }}
        />
      ) : loadingList ? (
        <div className="review-page__loading">Loading vocabularies...</div>
      ) : vocabList.length === 0 ? (
        <div className="review-page__empty">No vocabularies available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover align-middle review-page__table">
            <thead>
              <tr>
                <th scope="col">Spelling</th>
                <th scope="col">Stem</th>
                <th scope="col">Definition</th>
                <th scope="col">Example</th>
                <th scope="col">Pronunciation</th>
                <th scope="col" className="text-center">
                  Speak
                </th>
              </tr>
            </thead>
            <tbody>
              {vocabList.map((item) => (
                <tr key={item.id || item.spelling}>
                  <td>{item.spelling || '-'}</td>
                  <td>{item.stem || '-'}</td>
                  <td>{item.definition || '-'}</td>
                  <td>{item.example || '-'}</td>
                  <td>{item.pronunciation || '-'}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light review-page__speak-btn"
                      onClick={() => speakWord(item.spelling)}
                      aria-label={`Speak ${item.spelling || 'vocabulary'}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9 3.5a.5.5 0 0 1 .8-.4L12.2 5H14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.8L9.8 12.9A.5.5 0 0 1 9 12.5v-9zM4 6h2v4H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
                        <path d="M11.5 6.2a.5.5 0 0 1 .7.1c.7.9.7 2.5 0 3.4a.5.5 0 1 1-.8-.6c.4-.6.4-1.6 0-2.2a.5.5 0 0 1 .1-.7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Review
