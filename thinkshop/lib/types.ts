export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  category: string
  discount: number
  inStock: boolean
  imageUrl: string
  features: string[]
  specs: Record<string, string>
}

export interface CartItem extends Product {
  quantity: number
}

export type OrderStatus = 'Consegnato' | 'In transito' | 'Reso avviato' | 'Annullato'

export interface Order {
  id: string
  date: string
  status: OrderStatus
  items: Product[]
  total: number
  trackingCode?: string
}

export interface User {
  name: string
  email: string
}

export type ButtonVariant = 'gold' | 'indigo' | 'outline' | 'ghost'
export type BadgeVariant = 'discount' | 'stock' | 'outofstock' | 'status'
