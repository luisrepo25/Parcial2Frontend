import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { FaUser, FaUserShield, FaSave } from "react-icons/fa";
import { clienteApi } from "../services/clienteApi";
import { adminApi } from "../services/adminApi";
import type { ClienteFormData, AdministradorFormData } from "../types";
import { FormSkeleton } from "../../../../shared/components";

/**
 * Componente para crear/editar usuarios (clientes o admins)
 */
const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") as "cliente" | "admin" | null;
  const isEditMode = Boolean(id);

  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "admin">(
    tipo || "cliente"
  );
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  // Datos del formulario de cliente
  const [clienteData, setClienteData] = useState<ClienteFormData>({
    correo: "",
    password: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    telefono: "",
  });

  // Datos del formulario de admin
  const [adminData, setAdminData] = useState<AdministradorFormData>({
    correo: "",
    password: "",
    nombre: "",
  });

  useEffect(() => {
    if (isEditMode && id && tipo) {
      cargarDatos(parseInt(id), tipo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, tipo]);

  const cargarDatos = async (userId: number, userTipo: "cliente" | "admin") => {
    try {
      setLoadingData(true);
      setTipoUsuario(userTipo);

      // Cargar según el tipo especificado
      if (userTipo === "cliente") {
        const clienteResponse = await clienteApi.getCliente(userId);
        if (clienteResponse.success && clienteResponse.data) {
          const cliente = clienteResponse.data;
          setClienteData({
            correo: cliente.correo,
            password: "", // No mostramos la contraseña
            nombres: cliente.nombres,
            apellidoPaterno: cliente.apellidoPaterno,
            apellidoMaterno: cliente.apellidoMaterno,
            ci: cliente.ci,
            telefono: cliente.telefono,
          });
        } else {
          alert("Cliente no encontrado");
          navigate("/admin/usuarios");
        }
      } else {
        // Cargar admin
        const adminResponse = await adminApi.getAdmin(userId);
        if (adminResponse.success && adminResponse.data) {
          const admin = adminResponse.data;
          setAdminData({
            correo: admin.correo,
            password: "", // No mostramos la contraseña
            nombre: admin.nombre || "",
          });
        } else {
          alert("Administrador no encontrado");
          navigate("/admin/usuarios");
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos del usuario");
    } finally {
      setLoadingData(false);
    }
  };

  const handleClienteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClienteData({
      ...clienteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tipoUsuario === "cliente") {
        // Validar datos de cliente
        if (
          !clienteData.correo ||
          !clienteData.nombres ||
          !clienteData.apellidoPaterno ||
          !clienteData.apellidoMaterno ||
          !clienteData.ci ||
          !clienteData.telefono
        ) {
          alert("Por favor completa todos los campos obligatorios");
          setLoading(false);
          return;
        }

        if (!isEditMode && !clienteData.password) {
          alert("La contraseña es obligatoria al crear un cliente");
          setLoading(false);
          return;
        }

        let response;
        if (isEditMode && id) {
          // Actualizar cliente (no enviar password si está vacío)
          const updateData = clienteData.password
            ? clienteData
            : { ...clienteData, password: undefined };
          response = await clienteApi.updateCliente(
            parseInt(id),
            updateData as Partial<ClienteFormData>
          );
        } else {
          // Crear cliente
          response = await clienteApi.createCliente(clienteData);
        }

        if (response.success) {
          alert(response.message);
          navigate("/admin/usuarios");
        } else {
          alert(response.error || "Error al guardar el cliente");
        }
      } else {
        // Validar datos de admin
        if (!adminData.correo || !adminData.nombre) {
          alert("Por favor completa todos los campos obligatorios");
          setLoading(false);
          return;
        }

        if (!isEditMode && !adminData.password) {
          alert("La contraseña es obligatoria al crear un administrador");
          setLoading(false);
          return;
        }

        let response;
        if (isEditMode && id) {
          // Actualizar admin (no enviar password si está vacío)
          const updateData = adminData.password
            ? adminData
            : { ...adminData, password: undefined };
          response = await adminApi.updateAdmin(
            parseInt(id),
            updateData as Partial<AdministradorFormData>
          );
        } else {
          // Crear admin
          response = await adminApi.createAdmin(adminData);
        }

        if (response.success) {
          alert(response.message);
          navigate("/admin/usuarios");
        } else {
          alert(response.error || "Error al guardar el administrador");
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="page-container">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          {tipoUsuario === "admin" ? <FaUserShield /> : <FaUser />}
          {isEditMode ? "Editar Usuario" : "Nuevo Usuario"}
        </h1>
        <p className="page-subtitle">
          {isEditMode
            ? "Actualiza la información del usuario"
            : "Completa los datos para crear un nuevo usuario"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* Selector de tipo de usuario (solo en modo creación) */}
        {!isEditMode && (
          <div className="form-section">
            <h3 className="section-title">Tipo de Usuario</h3>
            <div className="user-type-selector">
              <button
                type="button"
                className={`type-option ${
                  tipoUsuario === "cliente" ? "active" : ""
                }`}
                onClick={() => setTipoUsuario("cliente")}
              >
                <FaUser className="type-icon" />
                <div className="type-info">
                  <span className="type-title">Cliente</span>
                  <p className="type-description">
                    Usuario con acceso a la tienda
                  </p>
                </div>
              </button>
              <button
                type="button"
                className={`type-option ${
                  tipoUsuario === "admin" ? "active" : ""
                }`}
                onClick={() => setTipoUsuario("admin")}
              >
                <FaUserShield className="type-icon" />
                <div className="type-info">
                  <span className="type-title">Administrador</span>
                  <p className="type-description">
                    Usuario con acceso al panel de administración
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Formulario dinámico según el tipo */}
        {tipoUsuario === "cliente" ? (
          <>
            <div className="form-section">
              <h3 className="section-title">Información de Acceso</h3>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="correo">
                    Correo Electrónico <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={clienteData.correo}
                    onChange={handleClienteChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="password">
                    Contraseña{" "}
                    {!isEditMode && <span className="required">*</span>}
                    {isEditMode && (
                      <span className="text-muted">
                        (dejar vacío para no cambiar)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={clienteData.password}
                    onChange={handleClienteChange}
                    required={!isEditMode}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Información Personal</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombres">
                    Nombres <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={clienteData.nombres}
                    onChange={handleClienteChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidoPaterno">
                    Apellido Paterno <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="apellidoPaterno"
                    name="apellidoPaterno"
                    value={clienteData.apellidoPaterno}
                    onChange={handleClienteChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidoMaterno">
                    Apellido Materno <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    value={clienteData.apellidoMaterno}
                    onChange={handleClienteChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ci">
                    CI <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="ci"
                    name="ci"
                    value={clienteData.ci}
                    onChange={handleClienteChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">
                    Teléfono <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={clienteData.telefono}
                    onChange={handleClienteChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-section">
              <h3 className="section-title">Información del Administrador</h3>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="correo">
                    Correo Electrónico <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={adminData.correo}
                    onChange={handleAdminChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="password">
                    Contraseña{" "}
                    {!isEditMode && <span className="required">*</span>}
                    {isEditMode && (
                      <span className="text-muted">
                        (dejar vacío para no cambiar)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={adminData.password}
                    onChange={handleAdminChange}
                    required={!isEditMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="nombre">
                    Nombre Completo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={adminData.nombre}
                    onChange={handleAdminChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/admin/usuarios")}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Guardando...
              </>
            ) : (
              <>
                <FaSave />
                {isEditMode ? "Actualizar" : "Crear"} Usuario
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
