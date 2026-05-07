import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/rent', label: t('nav.rent') },
    { path: '/buy', label: t('nav.buy') },
    { path: '/airport', label: t('nav.airport') },
    { path: '/transfers', label: t('nav.transfers') },
  ]

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'el' ? 'en' : 'el')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <Logo className="h-[4.5rem] w-auto" />
          </Link>

          {/* Desktop Nav — right aligned */}
          <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-bold tracking-wide transition-colors duration-200 ${
                  isActive(path) && path !== '/'
                    ? 'text-gold'
                    : location.pathname === '/' && path === '/'
                    ? 'text-gold'
                    : 'text-secondary hover:text-primary'
                } uppercase`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Lang switcher + mobile menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLang}
              className="text-xs font-semibold tracking-widest border border-border px-3 py-1.5 text-secondary hover:border-gold hover:text-gold transition-colors"
            >
              {i18n.language === 'el' ? 'EN' : 'GR'}
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col space-y-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 bg-primary transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block py-3 text-sm font-medium border-b border-border last:border-0 transition-colors uppercase ${
                  isActive(path) ? 'text-gold' : 'text-secondary hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
