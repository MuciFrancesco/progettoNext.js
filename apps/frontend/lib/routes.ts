export const AdminRoutes = {
  DASHBOARD: '/dashboard',
  ROLE: '/dashboard/role',
  ADD_PRODUCT: '/dashboard/addproduct',
  UPDATE_PRODUCT: '/dashboard/updateproduct',
  ORDERS: '/dashboard/orders',
} as const;

export const UserRoutes = {
  HOME: '/',
  USER_AREA: '/user',
  CART: '/cart',
  PURCHASE_HISTORY: '/user/orders',
} as const;
