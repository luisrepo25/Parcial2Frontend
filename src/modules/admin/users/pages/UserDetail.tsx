import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import {
  FaEdit,
  FaUser,
  FaUserShield,
  FaEnvelope,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { clienteApi } from "../services/clienteApi";
import { adminApi } from "../services/adminApi";
import type { UsuarioCompleto } from "../types";
import { DetailSkeleton } from "../../../../shared/components";

/**
 * Componente para ver los detalles de un usuario
 */
const UserDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") as "cliente" | "admin" | null;
  const [usuario, setUsuario] = useState<UsuarioCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && tipo) {
      cargarUsuario(parseInt(id), tipo);
    }
  }, [id, tipo]);

  const cargarUsuario = async (
    userId: number,
    userTipo: "cliente" | "admin"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Cargar según el tipo especificado
      if (userTipo === "cliente") {
        const clienteResponse = await clienteApi.getCliente(userId);
        if (clienteResponse.success && clienteResponse.data) {
          setUsuario(clienteResponse.data);
        } else {
          setError("Cliente no encontrado");
        }
      } else {
        const adminResponse = await adminApi.getAdmin(userId);
        if (adminResponse.success && adminResponse.data) {
          setUsuario(adminResponse.data);
        } else {
          setError("Administrador no encontrado");
        }
      }
    } catch (err) {
      console.error("Error al cargar usuario:", err);
      setError("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">
          <FaExclamationCircle />
          <div>
            <h4>Error</h4>
            <p>{error || "Usuario no encontrado"}</p>
            <Link to="/admin/usuarios" className="btn-primary">
              Volver a la lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCliente = usuario.tipo === "cliente";

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <Link to="/admin/usuarios" className="back-link">
            {isCliente ? <FaUser /> : <FaUserShield />}
          </Link>
          <div>
            <h1>Detalles del Usuario</h1>
            <p className="page-subtitle">ID: #{usuario.id}</p>
          </div>
        </div>
        <div className="page-actions">
          <Link
            to={`/admin/usuarios/${usuario.id}/editar?tipo=${usuario.tipo}`}
            className="btn-primary"
          >
            <FaEdit />
            Editar
          </Link>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-card">
          <div className="detail-header">
            <span
              className={`badge badge-${isCliente ? "primary" : "warning"}`}
            >
              {isCliente ? (
                <>
                  <FaUser /> Cliente
                </>
              ) : (
                <>
                  <FaUserShield /> Administrador
                </>
              )}
            </span>
          </div>

          <div className="detail-body">
            <div className="detail-section">
              <h3>
                <FaUser />
                Información Personal
              </h3>
              <div className="detail-grid">
                {isCliente ? (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">Nombres:</span>
                      <span className="detail-value">{usuario.nombres}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Apellido Paterno:</span>
                      <span className="detail-value">
                        {usuario.apellidoPaterno}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Apellido Materno:</span>
                      <span className="detail-value">
                        {usuario.apellidoMaterno}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">CI:</span>
                      <span className="detail-value">{usuario.ci}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{usuario.telefono}</span>
                    </div>
                  </>
                ) : (
                  <div className="detail-item full-width">
                    <span className="detail-label">Nombre:</span>
                    <span className="detail-value">
                      {usuario.nombre || "No especificado"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>
                <FaEnvelope />
                Información de Acceso
              </h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Correo Electrónico:</span>
                  <span className="detail-value">{usuario.correo}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>
                <FaClock />
                Información del Sistema
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Fecha de Registro:</span>
                  <span className="detail-value">
                    {usuario.created_at
                      ? formatearFecha(usuario.created_at)
                      : "-"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Última Actualización:</span>
                  <span className="detail-value">
                    {usuario.updated_at
                      ? formatearFecha(usuario.updated_at)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
