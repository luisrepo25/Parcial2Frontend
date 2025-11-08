import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHome,
  FaReceipt,
} from "react-icons/fa";
import { useVentas } from "../ventas/hooks/useVentas";

interface DetallesVenta {
  id: number;
  total: number;
  estado: string;
}

const VerificarPago = () => {
  const [searchParams] = useSearchParams();
  const { verificarSesion } = useVentas();
  const [estado, setEstado] = useState<"verificando" | "exitoso" | "fallido">(
    "verificando"
  );
  const [mensaje, setMensaje] = useState("");
  const [detalles, setDetalles] = useState<DetallesVenta | null>(null);

  const sessionId = searchParams.get("session_id");

  const verificarPago = useCallback(async () => {
    if (!sessionId) {
      setEstado("fallido");
      setMensaje("No se encontró el ID de sesión");
      return;
    }

    try {
      const result = await verificarSesion(sessionId);

      if (result?.ok) {
        if (result.nota_venta?.estado === "pagada") {
          setEstado("exitoso");
          setMensaje("¡Tu pago ha sido procesado exitosamente!");
          setDetalles(result.nota_venta);
        } else {
          setEstado("fallido");
          setMensaje(`Estado del pago: ${result.nota_venta?.estado}`);
        }
      } else {
        setEstado("fallido");
        setMensaje(result?.error || "Error al verificar el pago");
      }
    } catch {
      setEstado("fallido");
      setMensaje("Error al verificar el pago");
    }
  }, [sessionId, verificarSesion]);

  useEffect(() => {
    verificarPago();
  }, [verificarPago]);

  if (estado === "verificando") {
    return (
      <div className="verificar-pago-container">
        <div className="verificar-card">
          <div className="verificar-icon verificando">
            <FaSpinner className="spin" />
          </div>
          <h2>Verificando tu pago...</h2>
          <p>Por favor espera mientras confirmamos tu transacción</p>
        </div>
      </div>
    );
  }

  if (estado === "exitoso") {
    return (
      <div className="verificar-pago-container">
        <div className="verificar-card exitoso">
          <div className="verificar-icon success">
            <FaCheckCircle />
          </div>
          <h2>¡Pago Exitoso!</h2>
          <p>{mensaje}</p>

          {detalles && (
            <div className="detalles-pago">
              <div className="detalle-item">
                <span className="label">Orden #:</span>
                <span className="value">{detalles.id}</span>
              </div>
              <div className="detalle-item">
                <span className="label">Total Pagado:</span>
                <span className="value total">
                  ${detalles.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="verificar-actions">
            <Link to="/tienda/ordenes" className="btn btn-primary">
              <FaReceipt />
              <span>Ver Mis Órdenes</span>
            </Link>
            <Link to="/tienda/catalogo" className="btn btn-secondary">
              <FaHome />
              <span>Volver al Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Estado fallido
  return (
    <div className="verificar-pago-container">
      <div className="verificar-card fallido">
        <div className="verificar-icon error">
          <FaTimesCircle />
        </div>
        <h2>Pago No Completado</h2>
        <p>{mensaje}</p>

        <div className="verificar-actions">
          <Link to="/tienda/carrito" className="btn btn-primary">
            Volver al Carrito
          </Link>
          <Link to="/tienda/catalogo" className="btn btn-secondary">
            <FaHome />
            <span>Ir al Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificarPago;
