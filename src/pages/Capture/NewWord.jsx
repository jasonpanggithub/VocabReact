import { useEffect, useState } from 'react'

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
    <div className="card bg-dark text-light border-secondary p-2">
      <div className="row g-2 align-items-center">
        <div className="col-auto">
          <label className="form-check d-flex align-items-center gap-1 m-0">
            <input
              className="form-check-input"
              type="checkbox"
              name="add"
              checked={form.add}
              onChange={handleChange}
            />
            <span className="form-check-label">Add</span>
          </label>
        </div>
        <div className="col-auto">
          <label className="form-check d-flex align-items-center gap-1 m-0">
            <input
              className="form-check-input"
              type="checkbox"
              name="needTest"
              checked={form.needTest}
              onChange={handleChange}
            />
            <span className="form-check-label">Need Test</span>
          </label>
        </div>
        <div className="col-sm-2">
          <label className="form-label mb-1">Spelling</label>
          <input
            className="form-control form-control-sm bg-dark text-light border-secondary"
            name="spelling"
            type="text"
            placeholder="Spelling"
            value={form.spelling}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-1">
          <label className="form-label mb-1">Pronunciation</label>
          <input
            className="form-control form-control-sm bg-dark text-light border-secondary"
            name="pronunciation"
            type="text"
            placeholder="Pronunciation"
            value={form.pronunciation}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-1">
          <label className="form-label mb-1">Stem</label>
          <input
            className="form-control form-control-sm bg-dark text-light border-secondary"
            name="stem"
            type="text"
            placeholder="Stem"
            value={form.stem}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label mb-1">Definition</label>
          <input
            className="form-control form-control-sm bg-dark text-light border-secondary"
            name="definition"
            type="text"
            placeholder="Definition"
            value={form.definition}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label mb-1">Example</label>
          <input
            className="form-control form-control-sm bg-dark text-light border-secondary"
            name="example"
            type="text"
            placeholder="Example"
            value={form.example}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default NewWord
