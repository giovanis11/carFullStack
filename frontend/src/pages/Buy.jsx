import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { carsApi } from '../api'
import CarCard from '../components/CarCard'
import FilterModal from '../components/FilterModal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function Buy() {
  const { t } = useTranslation()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})

  const fetchCars = useCallback((filters = {}) => {
    setLoading(true)
    setError(null)
    carsApi.list({ listing_type: 'buy', ...filters })
      .then(({ data }) => setCars(data.results ?? data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchCars() }, [fetchCars])

  const handleApply = (filters) => {
    setActiveFilters(filters)
    fetchCars(filters)
  }

  const activeCount = Object.keys(activeFilters).length

  return (
    <div className="min-h-screen pt-16">
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-8 h-px bg-gold mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t('buy.title')}</h1>
          <p className="text-secondary mt-2">{t('buy.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm text-secondary hover:border-gold hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {t('rent.filter_btn')}
            {activeCount > 0 && (
              <span className="bg-gold text-black text-xs font-bold w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {activeCount > 0 && (
            <button onClick={() => handleApply({})} className="text-xs text-secondary hover:text-gold transition-colors">
              {t('rent.clear_filters')} ×
            </button>
          )}
          <p className="text-xs text-secondary ml-auto">
            {!loading && `${cars.length} cars`}
          </p>
        </div>

        {loading ? (
          <div className="py-24"><LoadingSpinner size="lg" /></div>
        ) : error ? (
          <EmptyState title={t('common.error')} subtitle={t('common.retry')} icon="⚠" />
        ) : cars.length === 0 ? (
          <EmptyState title={t('rent.no_cars')} subtitle={t('rent.no_cars_sub')} icon="🚗" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} mode="buy" />
            ))}
          </div>
        )}
      </div>

      {showFilter && (
        <FilterModal
          mode="buy"
          initialFilters={activeFilters}
          onApply={handleApply}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  )
}
