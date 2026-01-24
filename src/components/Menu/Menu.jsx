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
        {navItems
          .filter((item) => item.label)
          .map((item) => {
            if (item.children?.length) {
              const isActive = item.children.some((child) =>
                location.pathname.startsWith(child.path)
              )
              return (
                <div key={item.label} className="menu__item">
                  <button
                    type="button"
                    className={`menu__link menu__link--parent ${
                      isActive ? 'menu__link--active' : ''
                    }`}
                    aria-haspopup="true"
                  >
                    {item.label}
                  </button>
                  <div className="menu__submenu">
                    {item.children
                      .filter((child) => child.label)
                      .map((child) => {
                        const isChildActive =
                          child.path === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(child.path)
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`menu__sublink ${
                              isChildActive ? 'menu__sublink--active' : ''
                            }`}
                            onClick={handleNavigation}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                  </div>
                </div>
              )
            }

            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`menu__link ${
                  isActive ? 'menu__link--active' : ''
                }`}
                onClick={handleNavigation}
              >
                {item.label}
              </Link>
            )
          })}
      </nav>
    </header>
  )
}

export default Menu
