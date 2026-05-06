import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { carsApi } from '../api'
import heroVideo from '../assets/hero-video.mp4'
import CarCard from '../components/CarCard'
import LoadingSpinner from '../components/LoadingSpinner'

const TRUST_ICONS = [
  <svg key="1" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  <svg key="2" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="3" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
]

export default function Home() {
  const { t } = useTranslation()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    carsApi.featured()
      .then(({ data }) => {
        setFeatured(data)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-20 md:pt-28">
          <h1 className="mx-auto max-w-6xl text-3xl font-medium text-primary leading-[1.05] tracking-[-0.03em] md:text-5xl md:whitespace-nowrap lg:text-[4rem] mb-7">
            {t('home.hero_title')}
          </h1>
          <p className="mx-auto max-w-3xl text-sm font-normal leading-relaxed text-primary/82 md:text-xl md:leading-[1.45] mb-12">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rent" className="border border-gold bg-transparent px-10 py-4 text-sm font-semibold tracking-widest uppercase text-gold transition-colors duration-300 hover:bg-gold hover:text-black">
              {t('home.hero_cta_rent')}
            </Link>
            <Link to="/buy" className="btn-outline px-10 py-4 text-sm font-semibold tracking-widest uppercase">
              {t('buy.title')}
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold/50" />
          <div className="w-1.5 h-1.5 bg-gold/50 rounded-full" />
        </div>
      </section>

      {/* About section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-px bg-gold mb-6" />
              <h2 className="section-title mb-5">{t('home.about_title')}</h2>
              <p className="text-secondary leading-relaxed">{t('home.about_text')}</p>
              <Link to="/rent" className="inline-block mt-8 text-sm text-gold font-medium tracking-wide hover:underline">
                {t('home.hero_cta')} →
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '50+', label: t('home.trust_1_title') },
                { number: '24/7', label: t('home.trust_2_title') },
                { number: '5★', label: 'Rating' },
                { number: '10+', label: 'Years' },
              ].map(({ number, label }) => (
                <div key={label} className="card p-6 text-center">
                  <p className="text-3xl font-bold text-gold mb-1">{number}</p>
                  <p className="text-xs text-secondary uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="w-8 h-px bg-gold mb-4" />
              <h2 className="section-title">{t('home.featured_title')}</h2>
              <p className="text-secondary text-sm mt-2">{t('home.featured_subtitle')}</p>
            </div>
            <Link to="/rent" className="mt-4 sm:mt-0 text-sm text-gold hover:underline tracking-wide shrink-0">
              {t('home.view_all_rent')} →
            </Link>
          </div>

          {loading ? (
            <div className="py-16"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <p className="text-secondary text-center py-16">{t('common.error')} {t('common.retry')}</p>
          ) : featured.length === 0 ? (
            <p className="text-secondary text-center py-16">{t('rent.no_cars')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featured.map((car) => (
                <CarCard key={car.id} car={car} mode={car.listing_type === 'buy' ? 'buy' : 'rent'} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-8 h-px bg-gold mx-auto mb-4" />
            <h2 className="section-title">{t('home.trust_title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-8 text-center group hover:border-[#3a3a3a] transition-colors">
                <div className="flex justify-center mb-4">{TRUST_ICONS[i - 1]}</div>
                <h3 className="text-base font-semibold text-primary mb-2">{t(`home.trust_${i}_title`)}</h3>
                <p className="text-secondary text-sm">{t(`home.trust_${i}_text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-4">{t('transfers.title')}</h2>
          <p className="text-secondary mb-8">{t('transfers.subtitle')}</p>
          <Link to="/transfers" className="btn-gold px-10 py-4 text-sm font-semibold tracking-widest uppercase">
            {t('transfers.form_title')} →
          </Link>
        </div>
      </section>
    </div>
  )
}
