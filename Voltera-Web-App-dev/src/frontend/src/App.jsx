import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/route";
import HomePage from "./pages/homepage/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    {
      path: routes.home,
      element: (<HomePage />),
    },
  ]);

  return <>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />
  </>;
}

export default App;
