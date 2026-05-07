import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import footerCircleLogo from '../assets/footer-circle-logo.jpg'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const footerLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/rent', label: t('nav.rent') },
    { to: '/buy', label: t('nav.buy') },
    { to: '/airport', label: t('nav.airport') },
    { to: '/transfers', label: t('nav.transfers') },
  ]

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-secondary text-base md:text-lg leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-base md:text-lg text-secondary hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-base md:text-lg text-secondary">
              <li>{t('footer.address')}</li>
              <li>
                <a href="tel:+302100000000" className="hover:text-gold transition-colors">
                  +30 210 000 0000
                </a>
              </li>
              <li>
                <a href="mailto:info@lekscars.gr" className="hover:text-gold transition-colors">
                  info@lekscars.gr
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-[#E1306C] hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-[#1877F2] hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <span aria-label={t('footer.viber')} className="text-[#7360F2]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.77 2 2.5 6.2 2.5 11.38c0 2.95 1.38 5.58 3.54 7.29V22l3.11-1.71c.9.25 1.85.39 2.89.39 5.27 0 9.46-4.2 9.46-9.3C21.5 6.2 17.3 2 12.04 2zm5.57 12.72c-.24.69-1.38 1.31-1.91 1.39-.49.08-1.11.11-1.79-.11-.42-.14-.96-.32-1.65-.61-2.9-1.24-4.79-4.13-4.93-4.32-.14-.18-1.18-1.57-1.18-2.99 0-1.41.74-2.11 1-2.4.27-.3.58-.37.77-.37.19 0 .38 0 .55.01.17.01.39-.07.61.45.23.56.78 1.94.85 2.08.07.14.12.3.02.49-.09.18-.14.3-.28.46-.14.16-.29.35-.41.47-.14.14-.29.29-.12.57.17.28.75 1.23 1.61 1.99 1.1.98 2.02 1.29 2.31 1.43.29.14.46.12.63-.07.17-.18.74-.86.94-1.16.2-.3.4-.25.68-.15.28.09 1.79.84 2.1.99.3.16.5.23.57.36.07.13.07.77-.17 1.46z" />
                </svg>
              </span>
              <span aria-label={t('footer.whatsapp')} className="text-[#25D366]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.56 0 .27 5.29.27 11.79c0 2.08.54 4.11 1.57 5.91L0 24l6.51-1.71a11.79 11.79 0 005.55 1.42h.01c6.5 0 11.79-5.29 11.79-11.79 0-3.15-1.22-6.1-3.34-8.44zM12.07 21.7a9.86 9.86 0 01-5.02-1.37l-.36-.21-3.86 1.01 1.03-3.76-.23-.39a9.77 9.77 0 01-1.5-5.19c0-5.41 4.41-9.82 9.84-9.82 2.62 0 5.08 1.02 6.93 2.88a9.73 9.73 0 012.88 6.94c0 5.42-4.41 9.83-9.81 9.83zm5.39-7.36c-.29-.15-1.71-.85-1.97-.95-.26-.09-.45-.14-.64.15-.19.29-.74.95-.9 1.14-.16.19-.33.21-.62.07-.29-.14-1.21-.45-2.31-1.43-.85-.76-1.42-1.7-1.59-1.99-.16-.28-.02-.43.12-.57.12-.12.29-.31.43-.47.14-.16.19-.28.29-.47.09-.19.05-.36-.02-.5-.07-.14-.64-1.55-.87-2.12-.23-.55-.46-.48-.64-.49h-.54c-.19 0-.5.07-.76.36-.26.28-.99.97-.99 2.36 0 1.39 1.01 2.73 1.15 2.92.14.19 1.98 3.02 4.8 4.23.67.29 1.19.46 1.6.58.67.22 1.27.19 1.75.12.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.06-.12-.25-.19-.54-.33z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="relative border-t border-border mt-8 pt-6 pr-24 sm:pr-0 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm md:text-base text-secondary">
          <p className="max-w-[220px] sm:max-w-none">&copy; {year} Lekscar Rental. {t('footer.rights')}</p>
          <Link to="/admin/login" className="mt-2 sm:mt-0 hover:text-gold transition-colors">
            Admin
          </Link>
          <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2">
            <img
              src={footerCircleLogo}
              alt="Lekscar emblem"
              className="h-20 w-20 rounded-full object-cover shadow-[0_0_30px_rgba(201,168,76,0.12)]"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
