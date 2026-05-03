export const AdminRoutes = {
  DASHBOARD: '/dashboard',
  ROLE: '/dashboard/role',
  ADD_PRODUCT: '/dashboard/addproduct',
  UPDATE_PRODUCT: '/dashboard/updateproduct',
  ORDERS: '/dashboard/orders',
} as const;

export const UserRoutes = {
  USER_AREA: '/user',
  PURCHASE_HISTORY: '/user/orders',
} as const;
