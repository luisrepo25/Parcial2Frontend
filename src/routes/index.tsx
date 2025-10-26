import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Error404 from "../pages/error404";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Login from "../modules/auth/pages/Login";
import categoriasRoutes from "../modules/categoria/routes";
import marcasRoutes from "../modules/Marca/routes";
import garantiasRoutes from "../modules/garantia/routes";
import productosRoutes from "../modules/productos/routes";

// Importa aquí las rutas de cada módulo cuando las crees
// import clientesRoutes from '../modules/clientes/routes';
// import ventasRoutes from '../modules/ventas/routes';
// import inventarioRoutes from '../modules/inventario/routes';
// import usuariosRoutes from '../modules/usuarios/routes';
// import reportesRoutes from '../modules/reportes/routes';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "categorias/*",
        children: categoriasRoutes,
      },
      {
        path: "marcas/*",
        children: marcasRoutes,
      },
      {
        path: "garantias/*",
        children: garantiasRoutes,
      },
      {
        path: "productos/*",
        children: productosRoutes,
      },
      // Descomenta y usa estas líneas cuando crees las rutas de cada módulo
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
