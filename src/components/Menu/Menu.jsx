import { useState } from 'react'
import './Menu.css'

function Menu() {
  const [open, setOpen] = useState(false)

  return (
    <header className="menu">
      <div className="menu__bar">
        <div className="menu__brand">Vocab</div>
        <button
          className="menu__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="menu__toggle-text">Menu</span>
          <span className="menu__toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      <nav
        id="primary-navigation"
        className={`menu__links ${open ? 'is-open' : ''}`}
      >
        <a href="#">Home</a>
        <a href="#">Practice</a>
        <a href="#">Lists</a>
        <a href="#">About</a>
      </nav>
    </header>
  )
}

export default Menu
