import Link from 'next/link'

interface LogoProps {
  href?: string
}

export default function Logo({ href = '/' }: LogoProps) {
  return (
    <Link href={href} className="logo">
      <span className="logo__icon" aria-hidden="true">💡</span>
      <span className="logo__text">
        <span className="logo__text-think">Think</span>
        <span className="logo__text-shop">Shop</span>
      </span>
    </Link>
  )
}
