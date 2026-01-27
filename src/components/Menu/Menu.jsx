import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import navItems from '../../navigation/navItems'
import './Menu.css'

function Menu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const handleNavigation = () => {
    setOpen(false)
  }

  return (
    <header className="menu navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">Vocab</span>
        <button
          className="navbar-toggler"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <nav
          id="primary-navigation"
          className={`collapse navbar-collapse ${open ? 'show' : ''}`}
        >
          <ul className="navbar-nav ms-auto">
            {navItems
              .filter((item) => item.label)
              .map((item) => {
                if (item.children?.length) {
                  const isActive = item.children.some((child) =>
                    location.pathname.startsWith(child.path)
                  )
                  return (
                    <li
                      key={item.label}
                      className={`nav-item dropdown ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className="nav-link dropdown-toggle"
                        aria-haspopup="true"
                      >
                        {item.label}
                      </button>
                      <ul className="dropdown-menu">
                        {item.children
                          .filter((child) => child.label)
                          .map((child) => {
                            const isChildActive =
                              child.path === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(child.path)
                            return (
                              <li key={child.path}>
                                <Link
                                  to={child.path}
                                  className={`dropdown-item ${
                                    isChildActive ? 'active' : ''
                                  }`}
                                  onClick={handleNavigation}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            )
                          })}
                      </ul>
                    </li>
                  )
                }

                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path)
                return (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={handleNavigation}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Menu
