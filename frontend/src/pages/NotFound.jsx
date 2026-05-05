import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gold/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-primary mb-3">Page Not Found</h1>
        <p className="text-secondary mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-gold px-8 py-3 text-sm">Go Home</Link>
      </div>
    </div>
  )
}
