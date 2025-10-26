import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { categoriaApi } from "../services/categoriaApi";
import type { Categoria } from "../types";
import {
  DetailSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../shared/components";
import type { ToastType } from "../../../shared/components/Toast";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";
import "../../../shared/styles/components.css";
import "./CategoriaDetail.css";

const CategoriaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (id) {
      cargarCategoria(Number(id));
    }
  }, [id]);

  const cargarCategoria = async (categoriaId: number) => {
    try {
      setLoading(true);
      const data = await categoriaApi.getCategoria(categoriaId);
      setCategoria(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar la categoría");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!categoria) return;
    setShowConfirmDialog(true);
  };

  const confirmarEliminacion = async () => {
    if (!categoria) return;
    setShowConfirmDialog(false);

    try {
      const response = await categoriaApi.deleteCategoria(categoria.id);
      if (response.success) {
        setToast({
          message: "Categoría eliminada exitosamente",
          type: "success",
        });
        setTimeout(() => navigate("/categorias"), 1500);
      } else {
        setToast({
          message: response.error || "Error al eliminar categoría",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ message: "Error al eliminar categoría", type: "error" });
      console.error(err);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error)
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle /> {error}
      </div>
    );
  if (!categoria)
    return (
      <div className="alert alert-warning">
        <FaExclamationCircle /> Categoría no encontrada
      </div>
    );

  return (
    <div className="categoria-detail-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          title="Eliminar Categoría"
          message={`¿Estás seguro de eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setShowConfirmDialog(false)}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>Detalle de Categoría</h2>
          <p>Información completa de la categoría</p>
        </div>
        <div className="header-actions">
          <Link to="/categorias" className="btn-secondary">
            <FaArrowLeft /> Volver
          </Link>
          <Link
            to={`/categorias/editar/${categoria.id}`}
            className="btn-primary"
          >
            <FaEdit /> Editar
          </Link>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-title">
            <h3>{categoria.nombre}</h3>
          </div>
          <div className="detail-id">ID: #{categoria.id}</div>
        </div>

        <div className="detail-content">
          <div className="detail-row">
            <div className="detail-label">Nombre:</div>
            <div className="detail-value">{categoria.nombre}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Descripción:</div>
            <div className="detail-value">
              {categoria.descripcion || (
                <span className="text-muted">Sin descripción</span>
              )}
            </div>
          </div>

          {categoria.created_at && (
            <div className="detail-row">
              <div className="detail-label">Fecha de Creación:</div>
              <div className="detail-value">
                {new Date(categoria.created_at).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}

          {categoria.updated_at && (
            <div className="detail-row">
              <div className="detail-label">Última Actualización:</div>
              <div className="detail-value">
                {new Date(categoria.updated_at).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}
        </div>

        <div className="detail-actions">
          <button onClick={handleEliminar} className="btn-danger">
            <FaTrash /> Eliminar Categoría
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaDetail;
