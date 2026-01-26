import { useEffect, useState } from 'react'
import './NewWord.css'

const defaultForm = {
  add: false,
  needTest: true,
  spelling: '',
  pronunciation: '',
  stem: '',
  definition: '',
  example: '',
}

function NewWord({ data, onChange }) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (!data) return
    setForm((prev) => ({
      ...prev,
      ...data,
    }))
  }, [data])

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    const nextForm = {
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    }
    setForm(nextForm)
    if (onChange) {
      onChange(nextForm)
    }
  }

  return (
    <div className="new-word">
      <div className="new-word__row">
        <label className="new-word__check">
          <input
            type="checkbox"
            name="add"
            checked={form.add}
            onChange={handleChange}
          />
          <span>Add</span>
        </label>
        <label className="new-word__check">
          <input
            type="checkbox"
            name="needTest"
            checked={form.needTest}
            onChange={handleChange}
          />
          <span>Need Test</span>
        </label>
        <input
          className="new-word__input"
          name="spelling"
          type="text"
          placeholder="Spelling"
          value={form.spelling}
          onChange={handleChange}
        />
        <input
          className="new-word__input"
          name="pronunciation"
          type="text"
          placeholder="Pronunciation"
          value={form.pronunciation}
          onChange={handleChange}
        />
        <input
          className="new-word__input"
          name="stem"
          type="text"
          placeholder="Stem"
          value={form.stem}
          onChange={handleChange}
        />
        <input
          className="new-word__input"
          name="definition"
          type="text"
          placeholder="Definition"
          value={form.definition}
          onChange={handleChange}
        />
        <input
          className="new-word__input"
          name="example"
          type="text"
          placeholder="Example"
          value={form.example}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default NewWord
