import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Login from "../modules/auth/pages/Login";
import Error404 from "../pages/error404";
import Unauthorized from "../pages/Unauthorized";
import { adminRoutes } from "./adminRoutes";
import { clienteRoutes } from "./clienteRoutes";
import RoleBasedRedirect from "./RoleBasedRedirect";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  // Rutas del administrador
  adminRoutes,

  // Rutas del cliente/tienda
  clienteRoutes,

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RoleBasedRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);
