import { useTranslation } from 'react-i18next'

const STATUS_STYLES = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  approved: 'bg-success/10 text-success border-success/30',
  declined: 'bg-danger/10 text-danger border-danger/30',
}

export default function StatusBadge({ status }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border ${STATUS_STYLES[status] || 'bg-border/20 text-secondary border-border'}`}>
      {t(`admin.${status}`, { defaultValue: status })}
    </span>
  )
}
