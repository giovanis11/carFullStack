import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { t } = useTranslation()
  const { login, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(username, password)
    if (ok) navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-heading flex flex-col items-center leading-none">
            <span className="text-2xl font-bold tracking-[0.2em] text-primary">LEKS<span className="text-gold">CAR</span></span>
            <span className="text-[9px] font-semibold tracking-[0.35em] text-gold/70 uppercase mt-0.5">Rental</span>
          </span>
          <p className="text-secondary text-sm mt-2">{t('admin.login_title')}</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('admin.username')}</label>
              <input
                required
                type="text"
                autoComplete="username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('admin.password')}</label>
              <input
                required
                type="password"
                autoComplete="current-password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-danger text-sm text-center">{t('admin.login_error')}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 text-sm font-semibold tracking-wide disabled:opacity-60"
            >
              {loading ? t('admin.logging_in') : t('admin.login_btn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
