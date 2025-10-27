import { Navigate } from "react-router-dom";
import { authApi } from "../../modules/auth/services/authapi";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "cliente";
  allowedRoles?: ("admin" | "cliente")[];
}

const ProtectedRoute = ({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) => {
  const isAuthenticated = authApi.isAuthenticated();
  const user = authApi.getUser();

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Determinar el rol del usuario
  const userRole = user?.administrador ? "admin" : "cliente";

  // Verificar si requiere un rol específico
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verificar si está en la lista de roles permitidos
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
