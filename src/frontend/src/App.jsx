import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/";
import HomePage from "./pages/homepage/HomePage";
import VehiclesPage from "./pages/vehiclesPage/vehiclesPage";
import ElectricsPage from "./pages/electricsPage/electricsPage";
import FavoritesPage from "./pages/favoritesPage/favoritesPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import AuthLayout from "./layout/authenLayout.jsx";
import { Toaster } from "react-hot-toast";
// ❌ KHÔNG dùng PublicRoute cho login/register nữa
// import PublicRoute from "./routes/PublicRoute";
import ForgotPasswordPage from "./pages/forgotpasswordPage/ForgotPasswordPage";
import MainLayout from "./layout/mainLayout";
import ResetPasswordPage from "./pages/resetPasswordPage/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage/VerifyEmailPage"; // giữ đúng theo path bạn đang dùng
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
function App() {
  const router = createBrowserRouter([
    // 🟢 Home công khai
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

    // 🟠 Trang auth: KHÔNG bọc PublicRoute => luôn truy cập được
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

    // optional 404
    { path: "*", element: <div style={{ padding: 20 }}>404 Not Found</div> },
  ]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
