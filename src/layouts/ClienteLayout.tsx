import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../modules/auth/services/authapi";
import { useCarrito } from "../shared/contexts/CarritoContext";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaSignOutAlt,
  FaReceipt,
  FaUserCircle,
} from "react-icons/fa";

const ClienteLayout = () => {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getTotalItems } = useCarrito();
  const cartCount = getTotalItems();

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  return (
    <div className="cliente-layout">
      {/* Header */}
      <header className="store-header">
        <div className="store-header-content">
          {/* Logo */}
          <Link to="/tienda/catalogo" className="store-logo">
            <div className="store-logo-icon">S</div>
            <span className="store-logo-text">Store</span>
          </Link>

          {/* Buscador Central */}
          <div className="store-search">
            <FaSearch className="store-search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="store-search-input"
            />
          </div>

          {/* Acciones del Header */}
          <div className="store-actions">
            {/* Carrito */}
            <Link to="/tienda/carrito" className="store-cart-btn">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Menú de Usuario */}
            <div className="store-user-menu">
              <button
                className="store-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="user-menu-overlay"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <FaUserCircle className="user-menu-avatar" />
                      <div className="user-menu-info">
                        <p className="user-menu-title">Mi Cuenta</p>
                        <p className="user-menu-email">{user?.correo}</p>
                      </div>
                    </div>

                    <div className="user-menu-divider" />

                    <Link
                      to="/tienda/perfil"
                      className="user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser />
                      <span>Perfil</span>
                    </Link>

                    <Link
                      to="/tienda/ordenes"
                      className="user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaReceipt />
                      <span>Mis Compras</span>
                    </Link>

                    <div className="user-menu-divider" />

                    <button className="user-menu-item" onClick={handleLogout}>
                      <FaSignOutAlt />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="store-main">
        <div className="store-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClienteLayout;
