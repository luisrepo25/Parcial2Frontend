import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { garantiaApi } from "../services/garantiaApi";
import type { Garantia } from "../types";
import {
  DetailSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";

import {
  FaShieldAlt,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";

const GarantiaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [garantia, setGarantia] = useState<Garantia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    if (id) {
      cargarGarantia(parseInt(id));
    }
  }, [id]);

  const cargarGarantia = async (garantiaId: number) => {
    try {
      setLoading(true);
      const data = await garantiaApi.getGarantia(garantiaId);
      setGarantia(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar garantía:", err);
      setError("Error al cargar garantía");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    setShowConfirmDialog(true);
  };

  const confirmarEliminacion = async () => {
    if (!garantia) return;

    setShowConfirmDialog(false);

    try {
      const response = await garantiaApi.deleteGarantia(garantia.id);
      if (response.success) {
        setToast({
          message: "Garantía eliminada exitosamente",
          type: "success",
        });
        setTimeout(() => navigate("/garantias"), 1500);
      } else {
        setToast({
          message: response.error || "Error al eliminar garantía",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setToast({
        message: "Error al eliminar garantía",
        type: "error",
      });
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle className="icon-alert" /> {error}
      </div>
    );
  }

  if (!garantia) {
    return (
      <div className="alert alert-warning">
        <FaExclamationCircle className="icon-alert" /> Garantía no encontrada
      </div>
    );
  }

  return (
    <div className="garantia-detail-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          title="Eliminar Garantía"
          message={`¿Estás seguro de eliminar la garantía de ${garantia.cobertura} meses para ${garantia.marca.nombre}? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setShowConfirmDialog(false)}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>
            <FaShieldAlt /> Detalle de Garantía
          </h2>
          <p>Información completa de la garantía</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/garantias" className="btn-secondary">
            <FaArrowLeft /> Volver
          </Link>
          <Link
            to={`/admin/garantias/editar/${garantia.id}`}
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
          <h3>Garantía #{garantia.id}</h3>
        </div>

        <div className="detail-content">
          <div className="detail-row">
            <span className="detail-label">Cobertura:</span>
            <span className="detail-value">
              <strong>{garantia.cobertura} meses</strong>
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Marca:</span>
            <span className="detail-value">{garantia.marca.nombre}</span>
          </div>

          {garantia.marca.descripcion && (
            <div className="detail-row">
              <span className="detail-label">Descripción Marca:</span>
              <span className="detail-value">{garantia.marca.descripcion}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Fecha de Creación:</span>
            <span className="detail-value">
              {garantia.created_at
                ? new Date(garantia.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </span>
          </div>

          {garantia.updated_at && (
            <div className="detail-row">
              <span className="detail-label">Última Actualización:</span>
              <span className="detail-value">
                {new Date(garantia.updated_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        <div className="detail-actions">
          <Link
            to={`/admin/garantias/${garantia.id}/editar`}
            className="btn-primary"
          >
            <FaEdit /> Editar Garantía
          </Link>
          <button onClick={handleEliminar} className="btn-danger">
            <FaTrash /> Eliminar Garantía
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarantiaDetail;
