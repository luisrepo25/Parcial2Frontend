import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaHome,
  FaShoppingBag,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { useCarrito } from "../../../shared/contexts/CarritoContext";
import { useVentas } from "../ventas/hooks/useVentas";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCarrito();
  const { verificarSesion } = useVentas();

  const [estado, setEstado] = useState<"verificando" | "exitoso" | "error">(
    "verificando"
  );
  const [ordenId, setOrdenId] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const sessionId = searchParams.get("session_id");

  const verificarPago = useCallback(async () => {
    console.log("🔍 Session ID recibido:", sessionId);

    if (!sessionId) {
      console.error("❌ No se encontró session_id en la URL");
      setEstado("error");
      return;
    }

    try {
      console.log("📡 Llamando a verificarSesion con:", sessionId);
      const result = await verificarSesion(sessionId);
      console.log("📥 Respuesta de verificarSesion:", result);

      if (result?.ok && result.nota_venta?.estado === "pagada") {
        console.log("✅ Pago verificado exitosamente");
        setEstado("exitoso");
        setOrdenId(result.nota_venta.id);
        setTotal(result.nota_venta.total);
        // Limpiar el carrito solo si el pago fue exitoso
        clearCart();
      } else {
        console.error("❌ Pago no verificado o error en respuesta:", result);
        setEstado("error");
      }
    } catch (error) {
      console.error("❌ Error al verificar pago:", error);
      setEstado("error");
    }
  }, [sessionId, verificarSesion, clearCart]);

  useEffect(() => {
    verificarPago();
  }, [verificarPago]);

  // Estado de verificación
  if (estado === "verificando") {
    return (
      <div className="checkout-success-container">
        <div className="checkout-success-card">
          <div className="success-icon verificando">
            <FaSpinner className="spin" />
          </div>
          <h1 className="success-title">Verificando tu pago...</h1>
          <p className="success-message">
            Por favor espera mientras confirmamos tu transacción
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (estado === "error") {
    return (
      <div className="checkout-success-container">
        <div className="checkout-success-card">
          <div className="success-icon error">
            <FaTimesCircle />
          </div>
          <h1 className="success-title">Hubo un problema</h1>
          <p className="success-message">
            No pudimos verificar tu pago. Por favor, contacta con soporte.
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
        </div>
      </div>
    );
  }

  // Estado exitoso
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

        {ordenId && total && (
          <div className="detalles-pago">
            <div className="detalle-item">
              <span className="label">Orden #:</span>
              <span className="value">{ordenId}</span>
            </div>
            <div className="detalle-item">
              <span className="label">Total Pagado:</span>
              <span className="value total">${total.toFixed(2)}</span>
            </div>
          </div>
        )}

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
