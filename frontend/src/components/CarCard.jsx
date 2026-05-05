import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iSW50ZXIsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzQ0NDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

// Spec icons
const IconTransmission = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="6" r="2"/>
    <circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/>
    <path d="M5 8v8M19 8v8M12 8v4h7"/>
  </svg>
)

const IconCategory = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h11l4 4v4a2 2 0 01-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
)

const IconFuel = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22V6a2 2 0 012-2h7a2 2 0 012 2v16"/>
    <path d="M3 10h11M16 6l2 2-2 2"/>
    <path d="M18 8h1a2 2 0 012 2v6a2 2 0 01-2 2v0a2 2 0 01-2-2v-3"/>
  </svg>
)

const IconPower = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

export default function CarCard({ car, mode = 'rent' }) {
  const { t } = useTranslation()

  const detailPath = mode === 'rent' ? `/rent/${car.id}` : `/buy/${car.id}`
  const categoryLabel = t(`categories.${car.category}`, { defaultValue: car.category_display || car.category })
  const transmissionLabel = t(`transmission.${car.transmission}`, { defaultValue: car.transmission_display || car.transmission })
  const fuelLabel = t(`fuel.${car.fuel_type}`, { defaultValue: car.fuel_display || car.fuel_type })

  const priceValue = mode === 'rent' && car.price_per_day
    ? `€${parseFloat(car.price_per_day).toLocaleString()}/${t('rent.per_day').replace('/ ', '')}`
    : car.sale_price
    ? `€${parseFloat(car.sale_price).toLocaleString()}`
    : null

  return (
    <div className="bg-black border border-border rounded-xl group flex flex-col overflow-hidden transition-all duration-300 hover:border-gold/45 hover:shadow-xl hover:shadow-gold/10">
      {/* Image — fully tappable */}
      <Link to={detailPath} className="relative overflow-hidden aspect-[16/10] bg-black block">
        <img
          src={car.primary_image_url || PLACEHOLDER}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
        {/* Unavailable overlay */}
        {!car.is_available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest border border-border px-3 py-1">
              {t('car_detail.unavailable')}
            </span>
          </div>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name row + price badge */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-base font-bold text-primary leading-snug">{car.brand} {car.name}</h3>
          {priceValue && (
            <span className="shrink-0 bg-black border border-white text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              {priceValue}
            </span>
          )}
        </div>

        {/* Brand sub-label */}
        <p className="text-xs text-secondary mb-4">{car.brand}</p>

        {/* Specs — 2 columns, 2 rows, with icons */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
          <div className="flex items-center gap-2 text-secondary">
            <IconTransmission />
            <span className="text-xs">{transmissionLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <IconFuel />
            <span className="text-xs">{fuelLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <IconCategory />
            <span className="text-xs">{categoryLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <IconPower />
            <span className="text-xs">{car.horsepower} {t('rent.hp')}</span>
          </div>
        </div>

        {/* Bottom row: category pill + View Details */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="text-xs text-secondary border border-border px-3 py-1 rounded-full">
            {categoryLabel}
          </span>
          <Link
            to={detailPath}
            className="text-xs font-bold bg-gold border border-gold text-black px-4 py-2 rounded-md hover:bg-[#e6c76a] hover:border-[#e6c76a] transition-colors duration-200"
          >
            {mode === 'rent' ? t('rent.view_details') : t('buy.view_details')}
          </Link>
        </div>
      </div>
    </div>
  )
}
