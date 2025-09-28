import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/route";
import HomePage from "./pages/homepage/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";

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
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: routes.register,
      element: (
        <PublicRoute>
          <RegisterPage />
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
