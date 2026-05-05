import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { carsApi } from '../api'

const CATEGORIES = ['sports', 'suv', 'sedan', 'convertible', 'luxury', 'van']
const TRANSMISSIONS = ['automatic', 'manual']
const FUELS = ['petrol', 'diesel', 'electric', 'hybrid']
const SEATS_OPTIONS = [2, 4, 5, 7]

export default function FilterModal({ mode = 'rent', initialFilters = {}, onApply, onClose }) {
  const { t } = useTranslation()
  const [brands, setBrands] = useState([])
  const [filters, setFilters] = useState({
    available_from: '',
    available_to: '',
    min_price: '',
    max_price: '',
    min_year: '',
    max_year: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seats: '',
    min_driver_age: '',
    brand: '',
    ...initialFilters,
  })

  useEffect(() => {
    carsApi.brands().then(({ data }) => setBrands(data)).catch(() => {})
  }, [])

  const set = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }))

  const handleApply = () => {
    const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    onApply(clean)
    onClose()
  }

  const handleClear = () => {
    setFilters({
      available_from: '', available_to: '', min_price: '', max_price: '',
      min_year: '', max_year: '', category: '', transmission: '',
      fuel_type: '', seats: '', min_driver_age: '', brand: '',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-card border border-border sm:rounded-none max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-primary">{t('rent.filter_title')}</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          {/* Date range — rent only */}
          {mode === 'rent' && (
            <div>
              <label className="label">{t('rent.availability')}</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-secondary mb-1">{t('rent.date_from')}</p>
                  <input type="date" className="input-field" value={filters.available_from} onChange={(e) => set('available_from', e.target.value)} />
                </div>
                <div>
                  <p className="text-xs text-secondary mb-1">{t('rent.date_to')}</p>
                  <input type="date" className="input-field" value={filters.available_to} onChange={(e) => set('available_to', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="label">{mode === 'rent' ? t('rent.price_per_day') : t('buy.price_range')}</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-secondary mb-1">€ {t('common.from')}</p>
                <input type="number" min="0" className="input-field" placeholder="0" value={filters.min_price} onChange={(e) => set('min_price', e.target.value)} />
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">€ {t('common.to')}</p>
                <input type="number" min="0" className="input-field" placeholder="5000" value={filters.max_price} onChange={(e) => set('max_price', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Year — buy only */}
          {mode === 'buy' && (
            <div>
              <label className="label">{t('buy.year_range')}</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="2000" max="2030" className="input-field" placeholder={t('buy.year_from')} value={filters.min_year} onChange={(e) => set('min_year', e.target.value)} />
                <input type="number" min="2000" max="2030" className="input-field" placeholder={t('buy.year_to')} value={filters.max_year} onChange={(e) => set('max_year', e.target.value)} />
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="label">{t('rent.category')}</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => set('category', '')} className={`px-3 py-1.5 text-xs border transition-colors ${!filters.category ? 'border-gold text-gold' : 'border-border text-secondary hover:border-border-light'}`}>
                {t('categories.all')}
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => set('category', c === filters.category ? '' : c)} className={`px-3 py-1.5 text-xs border transition-colors ${filters.category === c ? 'border-gold text-gold' : 'border-border text-secondary hover:border-border-light'}`}>
                  {t(`categories.${c}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="label">{t('rent.transmission')}</label>
            <div className="flex gap-2">
              <button onClick={() => set('transmission', '')} className={`px-3 py-1.5 text-xs border transition-colors ${!filters.transmission ? 'border-gold text-gold' : 'border-border text-secondary'}`}>
                {t('transmission.all')}
              </button>
              {TRANSMISSIONS.map((tr) => (
                <button key={tr} onClick={() => set('transmission', tr === filters.transmission ? '' : tr)} className={`px-3 py-1.5 text-xs border transition-colors ${filters.transmission === tr ? 'border-gold text-gold' : 'border-border text-secondary'}`}>
                  {t(`transmission.${tr}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel */}
          <div>
            <label className="label">{t('rent.fuel_type')}</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => set('fuel_type', '')} className={`px-3 py-1.5 text-xs border transition-colors ${!filters.fuel_type ? 'border-gold text-gold' : 'border-border text-secondary'}`}>
                {t('fuel.all')}
              </button>
              {FUELS.map((f) => (
                <button key={f} onClick={() => set('fuel_type', f === filters.fuel_type ? '' : f)} className={`px-3 py-1.5 text-xs border transition-colors ${filters.fuel_type === f ? 'border-gold text-gold' : 'border-border text-secondary'}`}>
                  {t(`fuel.${f}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Seats */}
          <div>
            <label className="label">{t('rent.seats')}</label>
            <div className="flex gap-2">
              <button onClick={() => set('seats', '')} className={`w-12 py-1.5 text-xs border transition-colors ${!filters.seats ? 'border-gold text-gold' : 'border-border text-secondary'}`}>
                {t('common.all')}
              </button>
              {SEATS_OPTIONS.map((s) => (
                <button key={s} onClick={() => set('seats', s === Number(filters.seats) ? '' : s)} className={`w-12 py-1.5 text-xs border transition-colors ${Number(filters.seats) === s ? 'border-gold text-gold' : 'border-border text-secondary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          {brands.length > 0 && (
            <div>
              <label className="label">{t('rent.brand')}</label>
              <select className="input-field" value={filters.brand} onChange={(e) => set('brand', e.target.value)}>
                <option value="">{t('common.all')}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Min driver age — rent only */}
          {mode === 'rent' && (
            <div>
              <label className="label">{t('rent.min_driver_age')}</label>
              <input type="number" min="18" max="99" className="input-field" placeholder="18" value={filters.min_driver_age} onChange={(e) => set('min_driver_age', e.target.value)} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-3">
          <button onClick={handleClear} className="btn-outline flex-1 text-sm py-2.5">
            {t('rent.clear_filters')}
          </button>
          <button onClick={handleApply} className="btn-gold flex-1 text-sm py-2.5">
            {t('rent.apply_filters')}
          </button>
        </div>
      </div>
    </div>
  )
}
