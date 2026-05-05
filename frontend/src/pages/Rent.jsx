import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { carsApi } from '../api'
import CarCard from '../components/CarCard'
import FilterModal from '../components/FilterModal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const SORT_OPTIONS = [
  { value: '-is_featured', labelEl: 'Προτεινόμενα', labelEn: 'Featured' },
  { value: 'price_per_day', labelEl: 'Τιμή ↑', labelEn: 'Price ↑' },
  { value: '-price_per_day', labelEl: 'Τιμή ↓', labelEn: 'Price ↓' },
  { value: '-year', labelEl: 'Νεότερα', labelEn: 'Newest' },
]

export default function Rent() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [ordering, setOrdering] = useState('-is_featured')
  const [showSort, setShowSort] = useState(false)

  const fetchCars = useCallback((filters = {}, order = '-is_featured') => {
    setLoading(true)
    setError(null)
    carsApi.list({ listing_type: 'rent', ordering: order, ...filters })
      .then(({ data }) => setCars(data.results ?? data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchCars({}, ordering) }, [fetchCars])

  const handleApply = (filters) => {
    setActiveFilters(filters)
    fetchCars(filters, ordering)
  }

  const handleSort = (val) => {
    setOrdering(val)
    setShowSort(false)
    fetchCars(activeFilters, val)
  }

  const activeCount = Object.keys(activeFilters).length
  const currentSort = SORT_OPTIONS.find(o => o.value === ordering)
  const sortLabel = lang === 'el' ? currentSort?.labelEl : currentSort?.labelEn

  return (
    <div className="min-h-screen pt-16">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-gold/5 blur-[100px] -translate-y-1/2" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-10 text-center">
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-4">
            {lang === 'el' ? 'Ο Στόλος μας' : 'Our Fleet'}
          </h1>

        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="border-y border-border bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

          {/* Left: Filter button */}
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] uppercase text-secondary hover:text-gold transition-colors group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>{t('rent.filter_btn')}</span>
          </button>

          {/* Center: Car count */}
          <div className="text-center hidden sm:block">
            {!loading && (
              <>
                <p className="text-sm font-bold text-primary">{cars.length} {lang === 'el' ? 'οχήματα' : 'vehicles'}</p>
                <p className="text-xs text-secondary">{lang === 'el' ? 'Luxury επιλογές για ενοικίαση' : 'Luxury rental options'}</p>
              </>
            )}
          </div>

          {/* Right: Sort */}
          <div className="relative">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-secondary mb-1">
                {lang === 'el' ? 'Ταξινόμηση' : 'Sort by'}
              </span>
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:border-gold transition-colors"
              >
                {sortLabel}
                <svg className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {showSort && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border min-w-[140px] shadow-xl shadow-black/50">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSort(opt.value)}
                      className={`block w-full text-left px-4 py-2.5 text-xs transition-colors ${
                        ordering === opt.value ? 'text-gold bg-gold/5' : 'text-secondary hover:text-primary hover:bg-black'
                      }`}
                    >
                      {lang === 'el' ? opt.labelEl : opt.labelEn}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Cars grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCount > 0 && (
          <button onClick={() => handleApply({})} className="mb-6 text-xs text-secondary hover:text-gold transition-colors">
            ← {t('rent.clear_filters')}
          </button>
        )}

        {loading ? (
          <div className="py-24"><LoadingSpinner size="lg" /></div>
        ) : error ? (
          <EmptyState title={t('common.error')} subtitle={t('common.retry')} icon="⚠" />
        ) : cars.length === 0 ? (
          <EmptyState title={t('rent.no_cars')} subtitle={t('rent.no_cars_sub')} icon="🚗" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} mode="rent" />
            ))}
          </div>
        )}
      </div>

      {showFilter && (
        <FilterModal
          mode="rent"
          initialFilters={activeFilters}
          onApply={handleApply}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  )
}
