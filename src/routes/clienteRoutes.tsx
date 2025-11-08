import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import ClienteLayout from "../layouts/ClienteLayout";

// Cliente pages
import Catalogo from "../modules/cliente/catalogo/Catalogo";
import Carrito from "../modules/cliente/carrito/Carrito";
import Ordenes from "../modules/cliente/ordenes/Ordenes";
import Perfil from "../modules/cliente/perfil/Perfil";

export const clienteRoutes: RouteObject = {
  path: "/tienda",
  element: (
    <ProtectedRoute requiredRole="cliente">
      <ClienteLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "catalogo", element: <Catalogo /> },
    { path: "carrito", element: <Carrito /> },
    { path: "ordenes", element: <Ordenes /> },
    { path: "perfil", element: <Perfil /> },
  ],
};
