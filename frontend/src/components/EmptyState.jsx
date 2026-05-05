export default function EmptyState({ title, subtitle, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="text-4xl mb-4 opacity-40">{icon}</div>}
      <p className="text-secondary font-medium text-lg">{title}</p>
      {subtitle && <p className="text-secondary/60 text-sm mt-2">{subtitle}</p>}
    </div>
  )
}
