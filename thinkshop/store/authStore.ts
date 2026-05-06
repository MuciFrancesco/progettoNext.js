'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/lib/types'

interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: (user) => set({ user }),

      logout: () => set({ user: null }),

      isAuthenticated: () => get().user !== null,
    }),
    { name: 'thinkshop-auth' }
  )
)
