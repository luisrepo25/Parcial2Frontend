import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productoApi } from "../services/productoApi";
import type { Producto } from "../types";
import {
  DetailSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";

import {
  FaBoxOpen,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaExclamationCircle,
  FaTags,
  FaTrademark,
  FaShieldAlt,
  FaDollarSign,
  FaWarehouse,
  FaImage,
} from "react-icons/fa";

const ProductoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    if (id) {
      cargarProducto(parseInt(id));
    }
  }, [id]);

  const cargarProducto = async (productoId: number) => {
    try {
      setLoading(true);
      const data = await productoApi.getProducto(productoId);
      setProducto(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar producto:", err);
      setError("Error al cargar producto");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    setShowConfirmDialog(true);
  };

  const confirmarEliminacion = async () => {
    if (!producto) return;

    setShowConfirmDialog(false);

    try {
      const response = await productoApi.deleteProducto(producto.id);
      if (response.success) {
        setToast({
          message: "Producto eliminado exitosamente",
          type: "success",
        });
        setTimeout(() => navigate("/productos"), 1500);
      } else {
        setToast({
          message: response.error || "Error al eliminar producto",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setToast({
        message: "Error al eliminar producto",
        type: "error",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle className="icon-alert" /> {error}
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="alert alert-warning">
        <FaExclamationCircle className="icon-alert" /> Producto no encontrado
      </div>
    );
  }

  return (
    <div className="producto-detail-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          title="Eliminar Producto"
          message={`¿Estás seguro de eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setShowConfirmDialog(false)}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>
            <FaBoxOpen /> Detalle de Producto
          </h2>
          <p>Información completa del producto</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/productos" className="btn-secondary">
            <FaArrowLeft /> Volver
          </Link>
          <Link
            to={`/admin/productos/${producto.id}/editar`}
            className="btn-primary"
          >
            <FaEdit /> Editar
          </Link>
          <button onClick={handleEliminar} className="btn-danger">
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h3>{producto.nombre}</h3>
          <span
            className={`stock-badge ${
              producto.stock === 0
                ? "badge-danger"
                : producto.stock < 10
                ? "badge-warning"
                : "badge-success"
            }`}
          >
            {producto.stock === 0
              ? "Sin Stock"
              : producto.stock < 10
              ? "Stock Bajo"
              : "Disponible"}
          </span>
        </div>

        {/* Imagen del producto */}
        <div className="product-image-container">
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="product-image-detail"
            />
          ) : (
            <div className="product-no-image-detail">
              <FaImage />
              <p>Sin imagen</p>
            </div>
          )}
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h4>Información General</h4>

            <div className="detail-row">
              <span className="detail-label">
                <FaBoxOpen /> Nombre:
              </span>
              <span className="detail-value">
                <strong>{producto.nombre}</strong>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Descripción:</span>
              <span className="detail-value">{producto.descripcion}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <FaDollarSign /> Precio:
              </span>
              <span className="detail-value price-highlight">
                {formatPrice(producto.precio)}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <FaWarehouse /> Stock:
              </span>
              <span className="detail-value">
                <strong>{producto.stock}</strong> unidades
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Clasificación</h4>

            <div className="detail-row">
              <span className="detail-label">
                <FaTags /> Categoría:
              </span>
              <span className="detail-value">{producto.categoria.nombre}</span>
            </div>

            {producto.categoria.descripcion && (
              <div className="detail-row">
                <span className="detail-label">Descripción Categoría:</span>
                <span className="detail-value">
                  {producto.categoria.descripcion}
                </span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">
                <FaTrademark /> Marca:
              </span>
              <span className="detail-value">{producto.marca.nombre}</span>
            </div>

            {producto.marca.descripcion && (
              <div className="detail-row">
                <span className="detail-label">Descripción Marca:</span>
                <span className="detail-value">
                  {producto.marca.descripcion}
                </span>
              </div>
            )}

            {producto.garantia && (
              <div className="detail-row">
                <span className="detail-label">
                  <FaShieldAlt /> Garantía:
                </span>
                <span className="detail-value">
                  {producto.garantia.cobertura} meses
                </span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>Información del Sistema</h4>

            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">#{producto.id}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Fecha de Creación:</span>
              <span className="detail-value">
                {producto.created_at
                  ? new Date(producto.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
            </div>

            {producto.updated_at && (
              <div className="detail-row">
                <span className="detail-label">Última Actualización:</span>
                <span className="detail-value">
                  {new Date(producto.updated_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-actions">
          <Link
            to={`/admin/productos/${producto.id}/editar`}
            className="btn-primary"
          >
            <FaEdit /> Editar Producto
          </Link>
          <button onClick={handleEliminar} className="btn-danger">
            <FaTrash /> Eliminar Producto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetail;
