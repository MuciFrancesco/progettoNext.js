'use client'

import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/organisms/Navbar'
import Footer from '@/components/organisms/Footer'
import LoginTemplate from '@/components/templates/LoginTemplate'

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuthStore()
  const { totalItems } = useCartStore()

  const handleLogin = (userData: User) => {
    login(userData)
    router.push('/account')
  }

  return (
    <>
      <Navbar cartCount={totalItems()} user={user} />
      <LoginTemplate onLogin={handleLogin} />
      <Footer />
    </>
  )
}
