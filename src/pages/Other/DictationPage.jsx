import { useEffect, useState } from 'react'
import './DictationPage.css'
import Calendar from '../../components/Calendar/Calendar'
import Dictation from '../../components/Dictation/Dictation'
import { API_BASE_URL } from '../../config/api'

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

function DictationPage() {
  const [sourceType, setSourceType] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(null)
  const [lastSelectedDate, setLastSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [vocabList, setVocabList] = useState([])

  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoading(true)
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
        setLoading(false)
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
      setLoading(true)
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
      } catch (err) {
        setError(err.message)
        setVocabList([])
      } finally {
        setLoading(false)
      }
    }

    fetchVocabularies()
  }, [selectedDate, sourceType])

  const handleSelectDate = (date) => {
    if (!date) return
    setSelectedDate(date)
    setLastSelectedDate(date)
  }

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date selected'
  const isCalendarMode = sourceType === 'calendar'

  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null
  const dictationKey = selectedDateKey
    ? `${sourceType}-${selectedDateKey}-${vocabList.length}`
    : `${sourceType}-${vocabList.length}`

  return (
    <div className="bydate">
      <h1>Dictation</h1>
      <div className="bydate__toolbar">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="bydate-source"
            id="bydate-source-calendar"
            value="calendar"
            checked={sourceType === 'calendar'}
            onChange={() => {
              setSourceType('calendar')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="bydate-source-calendar">
            Calendar
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="bydate-source"
            id="bydate-source-failed"
            value="failed"
            checked={sourceType === 'failed'}
            onChange={() => {
              setSourceType('failed')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="bydate-source-failed">
            By Failed
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="bydate-source"
            id="bydate-source-tnplus"
            value="tnplus"
            checked={sourceType === 'tnplus'}
            onChange={() => {
              setSourceType('tnplus')
              setError(null)
            }}
          />
          <label className="form-check-label" htmlFor="bydate-source-tnplus">
            By TN+
          </label>
        </div>
      </div>

      {isCalendarMode && !selectedDate && (
        <p className="bydate__hint">
          {loading
            ? 'Loading available dates...'
            : 'Select a date from the available list.'}
        </p>
      )}
      {error && <div className="bydate__error">Error: {error}</div>}

      {isCalendarMode && selectedDate && (
        <>
          <div className="bydate__selected">
            Selected: <span>{selectedLabel}</span>
          </div>
          <div className="bydate__toolbar">
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
        </>
      )}

      {isCalendarMode && !selectedDate ? (
        <Calendar
          availableDates={availableDates}
          selectedDate={selectedDate ?? lastSelectedDate}
          focusedDate={lastSelectedDate}
          onSelectDate={handleSelectDate}
        />
      ) : loading ? (
        <div className="bydate__loading">Loading vocabularies...</div>
      ) : (
        <Dictation
          key={dictationKey}
          vocabList={vocabList}
          onUpdateList={setVocabList}
        />
      )}
    </div>
  )
}

export default DictationPage

