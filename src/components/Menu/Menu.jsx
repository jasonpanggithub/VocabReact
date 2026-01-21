import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Menu.css'

function Menu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/practice', label: 'Practice' },
    { path: '/lists', label: 'Lists' },
    { path: '/about', label: 'About' },
  ]

  const handleNavigation = () => {
    setOpen(false)
  }

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
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu__link ${
              location.pathname === item.path ? 'menu__link--active' : ''
            }`}
            onClick={handleNavigation}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default Menu
