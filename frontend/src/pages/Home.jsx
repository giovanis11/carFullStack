import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { carsApi } from '../api'
import heroVideo from '../assets/hero-video.mp4'
import CarCard from '../components/CarCard'
import LoadingSpinner from '../components/LoadingSpinner'

const TRUST_ICONS = [
  <svg key="1" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  <svg key="2" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8M6 11h12M7 15h10M5 19h14" /></svg>,
  <svg key="3" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 11l9-8 9 8M5 10v9h14v-9M9 19v-5h6v5" /></svg>,
  <svg key="4" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17l6-6 4 4 7-8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 7h6v6" /></svg>,
  <svg key="5" className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 13l4-8h8l4 8-2 6H6l-2-6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h6" /></svg>,
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
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-16 md:pt-20">
          <h1 className="mx-auto max-w-6xl text-3xl font-medium text-primary leading-[1.05] tracking-[-0.03em] md:text-5xl md:whitespace-nowrap lg:text-[4rem] mb-4">
            {t('home.hero_title')}
          </h1>
          <p className="mx-auto max-w-3xl text-sm font-normal leading-relaxed text-primary/82 md:text-xl md:leading-[1.45] mb-7">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rent" className="border border-gold bg-gold px-10 py-4 text-sm font-semibold tracking-widest uppercase text-black transition-colors duration-300 hover:bg-[#e6c76a] hover:border-[#e6c76a]">
              {t('home.hero_cta_rent')}
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold/50" />
          <div className="w-1.5 h-1.5 bg-gold/50 rounded-full" />
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
            <Link to="/rent" className="mt-4 sm:mt-0 inline-flex items-center rounded-full border border-gold px-5 py-2.5 text-sm text-gold tracking-wide shrink-0 transition-colors duration-300 hover:bg-gold hover:text-black">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
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

      {/* About section */}
      <section className="py-20 md:py-28 px-4 border-t border-border">
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
    </div>
  )
}
