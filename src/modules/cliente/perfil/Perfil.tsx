import { FaUser, FaEnvelope, FaCalendar } from "react-icons/fa";
import { authApi } from "../../auth/services/authapi";

const Perfil = () => {
  const user = authApi.getUser();

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>
            <FaUser /> Mi Perfil
          </h2>
          <p>Información de tu cuenta</p>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h3>Datos del Usuario</h3>
          <span className="badge badge-success">Activo</span>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h4>Información Personal</h4>

            <div className="detail-row">
              <span className="detail-label">
                <FaUser /> ID de Usuario:
              </span>
              <span className="detail-value">#{user?.id || "N/A"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <FaEnvelope /> Correo Electrónico:
              </span>
              <span className="detail-value">{user?.correo || "N/A"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <FaUser /> Tipo de Cuenta:
              </span>
              <span className="detail-value">
                {user?.administrador ? "Administrador" : "Cliente"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Información de Sesión</h4>

            <div className="detail-row">
              <span className="detail-label">
                <FaCalendar /> Estado de la Sesión:
              </span>
              <span className="detail-value">
                <span className="badge badge-success">Activa</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
