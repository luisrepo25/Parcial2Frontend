import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { garantiaApi } from "../services/garantiaApi";
import type { Garantia } from "../types";
import {
  TableSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";

import {
  FaShieldAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";

const GarantiasList = () => {
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    garantiaId: number;
    garantiaInfo: string;
  }>({ show: false, garantiaId: 0, garantiaInfo: "" });

  const cargarGarantias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await garantiaApi.getGarantias();
      setGarantias(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar garantías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarGarantias();
  }, [cargarGarantias]);

  const handleEliminar = async (
    id: number,
    cobertura: number,
    marcaNombre: string
  ) => {
    setConfirmDialog({
      show: true,
      garantiaId: id,
      garantiaInfo: `${cobertura} meses - ${marcaNombre}`,
    });
  };

  const confirmarEliminacion = async () => {
    const { garantiaId } = confirmDialog;
    setConfirmDialog({ show: false, garantiaId: 0, garantiaInfo: "" });

    try {
      const response = await garantiaApi.deleteGarantia(garantiaId);
      if (response.success) {
        setGarantias((prev) =>
          prev.filter((garantia) => garantia.id !== garantiaId)
        );
        setToast({
          message: "Garantía eliminada exitosamente",
          type: "success",
        });
      } else {
        setToast({
          message: response.error || "Error al eliminar garantía",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al eliminar garantía", type: "error" });
    }
  };

  const cancelarEliminacion = () => {
    setConfirmDialog({ show: false, garantiaId: 0, garantiaInfo: "" });
  };

  if (loading) return <TableSkeleton rows={5} columns={5} />;
  if (error)
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle className="icon-alert" /> {error}
      </div>
    );

  return (
    <div className="garantias-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Eliminar Garantía"
          message={`¿Estás seguro de eliminar la garantía "${confirmDialog.garantiaInfo}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={cancelarEliminacion}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>Gestión de Garantías</h2>
          <p>Administra las garantías por marca del sistema</p>
        </div>
        <Link to="/admin/garantias/nuevo" className="btn-primary">
          <FaPlus /> Nueva Garantía
        </Link>
      </div>

      {garantias.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaShieldAlt size={48} />
          </div>
          <h3>No hay garantías registradas</h3>
          <p>Comienza creando tu primera garantía</p>
          <Link to="/admin/garantias/nuevo" className="btn-primary">
            <FaPlus /> Crear Garantía
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cobertura</th>
                <th>Marca</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {garantias.map((garantia) => (
                <tr key={garantia.id}>
                  <td>#{garantia.id}</td>
                  <td>
                    <strong>{garantia.cobertura} meses</strong>
                  </td>
                  <td>{garantia.marca.nombre}</td>
                  <td>
                    {garantia.created_at
                      ? new Date(garantia.created_at).toLocaleDateString(
                          "es-ES"
                        )
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/garantias/${garantia.id}`}
                        className="btn-secondary btn-sm"
                        title="Ver detalles"
                      >
                        <FaEye /> Ver
                      </Link>
                      <Link
                        to={`/admin/garantias/${garantia.id}/editar`}
                        className="btn-primary btn-sm"
                        title="Editar"
                      >
                        <FaEdit /> Editar
                      </Link>
                      <button
                        onClick={() =>
                          handleEliminar(
                            garantia.id,
                            garantia.cobertura,
                            garantia.marca.nombre
                          )
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

export default GarantiasList;
