import logoImage from '../assets/logo.png'

export default function Logo({ className = '', alt = 'Lekscar Rental' }) {
  return (
    <img
      src={logoImage}
      alt={alt}
      className={className}
    />
  )
}
