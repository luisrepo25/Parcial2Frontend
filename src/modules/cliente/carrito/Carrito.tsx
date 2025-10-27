import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";
import { useCarrito } from "../../../shared/contexts/CarritoContext";
import { Link } from "react-router-dom";

const Carrito = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCarrito();

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="carrito-empty">
        <div className="carrito-empty-icon">
          <FaShoppingCart />
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde el catálogo para comenzar tu compra</p>
        <Link to="/tienda/catalogo" className="btn-volver-catalogo">
          <FaArrowLeft />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      {/* Header */}
      <div className="carrito-header">
        <div>
          <h1 className="carrito-title">Mi Carrito de Compras</h1>
          <p className="carrito-subtitle">
            Tienes {items.length}{" "}
            {items.length === 1 ? "producto" : "productos"} en tu carrito
          </p>
        </div>
        <Link to="/tienda/catalogo" className="btn-seguir-comprando">
          <FaArrowLeft />
          <span>Seguir Comprando</span>
        </Link>
      </div>

      <div className="carrito-content">
        {/* Lista de Productos */}
        <div className="carrito-items">
          {items.map((item) => (
            <div key={item.producto.id} className="carrito-item">
              {/* Imagen */}
              <div className="carrito-item-image">
                {item.producto.imagen_url ? (
                  <img
                    src={item.producto.imagen_url}
                    alt={item.producto.nombre}
                  />
                ) : (
                  <div className="carrito-no-image">
                    <FaImage />
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="carrito-item-info">
                <h3 className="carrito-item-title">{item.producto.nombre}</h3>
                <p className="carrito-item-category">
                  {item.producto.categoria.nombre}
                </p>
                <p className="carrito-item-price">
                  {formatPrice(item.producto.precio)}
                </p>
              </div>

              {/* Controles de Cantidad */}
              <div className="carrito-item-actions">
                <div className="carrito-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.producto.id, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{item.cantidad}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.producto.id, item.cantidad + 1)
                    }
                    disabled={item.cantidad >= item.producto.stock}
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="carrito-item-subtotal">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-value">
                    {formatPrice(
                      (typeof item.producto.precio === "string"
                        ? parseFloat(item.producto.precio)
                        : item.producto.precio) * item.cantidad
                    )}
                  </span>
                </div>

                {/* Botón Eliminar */}
                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(item.producto.id)}
                  title="Eliminar del carrito"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del Pedido */}
        <div className="carrito-summary">
          <h2 className="summary-title">Resumen del Pedido</h2>

          <div className="summary-details">
            <div className="summary-row">
              <span>Productos ({items.length})</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span className="text-success">Gratis</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>

          <button className="btn-checkout" disabled>
            <FaShoppingCart />
            <span>Proceder al Pago</span>
          </button>

          <p className="checkout-note">
            * La función de compra estará disponible próximamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
