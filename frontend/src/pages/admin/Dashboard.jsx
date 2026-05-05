import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import Logo from '../../components/Logo'

const TABS = ['rentals', 'sales', 'transfers']

function StatCard({ label, count, color = 'gold' }) {
  return (
    <div className="card p-4 flex flex-col items-center justify-center text-center min-h-[90px]">
      <p className={`text-3xl font-bold ${color === 'gold' ? 'text-gold' : 'text-primary'}`}>{count}</p>
      <p className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</p>
    </div>
  )
}

function RequestCard({ req, type, onStatusUpdate }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)

  const update = async (newStatus) => {
    setUpdating(true)
    try {
      const { data } = await adminApi.updateStatus(type, req.id, newStatus)
      onStatusUpdate(type, req.id, data)
    } catch {
      // silently fail
    } finally {
      setUpdating(false)
    }
  }

  const typeKey = type === 'rental' ? 'rentals' : type === 'sale' ? 'sales' : 'transfers'

  return (
    <div className="card border-l-2 border-l-transparent hover:border-l-gold transition-colors">
      {/* Compact header */}
      <button
        className="w-full text-left p-4 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-primary text-sm">{req.full_name}</p>
            <StatusBadge status={req.status} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <p className="text-xs text-secondary">{req.phone}</p>
            {req.car_name && <p className="text-xs text-gold">{req.car_name}</p>}
            {type === 'rental' && req.pickup_date && (
              <p className="text-xs text-secondary">
                {req.pickup_date} → {req.return_date}
              </p>
            )}
            {type === 'transfer' && req.datetime && (
              <p className="text-xs text-secondary">
                {new Date(req.datetime).toLocaleString()}
              </p>
            )}
            <p className="text-xs text-secondary/60">
              {new Date(req.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-secondary shrink-0 mt-0.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-sm">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('admin.email')}</p>
              <p className="text-primary">{req.email}</p>
            </div>
            {type === 'rental' && (
              <>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('admin.driver_age')}</p>
                  <p className="text-primary">{req.driver_age}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('admin.pickup')}</p>
                  <p className="text-primary">{req.pickup_location}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('admin.dates')}</p>
                  <p className="text-primary">{req.pickup_date} → {req.return_date}</p>
                </div>
              </>
            )}
            {type === 'transfer' && (
              <>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('transfers.pickup_location')}</p>
                  <p className="text-primary">{req.pickup_location}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('transfers.dropoff_location')}</p>
                  <p className="text-primary">{req.dropoff_location}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('transfers.passengers')}</p>
                  <p className="text-primary">{req.passengers}</p>
                </div>
                {req.flight_number && (
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('transfers.flight_number')}</p>
                    <p className="text-primary">{req.flight_number}</p>
                  </div>
                )}
              </>
            )}
            {req.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">{t('admin.notes')}</p>
                <p className="text-secondary text-sm">{req.notes}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {req.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <button
                disabled={updating}
                onClick={() => update('approved')}
                className="flex-1 bg-success/10 text-success border border-success/30 hover:bg-success/20 transition-colors py-2.5 text-sm font-medium disabled:opacity-50"
              >
                {t('admin.approve_btn')}
              </button>
              <button
                disabled={updating}
                onClick={() => update('declined')}
                className="flex-1 bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors py-2.5 text-sm font-medium disabled:opacity-50"
              >
                {t('admin.decline_btn')}
              </button>
            </div>
          )}
          {req.status !== 'pending' && (
            <div className="flex gap-2 mt-4">
              <button
                disabled={updating}
                onClick={() => update('pending')}
                className="text-xs text-secondary hover:text-gold transition-colors py-2"
              >
                ← Reset to pending
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('rentals')

  const fetchData = useCallback(() => {
    adminApi.getRequests()
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusUpdate = useCallback((type, id, updated) => {
    setData((prev) => {
      if (!prev) return prev
      const key = type === 'rental' ? 'rentals' : type === 'sale' ? 'sales' : 'transfers'
      return {
        ...prev,
        [key]: prev[key].map((r) => (r.id === id ? updated : r)),
        counts: {
          ...prev.counts,
          [`pending_${key}`]: prev[key].filter((r) => (r.id === id ? updated.status === 'pending' : r.status === 'pending')).length,
        },
      }
    })
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const getList = () => {
    if (!data) return []
    if (activeTab === 'rentals') return data.rentals || []
    if (activeTab === 'sales') return data.sales || []
    return data.transfers || []
  }

  const getType = () => {
    if (activeTab === 'rentals') return 'rental'
    if (activeTab === 'sales') return 'sale'
    return 'transfer'
  }

  const counts = data?.counts || {}
  const totalPending = (counts.pending_rentals || 0) + (counts.pending_sales || 0) + (counts.pending_transfers || 0)

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-11 w-auto" />
            <span className="font-sans text-secondary font-normal text-xs">/ Admin</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-secondary hover:text-gold transition-colors uppercase tracking-wider">
            {t('admin.logout')}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label={t('admin.total_pending')} count={totalPending} />
            <StatCard label={t('admin.rentals_tab')} count={counts.pending_rentals || 0} color="primary" />
            <StatCard label={t('admin.sales_tab')} count={counts.pending_sales || 0} color="primary" />
            <StatCard label={t('admin.transfers_tab')} count={counts.pending_transfers || 0} color="primary" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-gold text-gold'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {t(`admin.${tab}_tab`)}
              {data && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${activeTab === tab ? 'bg-gold/20 text-gold' : 'bg-border text-secondary'}`}>
                  {tab === 'rentals' ? data.rentals?.length : tab === 'sales' ? data.sales?.length : data.transfers?.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="py-16"><LoadingSpinner size="lg" /></div>
        ) : getList().length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-secondary">{t('admin.no_requests')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {getList().map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                type={getType()}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
