// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authapi";
import type { LoginCredentials } from "../types";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    correo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.correo.trim()) {
      setError("El correo es obligatorio");
      return;
    }
    if (!formData.password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      setError("El correo no es válido");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login(formData);
      if (response.ok && response.usuario) {
        navigate("/");
        window.location.reload();
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape shape-1" />
        <div className="login-shape shape-2" />
        <div className="login-shape shape-3" />
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">S</div>
          </div>
          <h1>SmartSales</h1>
          <p>Sistema de Ventas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="login-alert login-alert-error" role="alert">
              <FaExclamationTriangle className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                disabled={loading}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <small>Demo: admin@gmail.com / 123456</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
