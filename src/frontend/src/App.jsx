import ContractPage from "./pages/contractPage/ContractPage";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/index.jsx"; // ✅ sửa lại đường dẫn import CHÍNH XÁC
import HomePage from "./pages/homepage/HomePage";
import VehiclesPage from "./pages/vehiclesPage/vehiclesPage";
import ElectricsPage from "./pages/electricsPage/electricsPage";
import FavoritesPage from "./pages/favoritesPage/favoritesPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import AuthLayout from "./layout/authenLayout.jsx";
import SupportPage from "./pages/SupportPage/SupportPage.jsx";
import { Toaster } from "react-hot-toast";
import PostElectricWizard from "./pages/post/electrics/PostElectricWizard";
import ForgotPasswordPage from "./pages/forgotpasswordPage/ForgotPasswordPage";
import MainLayout from "./layout/mainLayout";
import AdminLayout from "./layout/adminLayout";
import BuyerLayout from "./layout/buyerLayout";
import SellerLayout from "./layout/sellerLayout";
import ResetPasswordPage from "./pages/resetPasswordPage/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage/VerifyEmailPage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PostVehicleWizard from "./pages/post/vehicles/PostVehicleWizard";
import VehicleDetail from "./pages/vehicleDetail/vehicleDetail";
import ElectricDetail from "./pages/electricDetail/electricDetail";
import DashboardAdmin from "./pages/dashboardAdmin/dashboardAdmin";
import DashboardSeller from "./pages/dashboardSeller/dashboardSeller";
import DashboardBuyer from "./pages/dashboardBuyer/dashboardBuyer";
import Dashboard from "./components/Dashboard";
import PaymentPage from "./pages/paymentPage/PaymentPage";
import PaymentCallback from "./pages/paymentPage/PaymentCallback";
import ContractPage from "./pages/contractPage/contractPage";
import ContractsPage from "./pages/contractsPage/contractsPage";

console.log("routes:", routes);
console.log("postVehicles:", routes.postVehicles);

function App() {
  const router = createBrowserRouter([
    {
      path: routes.contract,
      element: (
        <MainLayout>
          <ContractPage />
        </MainLayout>
      ),
    },
    {
      path: routes.home,
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      ),
      errorElement: (
        <div style={{ padding: 20, color: "crimson" }}>Route error 🚨</div>
      ),
    },
    {
      path: routes.vehicles,
      element: (
        <MainLayout>
          <VehiclesPage />
        </MainLayout>
      ),
    },
    {
      path: routes.electrics,
      element: (
        <MainLayout>
          <ElectricsPage />
        </MainLayout>
      ),
    },
    {
      path: routes.favorites,
      element: (
        <MainLayout>
          <FavoritesPage />
        </MainLayout>
      ),
    },

    {
      path: routes.postVehicles, // ✅ route chính
      element: (
        <MainLayout>
          <PostVehicleWizard />
        </MainLayout>
      ),
    },
    {
      path: routes.postElectric,
      element: (
        <MainLayout>
          <PostElectricWizard />
        </MainLayout>
      ),
    },
    {
      path: routes.vehicleDetail,
      element: (
        <MainLayout>
          <VehicleDetail />
        </MainLayout>
      ),
    },
    {
      path: routes.electricDetail,
      element: (
        <MainLayout>
          <ElectricDetail />
        </MainLayout>
      ),
    },
    {
      path: routes.payment,
      element: (
        <MainLayout>
          <PaymentPage />
        </MainLayout>
      ),
    },
    {
      path: routes.paymentCallback,
      element: (
        <MainLayout>
          <PaymentCallback />
        </MainLayout>
      ),
    },
    {
      path: routes.contract,
      element: (
        <MainLayout>
          <ContractPage />
        </MainLayout>
      ),
    },
    {
      path: routes.contractView,
      element: (
        <MainLayout>
          <ContractPage />
        </MainLayout>
      ),
    },
    {
      path: routes.contracts,
      element: (
        <MainLayout>
          <ContractsPage />
        </MainLayout>
      ),
    },
    {
      path: routes.verifyEmail,
      element: (
        <AuthLayout>
          <VerifyEmailPage />
        </AuthLayout>
      ),
    },
    {
      path: routes.login,
      element: (
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      ),
    },
    {
      path: routes.register,
      element: (
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      ),
    },
    {
      path: routes.forgotPassword,
      element: (
        <AuthLayout>
          <ForgotPasswordPage />
        </AuthLayout>
      ),
    },
    {
      path: routes.resetPassword,
      element: (
        <AuthLayout>
          <ResetPasswordPage />
        </AuthLayout>
      ),
    },
    {
      path: routes.aboutUs,
      element: (
        <MainLayout>
          <AboutUsPage />
        </MainLayout>
      ),
    },
    {
      path: routes.profile,
      element: (
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      ),
    },

    // ✅ thêm route fallback để tránh "No routes matched location"
    {
      path: "*",
      element: (
        <MainLayout>
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for doesn’t exist.</p>
          </div>
        </MainLayout>
      ),
    },
    {
      path: routes.support,
      element: (
        <MainLayout>
          <SupportPage />
        </MainLayout>
      ),
    },
    {
      path: routes.dashboard,
      element: (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      ),
    },
    {
      path: routes.dashboardSeller,
      element: (
        <SellerLayout>
          <DashboardSeller />
        </SellerLayout>
      ),
    },
    {
      path: routes.dashboardAdmin,
      element: (
        <AdminLayout>
          <DashboardAdmin />
        </AdminLayout>
      ),
    },
    {
      path: routes.dashboardBuyer,
      element: (
        <BuyerLayout>
          <DashboardBuyer />
        </BuyerLayout>
      ),
    },

    // Admin routes with AdminLayout
    {
      path: routes.adminUsers,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Users Management</h1>
            <p>Admin users management page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },
    {
      path: routes.adminPosts,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Posts Management</h1>
            <p>Admin posts management page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },
    {
      path: routes.adminOrders,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Orders Management</h1>
            <p>Admin orders management page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },
    {
      path: routes.adminAnalytics,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Analytics</h1>
            <p>Admin analytics page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },
    {
      path: routes.adminSettings,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Settings</h1>
            <p>Admin settings page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },
    {
      path: routes.adminProfile,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Admin Profile</h1>
            <p>Admin profile page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },
    {
      path: routes.adminAccount,
      element: (
        <AdminLayout>
          <div style={{ padding: 20 }}>
            <h1>Account Settings</h1>
            <p>Admin account settings page will be implemented here.</p>
          </div>
        </AdminLayout>
      ),
    },

    // optional 404
    { path: "*", element: <div style={{ padding: 20 }}>404 Not Found</div> },
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
