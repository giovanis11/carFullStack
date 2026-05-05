import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { carsApi, requestsApi } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iSW50ZXIsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzQ0NDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
const WEEKDAY_LABELS = {
  el: ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-xs text-secondary uppercase tracking-wider">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  )
}

function parseDateString(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateString(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, days) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function buildBookedDateSet(bookings = []) {
  const bookedDates = new Set()

  bookings.forEach((booking) => {
    const start = parseDateString(booking.pickup_date)
    const end = parseDateString(booking.return_date)
    if (!start || !end) return

    let current = new Date(start)
    while (current < end) {
      bookedDates.add(formatDateString(current))
      current = addDays(current, 1)
    }
  })

  return bookedDates
}

function hasBookingConflict(bookings = [], pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return false

  return bookings.some((booking) => (
    booking.pickup_date < returnDate && booking.return_date > pickupDate
  ))
}

function getCalendarCells(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = (firstDay.getDay() + 6) % 7
  const cells = Array(leadingBlanks).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(formatDateString(new Date(year, month, day)))
  }

  return cells
}

function getErrorText(error, fallback) {
  if (!error) return null
  if (typeof error === 'string') return error
  if (Array.isArray(error)) return error.join(' ')
  if (typeof error === 'object') {
    const values = Object.values(error).flatMap((value) => (Array.isArray(value) ? value : [value]))
    return values.filter(Boolean).join(' ')
  }
  return fallback
}

function AvailabilityCalendar({ bookings, bookedDates, pickupDate, returnDate, lang, onSelectDate, t }) {
  const locale = lang === 'el' ? 'el-GR' : 'en-US'
  const weekdays = WEEKDAY_LABELS[lang] || WEEKDAY_LABELS.en
  const todayString = formatDateString(new Date())
  const months = [0, 1, 2].map((index) => addMonths(new Date(), index))

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">
            {t('car_detail.availability_calendar')}
          </h3>
          <p className="text-secondary text-sm">{t('car_detail.calendar_hint')}</p>
        </div>
        <div className="text-right text-xs text-secondary">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 border border-danger/70 bg-danger/10" />
            {t('car_detail.booked_ranges')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {months.map((monthDate) => {
          const monthLabel = monthDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
          const cells = getCalendarCells(monthDate)

          return (
            <div key={monthLabel} className="border border-border p-3">
              <p className="text-sm font-semibold text-primary capitalize mb-3">{monthLabel}</p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekdays.map((day) => (
                  <span key={day} className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                    {day}
                  </span>
                ))}
                {cells.map((cell, index) => {
                  if (!cell) {
                    return <span key={`blank-${monthLabel}-${index}`} className="h-10" />
                  }

                  const isPast = cell < todayString
                  const isBooked = bookedDates.has(cell)
                  const isStart = cell === pickupDate
                  const isEnd = cell === returnDate
                  const isInRange = pickupDate && returnDate && cell > pickupDate && cell < returnDate
                  const isDisabled = isPast || isBooked

                  return (
                    <button
                      key={cell}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => onSelectDate(cell)}
                      className={`relative h-10 border text-xs transition-colors ${
                        isStart || isEnd
                          ? 'border-gold bg-gold text-black'
                          : isBooked
                          ? 'border-danger/50 bg-danger/10 text-danger line-through cursor-not-allowed'
                          : isInRange
                          ? 'border-gold/30 bg-gold/10 text-primary'
                          : isPast
                          ? 'border-border/40 text-secondary/40 cursor-not-allowed'
                          : 'border-border text-primary hover:border-gold hover:text-gold'
                      }`}
                    >
                      {parseDateString(cell)?.getDate()}
                      {isBooked && <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-danger/80" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        {bookings.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {bookings.map((booking) => (
              <span key={`${booking.pickup_date}-${booking.return_date}`} className="border border-danger/40 bg-danger/10 px-3 py-1 text-xs text-danger">
                {parseDateString(booking.pickup_date)?.toLocaleDateString(locale)} - {parseDateString(booking.return_date)?.toLocaleDateString(locale)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-secondary">{t('car_detail.no_booked_dates')}</p>
        )}
      </div>
    </div>
  )
}

function RentalRequestForm({
  car,
  errorText,
  form,
  handleSubmit,
  isMobile = false,
  isSubmitDisabled,
  minimumReturnDate,
  setField,
  submitting,
  success,
  t,
  todayString,
  driverAgeTooLow,
  dateConflict,
}) {
  return (
    <div className={`card border-gold ${isMobile ? 'p-4' : 'p-5 xl:p-6'} ${isMobile ? '' : 'sticky top-24'}`}>
      <h2 className={`font-semibold text-primary ${isMobile ? 'text-sm mb-4' : 'text-base mb-5'}`}>
        {t('car_detail.rental_form_title')}
      </h2>

      {success ? (
        <div className="py-6 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-primary mb-2">{t('car_detail.success_title')}</h3>
          <p className="text-secondary text-sm">{t('car_detail.success_msg')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('car_detail.full_name')} *</label>
              <input required type="text" className="input-field py-2.5" value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('car_detail.driver_age')} *</label>
              <input required type="number" min={car.min_driver_age} className="input-field py-2.5" value={form.driver_age} onChange={(e) => setField('driver_age', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('car_detail.phone')} *</label>
              <input required type="tel" className="input-field py-2.5" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('car_detail.email')} *</label>
              <input required type="email" className="input-field py-2.5" value={form.email} onChange={(e) => setField('email', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('car_detail.pickup_date')} *</label>
              <input required type="date" min={todayString} className="input-field py-2.5" value={form.pickup_date} onChange={(e) => setField('pickup_date', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('car_detail.return_date')} *</label>
              <input required type="date" min={minimumReturnDate} className="input-field py-2.5" value={form.return_date} onChange={(e) => setField('return_date', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">{t('car_detail.pickup_location')} *</label>
            <input required type="text" className="input-field py-2.5" value={form.pickup_location} onChange={(e) => setField('pickup_location', e.target.value)} />
          </div>

          <div>
            <label className="label">{t('car_detail.notes')}</label>
            <textarea rows={isMobile ? 2 : 3} className="input-field resize-none py-2.5" value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] text-secondary">{t('car_detail.calendar_hint')}</p>
            {driverAgeTooLow && (
              <p className="text-danger text-xs">{t('car_detail.driver_age_too_low', { age: car.min_driver_age })}</p>
            )}
            {dateConflict && (
              <p className="text-danger text-xs">{t('car_detail.date_conflict')}</p>
            )}
            {errorText && (
              <p className="text-danger text-xs">{errorText}</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitDisabled} className="btn-gold w-full text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? t('car_detail.submitting') : t('car_detail.submit')}
          </button>
        </form>
      )}
    </div>
  )
}

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    driver_age: '', pickup_date: '', return_date: '', pickup_location: '', notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    carsApi.detail(id)
      .then(({ data }) => setCar(data))
      .catch(() => navigate('/rent'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const setField = (key, value) => {
    setForm((prev) => {
      if (key === 'pickup_date') {
        return {
          ...prev,
          pickup_date: value,
          return_date: prev.return_date && prev.return_date <= value ? '' : prev.return_date,
        }
      }

      return { ...prev, [key]: value }
    })
    setFormError(null)
  }

  const handleCalendarSelect = (date) => {
    setForm((prev) => {
      if (!prev.pickup_date || prev.return_date) {
        return { ...prev, pickup_date: date, return_date: '' }
      }

      if (date <= prev.pickup_date) {
        return { ...prev, pickup_date: date, return_date: '' }
      }

      return { ...prev, return_date: date }
    })
    setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (driverAgeTooLow) {
      setFormError(t('car_detail.driver_age_too_low', { age: car.min_driver_age }))
      return
    }
    if (dateConflict) {
      setFormError(t('car_detail.date_conflict'))
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      await requestsApi.createRental({ ...form, car: car.id })
      setSuccess(true)
    } catch (err) {
      setFormError(err.response?.data || t('car_detail.error_msg'))
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
  const approvedBookings = car.approved_bookings || []
  const bookedDates = buildBookedDateSet(approvedBookings)
  const todayString = formatDateString(new Date())
  const minimumReturnDate = form.pickup_date ? formatDateString(addDays(parseDateString(form.pickup_date), 1)) : todayString
  const driverAgeTooLow = form.driver_age && Number(form.driver_age) < car.min_driver_age
  const dateConflict = hasBookingConflict(approvedBookings, form.pickup_date, form.return_date)
  const errorText = getErrorText(formError, t('car_detail.error_msg'))
  const isSubmitDisabled = submitting || driverAgeTooLow || dateConflict

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button onClick={() => navigate('/rent')} className="flex items-center gap-2 text-secondary hover:text-gold transition-colors text-sm mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('car_detail.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Images + Specs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main image */}
            <div className="card overflow-hidden">
              <img
                src={images[activeImage]?.image_url || PLACEHOLDER}
                alt={`${car.brand} ${car.name}`}
                className="w-full aspect-[16/10] object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-gold' : 'border-border hover:border-border-light'}`}
                  >
                    <img src={img.image_url || PLACEHOLDER} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER }} />
                  </button>
                ))}
              </div>
            )}

            {/* Car title */}
            <div className="card p-5">
              <p className="text-xs text-secondary uppercase tracking-widest mb-1">{car.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">{car.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-secondary text-sm">{car.year}</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span className="text-secondary text-sm">{categoryLabel}</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span className={`text-xs font-medium ${car.is_available ? 'text-success' : 'text-danger'}`}>
                  {car.is_available ? t('car_detail.available') : t('car_detail.unavailable')}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="card p-5 flex items-center gap-6">
              {car.price_per_day && (
                <div>
                  <p className="text-xs text-secondary mb-1">{t('car_detail.price_per_day')}</p>
                  <p className="text-2xl font-bold text-gold">€{parseFloat(car.price_per_day).toLocaleString()}<span className="text-sm font-normal text-secondary">{t('rent.per_day')}</span></p>
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <RentalRequestForm
                car={car}
                errorText={errorText}
                form={form}
                handleSubmit={handleSubmit}
                isMobile
                isSubmitDisabled={isSubmitDisabled}
                minimumReturnDate={minimumReturnDate}
                setField={setField}
                submitting={submitting}
                success={success}
                t={t}
                todayString={todayString}
                driverAgeTooLow={driverAgeTooLow}
                dateConflict={dateConflict}
              />
            </div>

            {/* Specs */}
            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4">{t('car_detail.specs')}</h3>
              <SpecRow label={t('car_detail.category')} value={categoryLabel} />
              <SpecRow label={t('car_detail.transmission')} value={transmissionLabel} />
              <SpecRow label={t('car_detail.fuel')} value={fuelLabel} />
              <SpecRow label={t('car_detail.horsepower')} value={`${car.horsepower} ${t('rent.hp')}`} />
              <SpecRow label={t('car_detail.seats')} value={`${car.seats} ${t('rent.seats_label')}`} />
              <SpecRow label={t('car_detail.year')} value={car.year} />
              <SpecRow label={t('car_detail.min_age')} value={`${car.min_driver_age} ${t('rent.years')}`} />
            </div>

            {/* Description */}
            {description && (
              <div className="card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4">{t('car_detail.description')}</h3>
                <p className="text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            )}

            <AvailabilityCalendar
              bookings={approvedBookings}
              bookedDates={bookedDates}
              pickupDate={form.pickup_date}
              returnDate={form.return_date}
              lang={lang}
              onSelectDate={handleCalendarSelect}
              t={t}
            />
          </div>

          {/* Right: Rental form */}
          <div className="hidden lg:block lg:col-span-2">
            <RentalRequestForm
              car={car}
              errorText={errorText}
              form={form}
              handleSubmit={handleSubmit}
              isSubmitDisabled={isSubmitDisabled}
              minimumReturnDate={minimumReturnDate}
              setField={setField}
              submitting={submitting}
              success={success}
              t={t}
              todayString={todayString}
              driverAgeTooLow={driverAgeTooLow}
              dateConflict={dateConflict}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
