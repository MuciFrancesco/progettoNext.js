'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'
import AccountTemplate from '@/components/templates/AccountTemplate'

export default function AccountPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { totalItems } = useCartStore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <>
      <Navbar cartCount={totalItems()} user={user} />
      <AccountTemplate user={user} onLogout={handleLogout} />
      <Footer />
    </>
  )
}
