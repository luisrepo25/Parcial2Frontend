import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaTachometerAlt, // Dashboard
  FaBoxOpen, // Productos
  FaCashRegister, // Ventas
  FaClipboardList, // Inventario
  FaUser, // Usuarios
  FaChartLine, // Reportes
  FaTags, // Categorías
  FaBell, // Notificaciones
  FaCog, // Configuración
  FaSignOutAlt, // Logout
  FaTrademark, // Marcas
  FaShieldAlt, // Garantías
} from "react-icons/fa";
import { authApi } from "../modules/auth/services/authapi";
import type { Usuario } from "../modules/auth/types";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    // Cargar información del usuario
    const user = authApi.getUser();
    setUsuario(user);
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      authApi.logout();
      navigate("/login");
    }
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/categorias", label: "Categorías", icon: <FaTags /> },
    { path: "/admin/marcas", label: "Marcas", icon: <FaTrademark /> },
    { path: "/admin/garantias", label: "Garantías", icon: <FaShieldAlt /> },
    { path: "/admin/productos", label: "Productos", icon: <FaBoxOpen /> },
    { path: "/admin/ventas", label: "Ventas", icon: <FaCashRegister /> },
    {
      path: "/admin/inventario",
      label: "Inventario",
      icon: <FaClipboardList />,
    },
    { path: "/admin/usuarios", label: "Usuarios", icon: <FaUser /> },
    { path: "/admin/reportes", label: "Reportes", icon: <FaChartLine /> },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="main-layout">
      <nav className="sidebar">
        <div className="logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">
            <h2>SmartSales</h2>
            <span>Sistema de Ventas</span>
          </div>
        </div>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={isActive(item.path) ? "active" : ""}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {usuario?.correo?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span className="user-name">
                {usuario?.correo?.split("@")[0] || "Usuario"}
              </span>
              <span className="user-role">
                {usuario?.administrador
                  ? "Administrador"
                  : usuario?.rol || "Usuario"}
              </span>
            </div>
          </div>
          <button
            className="btn-logout"
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </nav>
      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>Bienvenido</h1>
            <div className="header-actions">
              <button className="btn-icon" title="Notificaciones">
                <FaBell />
              </button>
              <button className="btn-icon" title="Configuración">
                <FaCog />
              </button>
            </div>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
