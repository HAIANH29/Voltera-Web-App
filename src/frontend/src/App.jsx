import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/";
import HomePage from "./pages/homepage/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import AuthLayout from "./layout/authenLayout";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./routes/PublicRoute";
function App() {
  const router = createBrowserRouter([
    {
      path: routes.home,
      element: (
        <PublicRoute>
          <HomePage />
        </PublicRoute>
      ),
    },
    {
      path: routes.login,
      element: (
        <PublicRoute>
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        </PublicRoute>
      ),
    },
    {
      path: routes.register,
      element: (
        <PublicRoute>
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        </PublicRoute>
      ),
    },
    {
      path: routes.forgotPassword,
      element: (
        <PublicRoute>
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        </PublicRoute>
      ),
    },
  ]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
