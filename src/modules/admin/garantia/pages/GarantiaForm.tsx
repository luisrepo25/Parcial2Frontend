import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { garantiaApi } from "../services/garantiaApi";
import { marcaApi } from "../../../admin/Marca/services/marcaApi";
import type { GarantiaFormData } from "../types";
import type { Marca } from "../../../admin/Marca/types";
import { FormSkeleton, Toast } from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";

import { FaSave, FaTimes, FaShieldAlt } from "react-icons/fa";

const GarantiaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [formData, setFormData] = useState<GarantiaFormData>({
    cobertura: 0,
    marca_id: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    cargarMarcas();
    if (isEditMode && id) {
      cargarGarantia(parseInt(id));
    }
  }, [id, isEditMode]);

  const cargarMarcas = async () => {
    try {
      const data = await marcaApi.getMarcas();
      setMarcas(data);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
      setToast({
        message: "Error al cargar marcas",
        type: "error",
      });
    }
  };

  const cargarGarantia = async (garantiaId: number) => {
    try {
      setLoadingData(true);
      const garantia = await garantiaApi.getGarantia(garantiaId);
      setFormData({
        cobertura: garantia.cobertura,
        marca_id: garantia.marca.id,
      });
    } catch (err) {
      console.error("Error al cargar garantía:", err);
      setToast({
        message: "Error al cargar garantía",
        type: "error",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.cobertura <= 0) {
      newErrors.cobertura = "La cobertura debe ser mayor a 0 meses";
    }

    if (formData.marca_id === 0) {
      newErrors.marca_id = "Debes seleccionar una marca";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));

    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        message: "Por favor, corrige los errores en el formulario",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isEditMode && id) {
        response = await garantiaApi.updateGarantia(parseInt(id), formData);
      } else {
        response = await garantiaApi.createGarantia(formData);
      }

      if (response.success) {
        setToast({
          message: isEditMode
            ? "Garantía actualizada exitosamente"
            : "Garantía creada exitosamente",
          type: "success",
        });
        setTimeout(() => navigate("/garantias"), 1500);
      } else {
        setToast({
          message: response.error || "Error al guardar garantía",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setToast({
        message: "Error al guardar garantía",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <FormSkeleton />;

  return (
    <div className="garantia-form-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h2>
            <FaShieldAlt /> {isEditMode ? "Editar Garantía" : "Nueva Garantía"}
          </h2>
          <p>
            {isEditMode
              ? "Modifica los datos de la garantía"
              : "Completa el formulario para crear una nueva garantía"}
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cobertura">
                Cobertura (meses) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="cobertura"
                name="cobertura"
                value={formData.cobertura}
                onChange={handleChange}
                className={errors.cobertura ? "input-error" : ""}
                placeholder="Ej: 12"
                min="1"
                required
              />
              {errors.cobertura && (
                <span className="error-message">{errors.cobertura}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="marca_id">
                Marca <span className="required">*</span>
              </label>
              <select
                id="marca_id"
                name="marca_id"
                value={formData.marca_id}
                onChange={handleChange}
                className={errors.marca_id ? "input-error" : ""}
                required
              >
                <option value={0}>Selecciona una marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
              {errors.marca_id && (
                <span className="error-message">{errors.marca_id}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/garantias" className="btn-secondary">
              <FaTimes /> Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : (
                <>
                  <FaSave /> {isEditMode ? "Actualizar" : "Crear"} Garantía
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GarantiaForm;
