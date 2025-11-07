// src/routes/index.jsx
export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard", // Route chung cho dashboard - sẽ điều hướng theo role
  dashboardBuyer: "/dashboard-buyer",
  dashboardSeller: "/dashboard-seller",
  dashboardAdmin: "/dashboard-admin",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  vehicles: "/vehicles",
  electrics: "/electrics",
  favorites: "/favorites",
  aboutUs: "/about",
  profile: "/profile",
  postVehicles: "/post/vehicles",
  postElectric: "/post/electrics",
  vehicleDetail: "/vehicles/:postID",
  electricDetail: "/electrics/:postID",
  payment: "/payment",
  paymentCallback: "/payment/callback",
  contractDetail: "/contract/post/:postId",
  contract: "/contract",
  transactions: "/transactions",

  // Complaint routes
  complaints: "/complaints",
  adminComplaints: "/admin/complaints",

  // Admin routes
  adminUsers: "/admin/users",
  adminPosts: "/admin/posts",
  adminOrders: "/admin/orders",
  adminAnalytics: "/admin/analytics",
  adminSettings: "/admin/settings",
  adminProfile: "/admin/profile",
  adminAccount: "/admin/account",

  // Bank and refund routes
  bankRegistration: "/bank-registration",
  refunds: "/refunds",
};
