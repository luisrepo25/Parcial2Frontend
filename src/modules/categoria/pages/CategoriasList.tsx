import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { categoriaApi } from "../services/categoriaApi";
import type { Categoria } from "../types";
import {
  TableSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../shared/components";
import type { ToastType } from "../../../shared/components/Toast";
import "../../../shared/styles/components.css";
import "./CategoriasList.css";

import {
  FaTags,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";

const CategoriasList = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    categoriaId: number;
    categoriaNombre: string;
  }>({ show: false, categoriaId: 0, categoriaNombre: "" });

  const cargarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoriaApi.getCategorias();
      setCategorias(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const handleEliminar = async (id: number, nombre: string) => {
    setConfirmDialog({ show: true, categoriaId: id, categoriaNombre: nombre });
  };

  const confirmarEliminacion = async () => {
    const { categoriaId } = confirmDialog;
    setConfirmDialog({ show: false, categoriaId: 0, categoriaNombre: "" });

    try {
      const response = await categoriaApi.deleteCategoria(categoriaId);
      if (response.success) {
        setCategorias((prev) => prev.filter((cat) => cat.id !== categoriaId));
        setToast({
          message: "Categoría eliminada exitosamente",
          type: "success",
        });
      } else {
        setToast({
          message: response.error || "Error al eliminar categoría",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al eliminar categoría", type: "error" });
    }
  };

  const cancelarEliminacion = () => {
    setConfirmDialog({ show: false, categoriaId: 0, categoriaNombre: "" });
  };

  if (loading) return <TableSkeleton rows={5} columns={5} />;
  if (error)
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle className="icon-alert" /> {error}
      </div>
    );

  return (
    <div className="categorias-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Eliminar Categoría"
          message={`¿Estás seguro de eliminar la categoría "${confirmDialog.categoriaNombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={cancelarEliminacion}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>Gestión de Categorías</h2>
          <p>Administra las categorías de productos del sistema</p>
        </div>
        <Link to="/categorias/nuevo" className="btn-primary">
          <FaPlus /> Nueva Categoría
        </Link>
      </div>

      {categorias.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaTags size={48} />
          </div>
          <h3>No hay categorías registradas</h3>
          <p>Comienza creando tu primera categoría</p>
          <Link to="/categorias/nuevo" className="btn-primary">
            <FaPlus /> Crear Categoría
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>#{categoria.id}</td>
                  <td>
                    <strong>{categoria.nombre}</strong>
                  </td>
                  <td>{categoria.descripcion || "-"}</td>
                  <td>
                    {categoria.created_at
                      ? new Date(categoria.created_at).toLocaleDateString(
                          "es-ES"
                        )
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/categorias/${categoria.id}`}
                        className="btn-secondary btn-sm"
                        title="Ver detalles"
                      >
                        <FaEye /> Ver
                      </Link>
                      <Link
                        to={`/categorias/editar/${categoria.id}`}
                        className="btn-primary btn-sm"
                        title="Editar"
                      >
                        <FaEdit /> Editar
                      </Link>
                      <button
                        onClick={() =>
                          handleEliminar(categoria.id, categoria.nombre)
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

export default CategoriasList;
