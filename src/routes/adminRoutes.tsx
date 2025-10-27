import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute";
// import AdminLayout from "../layouts/AdminLayout";

// Productos
import ProductosList from "../modules/admin/productos/pages/ProductosList";
import ProductoForm from "../modules/admin/productos/pages/ProductoForm";
import ProductoDetail from "../modules/admin/productos/pages/ProductoDetail";

// Categorías
import CategoriasList from "../modules/admin/categoria/pages/CategoriasList";
import CategoriaForm from "../modules/admin/categoria/pages/CategoriaForm";
import CategoriaDetail from "../modules/admin/categoria/pages/CategoriaDetail";

// Marcas
import MarcasList from "../modules/admin/Marca/pages/MarcasList";
import MarcaForm from "../modules/admin/Marca/pages/MarcaForm";
import MarcaDetail from "../modules/admin/Marca/pages/MarcaDetail";

// Garantías
import GarantiasList from "../modules/admin/garantia/pages/GarantiasList";
import GarantiaForm from "../modules/admin/garantia/pages/GarantiaForm";
import GarantiaDetail from "../modules/admin/garantia/pages/GarantiaDetail";

// Usuarios
import UsersList from "../modules/admin/users/pages/UsersList";
import UserForm from "../modules/admin/users/pages/UserForm";
import UserDetail from "../modules/admin/users/pages/UserDetail";

import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute requiredRole="admin">
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // Productos
    { path: "productos", element: <ProductosList /> },
    { path: "productos/nuevo", element: <ProductoForm /> },
    { path: "productos/:id/editar", element: <ProductoForm /> },
    { path: "productos/:id", element: <ProductoDetail /> },

    { path: "dashboard", element: <Dashboard /> },

    // Categorías
    { path: "categorias", element: <CategoriasList /> },
    { path: "categorias/nuevo", element: <CategoriaForm /> },
    { path: "categorias/:id/editar", element: <CategoriaForm /> },
    { path: "categorias/:id", element: <CategoriaDetail /> },

    // Marcas
    { path: "marcas", element: <MarcasList /> },
    { path: "marcas/nuevo", element: <MarcaForm /> },
    { path: "marcas/:id/editar", element: <MarcaForm /> },
    { path: "marcas/:id", element: <MarcaDetail /> },

    // Garantías
    { path: "garantias", element: <GarantiasList /> },
    { path: "garantias/nuevo", element: <GarantiaForm /> },
    { path: "garantias/:id/editar", element: <GarantiaForm /> },
    { path: "garantias/:id", element: <GarantiaDetail /> },

    // Usuarios
    { path: "usuarios", element: <UsersList /> },
    { path: "usuarios/nuevo", element: <UserForm /> },
    { path: "usuarios/:id/editar", element: <UserForm /> },
    { path: "usuarios/:id", element: <UserDetail /> },
  ],
};
