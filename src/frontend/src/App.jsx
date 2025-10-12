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
import ResetPasswordPage from "./pages/resetPasswordPage/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage/VerifyEmailPage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import PostVehicleWizard from "./pages/post/vehicles/PostVehicleWizard";
import VehicleDetail from "./pages/vehicleDetail/vehicleDetail";
import DashboardAdmin from "./pages/dashboardAdmin/dashboardAdmin.jsx";

console.log("routes:", routes);
console.log("postVehicles:", routes.postVehicles);

function App() {
  const router = createBrowserRouter([
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
    // {
    //   path: routes.support,
    //   element: (
    //     <MainLayout>
    //       <DashboardAdmin/>
    //     </MainLayout>
    //   ),
    // },

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
