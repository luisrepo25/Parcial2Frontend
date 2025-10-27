import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FaPlus,
  FaUsers,
  FaUser,
  FaUserShield,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaInbox,
} from "react-icons/fa";
import usersApi from "../services/usersApi";
import type { UsuarioListItem } from "../types";
import { TableSkeleton } from "../../../../shared/components";

/**
 * Componente para listar todos los usuarios (clientes y admins)
 */
const UsersList = () => {
  const [usuarios, setUsuarios] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "cliente" | "admin">("todos");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.getUsers();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number, tipo: "cliente" | "admin") => {
    if (!confirm(`¿Estás seguro de eliminar este ${tipo}?`)) {
      return;
    }

    const response = await usersApi.deleteUser(id, tipo);
    if (response.success) {
      alert(response.message);
      cargarUsuarios();
    } else {
      alert(response.error || "Error al eliminar el usuario");
    }
  };

  const usuariosFiltrados =
    filtro === "todos" ? usuarios : usuarios.filter((u) => u.tipo === filtro);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">
          <FaExclamationCircle />
          <div className="alert-content">
            <div className="alert-title">Error al cargar usuarios</div>
            <p>{error}</p>
          </div>
        </div>
        <button onClick={cargarUsuarios} className="btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <FaUsers /> Gestión de Usuarios
          </h1>
          <p className="page-subtitle">
            Administra clientes y administradores del sistema
          </p>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn-primary">
          <FaPlus />
          Nuevo Usuario
        </Link>
      </div>

      <div className="filters-container">
        <div className="filter-buttons-group">
          <button
            className={`filter-button ${filtro === "todos" ? "active" : ""}`}
            onClick={() => setFiltro("todos")}
          >
            <FaUsers />
            Todos ({usuarios.length})
          </button>
          <button
            className={`filter-button ${filtro === "cliente" ? "active" : ""}`}
            onClick={() => setFiltro("cliente")}
          >
            <FaUser />
            Clientes ({usuarios.filter((u) => u.tipo === "cliente").length})
          </button>
          <button
            className={`filter-button ${filtro === "admin" ? "active" : ""}`}
            onClick={() => setFiltro("admin")}
          >
            <FaUserShield />
            Admins ({usuarios.filter((u) => u.tipo === "admin").length})
          </button>
        </div>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <div className="empty-state">
          <FaInbox className="empty-state-icon" />
          <h3>No hay usuarios para mostrar</h3>
          <p>Comienza creando un nuevo usuario</p>
          <Link to="/admin/usuarios/nuevo" className="btn-primary">
            <FaPlus />
            Crear Usuario
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>#{usuario.id}</td>
                  <td>
                    <span
                      className={`badge ${
                        usuario.tipo === "cliente"
                          ? "badge-primary"
                          : "badge-warning"
                      }`}
                    >
                      {usuario.tipo === "cliente" ? (
                        <>
                          <FaUser /> Cliente
                        </>
                      ) : (
                        <>
                          <FaUserShield /> Admin
                        </>
                      )}
                    </span>
                  </td>
                  <td>{usuario.nombreCompleto}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    {usuario.created_at
                      ? formatearFecha(usuario.created_at)
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/usuarios/${usuario.id}?tipo=${usuario.tipo}`}
                        className="btn-secondary btn-sm"
                        title="Ver detalles"
                      >
                        <FaEye /> Ver
                      </Link>
                      <Link
                        to={`/admin/usuarios/${usuario.id}/editar?tipo=${usuario.tipo}`}
                        className="btn-primary btn-sm"
                        title="Editar"
                      >
                        <FaEdit /> Editar
                      </Link>
                      <button
                        onClick={() => handleEliminar(usuario.id, usuario.tipo)}
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

export default UsersList;
