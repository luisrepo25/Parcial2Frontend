import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { productoApi } from "../services/productoApi";
import type { Producto } from "../types";
import {
  TableSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../shared/components";
import type { ToastType } from "../../../shared/components/Toast";
import "../../../shared/styles/components.css";
import "./ProductosList.css";

import {
  FaBoxOpen,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";

const ProductosList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    productoId: number;
    productoNombre: string;
  }>({ show: false, productoId: 0, productoNombre: "" });

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productoApi.getProductos();
      setProductos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleEliminar = async (id: number, nombre: string) => {
    setConfirmDialog({ show: true, productoId: id, productoNombre: nombre });
  };

  const confirmarEliminacion = async () => {
    const { productoId } = confirmDialog;
    setConfirmDialog({ show: false, productoId: 0, productoNombre: "" });

    try {
      const response = await productoApi.deleteProducto(productoId);
      if (response.success) {
        setProductos((prev) =>
          prev.filter((producto) => producto.id !== productoId)
        );
        setToast({
          message: "Producto eliminado exitosamente",
          type: "success",
        });
      } else {
        setToast({
          message: response.error || "Error al eliminar producto",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al eliminar producto", type: "error" });
    }
  };

  const cancelarEliminacion = () => {
    setConfirmDialog({ show: false, productoId: 0, productoNombre: "" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) return <TableSkeleton rows={5} columns={7} />;
  if (error)
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle className="icon-alert" /> {error}
      </div>
    );

  return (
    <div className="productos-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Eliminar Producto"
          message={`¿Estás seguro de eliminar el producto "${confirmDialog.productoNombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={cancelarEliminacion}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>Gestión de Productos</h2>
          <p>Administra el catálogo de productos del sistema</p>
        </div>
        <Link to="/productos/nuevo" className="btn-primary">
          <FaPlus /> Nuevo Producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBoxOpen size={48} />
          </div>
          <h3>No hay productos registrados</h3>
          <p>Comienza creando tu primer producto</p>
          <Link to="/productos/nuevo" className="btn-primary">
            <FaPlus /> Crear Producto
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>#{producto.id}</td>
                  <td>
                    <strong>{producto.nombre}</strong>
                  </td>
                  <td>{producto.categoria.nombre}</td>
                  <td>{producto.marca.nombre}</td>
                  <td>
                    <strong className="text-price">
                      {formatPrice(producto.precio)}
                    </strong>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        producto.stock === 0
                          ? "badge-danger"
                          : producto.stock < 10
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {producto.stock} unidades
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/productos/${producto.id}`}
                        className="btn-secondary btn-sm"
                        title="Ver detalles"
                      >
                        <FaEye /> Ver
                      </Link>
                      <Link
                        to={`/productos/editar/${producto.id}`}
                        className="btn-primary btn-sm"
                        title="Editar"
                      >
                        <FaEdit /> Editar
                      </Link>
                      <button
                        onClick={() =>
                          handleEliminar(producto.id, producto.nombre)
                        }
                        className="btn-danger btn-sm"
                        title="Eliminar"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductosList;
