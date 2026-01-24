import { useMemo, useState } from 'react'
import './Calendar.css'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toMondayIndex(day) {
  return (day + 6) % 7
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Calendar({ availableDates, selectedDate, onSelectDate }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const leading = toMondayIndex(firstDay)
    const totalCells = 42
    const cells = []

    for (let i = 0; i < totalCells; i += 1) {
      const dayNum = i - leading + 1
      if (dayNum < 1 || dayNum > daysInMonth) {
        cells.push(null)
      } else {
        const date = new Date(year, month, dayNum)
        cells.push(date)
      }
    }

    return cells
  }, [viewDate])

  const availableSet = useMemo(
    () => new Set(availableDates),
    [availableDates]
  )

  const handlePrevMonth = () => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }

  const handlePrevYear = () => {
    setViewDate(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1)
    )
  }

  const handleNextYear = () => {
    setViewDate(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1)
    )
  }

  const title = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bydate__calendar">
      <div className="bydate__calendar-header">
        <div className="bydate__nav-group">
          <button
            type="button"
            className="bydate__nav"
            onClick={handlePrevYear}
            aria-label="Previous year"
          >
            {'<<'}
          </button>
          <button
            type="button"
            className="bydate__nav"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            {'<'}
          </button>
        </div>
        <div className="bydate__month">{title}</div>
        <div className="bydate__nav-group">
          <button
            type="button"
            className="bydate__nav"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            {'>'}
          </button>
          <button
            type="button"
            className="bydate__nav"
            onClick={handleNextYear}
            aria-label="Next year"
          >
            {'>>'}
          </button>
        </div>
      </div>

      <div className="bydate__weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="bydate__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="bydate__grid">
        {calendarCells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="bydate__cell empty" />
          }

          const key = toDateKey(date)
          const isAvailable = availableSet.has(key)
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString()

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`bydate__cell ${
                isAvailable ? 'enabled' : 'disabled'
              } ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDate(date)}
              disabled={!isAvailable}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
