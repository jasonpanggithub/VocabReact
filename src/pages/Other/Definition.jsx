import { useEffect, useRef, useState } from 'react'
import Calendar from '../../components/Calendar/Calendar'
import { API_BASE_URL } from '../../config/api'
import './Definition.css'

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

function playWord(word) {
  if (!window.responsiveVoice || typeof window.responsiveVoice.speak !== 'function') {
    return
  }
  if (!word) return
  window.responsiveVoice.speak(word)
}

function Definition() {
  const [sourceType, setSourceType] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(null)
  const [lastSelectedDate, setLastSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [error, setError] = useState(null)
  const [vocabList, setVocabList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const spokenRef = useRef(null)

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
    const isCalendarMode = sourceType === 'calendar'
    if (isCalendarMode && !selectedDate) return

    const fetchVocabularies = async () => {
      setLoadingList(true)
      setError(null)
      try {
        const endpoint = isCalendarMode
          ? `${API_BASE_URL}/Vocabularies/by-updated-date?date=${toDateKey(selectedDate)}`
          : endpointBySource[sourceType]
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`Failed to load vocabularies (${response.status})`)
        }
        const result = await response.json()
        const list = Array.isArray(result) ? result : []
        setVocabList(list)
        setCurrentIndex(0)
        setShowDetails(false)
        spokenRef.current = null
      } catch (err) {
        setError(err.message)
        setVocabList([])
      } finally {
        setLoadingList(false)
      }
    }

    fetchVocabularies()
  }, [selectedDate, sourceType])

  const currentVocab = vocabList[currentIndex] || null

  useEffect(() => {
    if (!currentVocab?.spelling) return
    if (spokenRef.current === currentVocab.spelling) return
    playWord(currentVocab.spelling)
    spokenRef.current = currentVocab.spelling
  }, [currentVocab?.spelling])

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date selected'
  const isCalendarMode = sourceType === 'calendar'

  return (
    <div className="definition-page">
      <h1>Definition</h1>
      <div className="definition-page__toolbar">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="definition-source"
            id="definition-source-calendar"
            value="calendar"
            checked={sourceType === 'calendar'}
            onChange={() => {
              setSourceType('calendar')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="definition-source-calendar">
            Calendar
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="definition-source"
            id="definition-source-failed"
            value="failed"
            checked={sourceType === 'failed'}
            onChange={() => {
              setSourceType('failed')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="definition-source-failed">
            By Failed
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="definition-source"
            id="definition-source-tnplus"
            value="tnplus"
            checked={sourceType === 'tnplus'}
            onChange={() => {
              setSourceType('tnplus')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="definition-source-tnplus">
            By TN+
          </label>
        </div>
      </div>

      {isCalendarMode && !selectedDate && (
        <p className="definition-page__hint">
          {loadingDates ? 'Loading available dates...' : 'Select a date from the available list.'}
        </p>
      )}
      {error && <div className="definition-page__error">Error: {error}</div>}

      {isCalendarMode && selectedDate && (
        <>
          <div className="definition-page__selected">
            Selected: <span>{selectedLabel}</span>
          </div>
          <div className="definition-page__toolbar">
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                setSelectedDate(null)
                setVocabList([])
                setCurrentIndex(0)
                setShowDetails(false)
                setError(null)
                spokenRef.current = null
              }}
            >
              Change Date
            </button>
          </div>
        </>
      )}

      {isCalendarMode && !selectedDate ? (
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
        <div className="definition-page__loading">Loading vocabularies...</div>
      ) : !currentVocab ? (
        <div className="definition-page__empty">No vocabularies available.</div>
      ) : (
        <div className="card bg-dark text-light border-secondary p-3">
              <div className="row g-2 text-center mb-3">
                <div className="col-sm">
                  <div className="fw-semibold">Total</div>
                  <div>{vocabList.length}</div>
                </div>
                <div className="col-sm">
                  <div className="fw-semibold">Current</div>
                  <div>{currentIndex + 1}</div>
                </div>
              </div>

              <div className="definition-page__spelling">{currentVocab.spelling}</div>

              <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => playWord(currentVocab.spelling)}
                >
                  Play
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (currentIndex >= vocabList.length - 1) return
                    setCurrentIndex((prev) => prev + 1)
                    setShowDetails(false)
                    spokenRef.current = null
                  }}
                  disabled={currentIndex >= vocabList.length - 1}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowDetails((prev) => !prev)}
                >
                  {showDetails ? 'Hide' : 'Show'}
                </button>
              </div>

              {showDetails && (
                <div className="definition-page__details mt-3">
                  <div className="row g-2 mb-2">
                    <div className="col-sm-3 fw-semibold text-start">Stem</div>
                    <div className="col-sm-9 text-start">{currentVocab.stem || '-'}</div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-sm-3 fw-semibold text-start">Definition</div>
                    <div className="col-sm-9 text-start">{currentVocab.definition || '-'}</div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-sm-3 fw-semibold text-start">Example</div>
                    <div className="col-sm-9 text-start">{currentVocab.example || '-'}</div>
                  </div>
                  <div className="row g-2">
                    <div className="col-sm-3 fw-semibold text-start">Pronunciation</div>
                    <div className="col-sm-9 text-start">{currentVocab.pronunciation || '-'}</div>
                  </div>
                </div>
              )}
        </div>
      )}
    </div>
  )
}

export default Definition
