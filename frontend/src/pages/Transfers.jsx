import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { requestsApi } from '../api'

const SERVICE_AREAS = ['info_1', 'info_2', 'info_3', 'info_4']

export default function Transfers() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    pickup_location: '', dropoff_location: '',
    datetime: '', passengers: 1, flight_number: '', notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await requestsApi.createTransfer(form)
      setSuccess(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-8 h-px bg-gold mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t('transfers.title')}</h1>
          <p className="text-secondary mt-2">{t('transfers.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-primary mb-3">{t('transfers.title')}</h2>
              <p className="text-secondary text-sm leading-relaxed">{t('transfers.subtitle')}</p>
            </div>

            <div className="space-y-3">
              {SERVICE_AREAS.map((key) => (
                <div key={key} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className="w-2 h-2 bg-gold flex-shrink-0" />
                  <span className="text-secondary text-sm">{t(`transfers.${key}`)}</span>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Contact</h3>
              <div className="space-y-2">
                <a href="tel:+302100000000" className="flex items-center gap-2 text-sm text-secondary hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +30 210 000 0000
                </a>
                <a href="mailto:transfers@lekscars.gr" className="flex items-center gap-2 text-sm text-secondary hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  transfers@lekscars.gr
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h2 className="text-base font-semibold text-primary mb-6">{t('transfers.form_title')}</h2>

              {success ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{t('transfers.success_title')}</h3>
                  <p className="text-secondary">{t('transfers.success_msg')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('transfers.full_name')} *</label>
                      <input required type="text" className="input-field" value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">{t('transfers.phone')} *</label>
                      <input required type="tel" className="input-field" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="label">{t('transfers.email')} *</label>
                    <input required type="email" className="input-field" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('transfers.pickup_location')} *</label>
                      <input required type="text" className="input-field" value={form.pickup_location} onChange={(e) => setField('pickup_location', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">{t('transfers.dropoff_location')} *</label>
                      <input required type="text" className="input-field" value={form.dropoff_location} onChange={(e) => setField('dropoff_location', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('transfers.datetime')} *</label>
                      <input required type="datetime-local" className="input-field" value={form.datetime} onChange={(e) => setField('datetime', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">{t('transfers.passengers')} *</label>
                      <input required type="number" min="1" max="20" className="input-field" value={form.passengers} onChange={(e) => setField('passengers', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="label">{t('transfers.flight_number')}</label>
                    <input type="text" className="input-field" value={form.flight_number} onChange={(e) => setField('flight_number', e.target.value)} />
                  </div>

                  <div>
                    <label className="label">{t('transfers.notes')}</label>
                    <textarea rows={3} className="input-field resize-none" value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
                  </div>

                  {error && <p className="text-danger text-sm">{t('transfers.error_msg')}</p>}

                  <button type="submit" disabled={submitting} className="btn-gold w-full py-4 text-sm font-semibold tracking-wide disabled:opacity-60">
                    {submitting ? t('transfers.submitting') : t('transfers.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
