import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { carsApi, requestsApi } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iSW50ZXIsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzQ0NDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-xs text-secondary uppercase tracking-wider">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  )
}

export default function BuyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    carsApi.detail(id)
      .then(({ data }) => setCar(data))
      .catch(() => navigate('/buy'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    try {
      await requestsApi.createSale({ ...form, car: car.id })
      setSuccess(true)
    } catch {
      setFormError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center"><LoadingSpinner size="lg" /></div>
  if (!car) return null

  const images = car.images?.length ? car.images : [{ image_url: PLACEHOLDER }]
  const description = lang === 'en' ? car.description_en : car.description_el
  const categoryLabel = t(`categories.${car.category}`, { defaultValue: car.category_display })
  const transmissionLabel = t(`transmission.${car.transmission}`, { defaultValue: car.transmission_display })
  const fuelLabel = t(`fuel.${car.fuel_type}`, { defaultValue: car.fuel_display })

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/buy')} className="flex items-center gap-2 text-secondary hover:text-gold transition-colors text-sm mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('car_detail.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
              <img src={images[activeImage]?.image_url || PLACEHOLDER} alt={`${car.brand} ${car.name}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER }} />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-gold' : 'border-border'}`}>
                    <img src={img.image_url || PLACEHOLDER} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER }} />
                  </button>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs text-secondary uppercase tracking-widest mb-1">{car.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">{car.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-secondary text-sm">{car.year}</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span className="text-secondary text-sm">{categoryLabel}</span>
              </div>
            </div>

            {car.sale_price && (
              <div className="py-4 border-t border-b border-border">
                <p className="text-xs text-secondary mb-1">{t('car_detail.sale_price')}</p>
                <p className="text-3xl font-bold text-gold">€{parseFloat(car.sale_price).toLocaleString()}</p>
              </div>
            )}

            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4">{t('car_detail.specs')}</h3>
              <SpecRow label={t('car_detail.category')} value={categoryLabel} />
              <SpecRow label={t('car_detail.transmission')} value={transmissionLabel} />
              <SpecRow label={t('car_detail.fuel')} value={fuelLabel} />
              <SpecRow label={t('car_detail.horsepower')} value={`${car.horsepower} ${t('rent.hp')}`} />
              <SpecRow label={t('car_detail.seats')} value={`${car.seats} ${t('rent.seats_label')}`} />
              <SpecRow label={t('car_detail.year')} value={car.year} />
            </div>

            {description && (
              <div className="card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4">{t('car_detail.description')}</h3>
                <p className="text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h2 className="text-base font-semibold text-primary mb-5">{t('car_detail.inquiry_form_title')}</h2>
              {success ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-primary mb-2">{t('car_detail.success_title')}</h3>
                  <p className="text-secondary text-sm">{t('car_detail.success_msg')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">{t('car_detail.full_name')} *</label>
                    <input required type="text" className="input-field" value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">{t('car_detail.phone')} *</label>
                    <input required type="tel" className="input-field" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">{t('car_detail.email')} *</label>
                    <input required type="email" className="input-field" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">{t('car_detail.notes')}</label>
                    <textarea rows={4} className="input-field resize-none" value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
                  </div>
                  {formError && <p className="text-danger text-xs">{t('car_detail.error_msg')}</p>}
                  <button type="submit" disabled={submitting} className="btn-gold w-full text-sm py-3.5 disabled:opacity-60">
                    {submitting ? t('car_detail.submitting') : t('car_detail.submit')}
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
