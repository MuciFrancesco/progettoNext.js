import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Think Shop — Tecnologia che ispira',
  description: 'Il tuo store di tecnologia di fiducia. Cuffie, smartphone, laptop e molto altro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
