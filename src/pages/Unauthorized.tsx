import { useNavigate } from "react-router-dom";
import { FaLock, FaHome } from "react-icons/fa";
import { authApi } from "../modules/auth/services/authapi";
import { useEffect } from "react";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Determinar la ruta correcta según el rol del usuario
    const user = authApi.getUser();
    const userRole = user?.administrador ? "admin" : "cliente";

    // Guardar la ruta de inicio en el componente
    if (userRole === "admin") {
      sessionStorage.setItem("homeRoute", "/admin/productos");
    } else {
      sessionStorage.setItem("homeRoute", "/tienda/catalogo");
    }
  }, []);

  const handleGoHome = () => {
    const homeRoute = sessionStorage.getItem("homeRoute") || "/";
    navigate(homeRoute);
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <FaLock className="unauthorized-icon" />
        <h1>403 - Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <p className="unauthorized-subtitle">
          Por favor, contacta al administrador si crees que esto es un error.
        </p>
        <button onClick={handleGoHome} className="btn-primary">
          <FaHome /> Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
