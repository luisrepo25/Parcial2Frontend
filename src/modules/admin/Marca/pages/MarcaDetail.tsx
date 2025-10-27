import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { marcaApi } from "../services/marcaApi";
import type { Marca } from "../types";
import {
  DetailSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";

const MarcaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [marca, setMarca] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (id) {
      cargarMarca(Number(id));
    }
  }, [id]);

  const cargarMarca = async (marcaId: number) => {
    try {
      setLoading(true);
      const data = await marcaApi.getMarca(marcaId);
      setMarca(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar la marca");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!marca) return;
    setShowConfirmDialog(true);
  };

  const confirmarEliminacion = async () => {
    if (!marca) return;
    setShowConfirmDialog(false);

    try {
      const response = await marcaApi.deleteMarca(marca.id);
      if (response.success) {
        setToast({
          message: "Marca eliminada exitosamente",
          type: "success",
        });
        setTimeout(() => navigate("/marcas"), 1500);
      } else {
        setToast({
          message: response.error || "Error al eliminar marca",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ message: "Error al eliminar marca", type: "error" });
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
  if (!marca)
    return (
      <div className="alert alert-warning">
        <FaExclamationCircle /> Marca no encontrada
      </div>
    );

  return (
    <div className="marca-detail-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          title="Eliminar Marca"
          message={`¿Estás seguro de eliminar la marca "${marca.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setShowConfirmDialog(false)}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>Detalle de Marca</h2>
          <p>Información completa de la marca</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/marcas" className="btn-secondary">
            <FaArrowLeft /> Volver
          </Link>
          <Link to={`/admin/marcas/${marca.id}/editar`} className="btn-primary">
            <FaEdit /> Editar
          </Link>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-title">
            <h3>{marca.nombre}</h3>
          </div>
          <div className="detail-id">ID: #{marca.id}</div>
        </div>

        <div className="detail-content">
          <div className="detail-row">
            <div className="detail-label">Nombre:</div>
            <div className="detail-value">{marca.nombre}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Descripción:</div>
            <div className="detail-value">
              {marca.descripcion || (
                <span className="text-muted">Sin descripción</span>
              )}
            </div>
          </div>

          {marca.created_at && (
            <div className="detail-row">
              <div className="detail-label">Fecha de Creación:</div>
              <div className="detail-value">
                {new Date(marca.created_at).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}

          {marca.updated_at && (
            <div className="detail-row">
              <div className="detail-label">Última Actualización:</div>
              <div className="detail-value">
                {new Date(marca.updated_at).toLocaleString("es-ES", {
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
            <FaTrash /> Eliminar Marca
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarcaDetail;
