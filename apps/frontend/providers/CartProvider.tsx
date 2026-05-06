'use client';

// ─── Backward Compatibility Re-export ─────────────────────────────────────────
// The CartProvider has been migrated to store/CartContext.tsx with useReducer.
// This file re-exports the new implementation so existing imports continue to work.
// Once all consumers have been updated to import from @/store/CartContext directly,
// this file can be deleted.

'use client';

export { CartProvider, useCart } from '@/store/CartContext';
export type { CartItem, CartStockAlert } from '@/store/CartContext';
