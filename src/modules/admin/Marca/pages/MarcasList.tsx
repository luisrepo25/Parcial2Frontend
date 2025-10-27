import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { marcaApi } from "../services/marcaApi";
import type { Marca } from "../types";
import {
  TableSkeleton,
  Toast,
  ConfirmDialog,
} from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";

import {
  FaTags,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";

const MarcasList = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    marcaId: number;
    marcaNombre: string;
  }>({ show: false, marcaId: 0, marcaNombre: "" });

  const cargarMarcas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await marcaApi.getMarcas();
      setMarcas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar marcas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarMarcas();
  }, [cargarMarcas]);

  const handleEliminar = async (id: number, nombre: string) => {
    setConfirmDialog({ show: true, marcaId: id, marcaNombre: nombre });
  };

  const confirmarEliminacion = async () => {
    const { marcaId } = confirmDialog;
    setConfirmDialog({ show: false, marcaId: 0, marcaNombre: "" });

    try {
      const response = await marcaApi.deleteMarca(marcaId);
      if (response.success) {
        setMarcas((prev) => prev.filter((marca) => marca.id !== marcaId));
        setToast({
          message: "Marca eliminada exitosamente",
          type: "success",
        });
      } else {
        setToast({
          message: response.error || "Error al eliminar marca",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al eliminar marca", type: "error" });
    }
  };

  const cancelarEliminacion = () => {
    setConfirmDialog({ show: false, marcaId: 0, marcaNombre: "" });
  };

  if (loading) return <TableSkeleton rows={5} columns={5} />;
  if (error)
    return (
      <div className="alert alert-danger">
        <FaExclamationCircle className="icon-alert" /> {error}
      </div>
    );

  return (
    <div className="marcas-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Eliminar Marca"
          message={`¿Estás seguro de eliminar la marca "${confirmDialog.marcaNombre}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmarEliminacion}
          onCancel={cancelarEliminacion}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <div className="page-header">
        <div>
          <h2>Gestión de Marcas</h2>
          <p>Administra las marcas de productos del sistema</p>
        </div>
        <Link to="/admin/marcas/nuevo" className="btn-primary">
          <FaPlus /> Nueva Marca
        </Link>
      </div>

      {marcas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaTags size={48} />
          </div>
          <h3>No hay marcas registradas</h3>
          <p>Comienza creando tu primera marca</p>
          <Link to="/admin/marcas/nuevo" className="btn-primary">
            <FaPlus /> Crear Marca
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
              {marcas.map((marca) => (
                <tr key={marca.id}>
                  <td>#{marca.id}</td>
                  <td>
                    <strong>{marca.nombre}</strong>
                  </td>
                  <td>{marca.descripcion || "-"}</td>
                  <td>
                    {marca.created_at
                      ? new Date(marca.created_at).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/marcas/${marca.id}`}
                        className="btn-secondary btn-sm"
                        title="Ver detalles"
                      >
                        <FaEye /> Ver
                      </Link>
                      <Link
                        to={`/admin/marcas/${marca.id}/editar`}
                        className="btn-primary btn-sm"
                        title="Editar"
                      >
                        <FaEdit /> Editar
                      </Link>
                      <button
                        onClick={() => handleEliminar(marca.id, marca.nombre)}
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

export default MarcasList;
