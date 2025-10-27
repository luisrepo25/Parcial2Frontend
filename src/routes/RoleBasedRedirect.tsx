import { Navigate } from "react-router-dom";
import { authApi } from "../modules/auth/services/authapi";

/**
 * Componente que redirige al usuario según su rol
 * - Admin: /admin/productos
 * - Cliente: /tienda/catalogo
 */
const RoleBasedRedirect = () => {
  const user = authApi.getUser();
  const userRole = user?.administrador ? "admin" : "cliente";

  if (userRole === "admin") {
    return <Navigate to="/admin/productos" replace />;
  } else {
    return <Navigate to="/tienda/catalogo" replace />;
  }
};

export default RoleBasedRedirect;
