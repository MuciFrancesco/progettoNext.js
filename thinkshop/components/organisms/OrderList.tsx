'use client'

import { useState } from 'react'
import { Order } from '@/lib/types'
import OrderRow from '@/components/molecules/OrderRow'

interface OrderListProps {
  orders: Order[]
  onReorder: (order: Order) => void
  onReturn: (order: Order) => void
}

type TabKey = 'all' | 'transito' | 'reso'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tutti gli ordini' },
  { key: 'transito', label: 'In transito' },
  { key: 'reso', label: 'Resi' },
]

export default function OrderList({ orders, onReorder, onReturn }: OrderListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const filtered = orders.filter((o) => {
    if (activeTab === 'all') return true
    if (activeTab === 'transito') return o.status === 'In transito'
    if (activeTab === 'reso') return o.status === 'Reso avviato'
    return true
  })

  return (
    <section>
      <div className="orders-header" role="tablist" aria-label="Filtra ordini">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            className={`tab-btn ${activeTab === key ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-3)' }}>
          <p style={{ fontSize: 48 }}>📭</p>
          <p style={{ marginTop: 12, fontSize: 14 }}>
            Nessun ordine in questa categoria
          </p>
        </div>
      ) : (
        <div role="tabpanel">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onReorder={onReorder}
              onReturn={onReturn}
            />
          ))}
        </div>
      )}
    </section>
  )
}
