import { useEffect, useState } from 'react'
import './ByDate.css'
import Calendar from './Calendar'
import Dictation from './Dictation'

const API_BASE_URL = '/api'

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

function ByDate() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const handleSelectDate = (date) => {
    if (!date) return
    setSelectedDate(date)
  }

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date selected'

  return (
    <div className="bydate">
      <h1>Dictation by Date</h1>
      <p className="bydate__hint">
        {loading
          ? 'Loading available dates...'
          : 'Select a date from the available list.'}
      </p>
      {error && <div className="bydate__error">Error: {error}</div>}

      {selectedDate ? (
        <>
          <div className="bydate__selected">
            Selected: <span>{selectedLabel}</span>
          </div>
          <Dictation />
        </>
      ) : (
        <Calendar
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      )}
    </div>
  )
}

export default ByDate
