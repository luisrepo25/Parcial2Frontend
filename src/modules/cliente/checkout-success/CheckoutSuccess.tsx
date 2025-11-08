import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { useCarrito } from "../../../shared/contexts/CarritoContext";

const CheckoutSuccess = () => {
  const { clearCart } = useCarrito();

  useEffect(() => {
    // Limpiar el carrito cuando se confirma el pago exitoso
    clearCart();
  }, [clearCart]);

  return (
    <div className="checkout-success-container">
      <div className="checkout-success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h1 className="success-title">¡Pago Exitoso!</h1>
        <p className="success-message">
          Tu compra ha sido procesada correctamente.
        </p>
        <p className="success-submessage">
          Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>

        <div className="success-actions">
          <Link to="/tienda/catalogo" className="btn btn-primary">
            <FaHome />
            <span>Volver al Catálogo</span>
          </Link>
          <Link to="/tienda/ordenes" className="btn btn-secondary">
            <FaShoppingBag />
            <span>Ver Mis Compras</span>
          </Link>
        </div>

        <div className="success-footer">
          <p>Gracias por tu compra 💜</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
