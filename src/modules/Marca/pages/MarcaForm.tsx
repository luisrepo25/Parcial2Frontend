import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { marcaApi } from "../services/marcaApi";
import type { MarcaFormData } from "../types";
import { FormSkeleton, Toast } from "../../../shared/components";
import type { ToastType } from "../../../shared/components/Toast";
import { FaSave, FaTimes } from "react-icons/fa";
import "../../../shared/styles/components.css";
import "./MarcaForm.css";

const MarcaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<MarcaFormData>({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    if (id) {
      cargarMarca(Number(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarMarca = async (marcaId: number) => {
    try {
      setLoadingData(true);
      const marca = await marcaApi.getMarca(marcaId);
      setFormData({
        nombre: marca.nombre,
        descripcion: marca.descripcion || "",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al cargar la marca", type: "error" });
      setTimeout(() => navigate("/marcas"), 2000);
    } finally {
      setLoadingData(false);
    }
  };

  const validarFormulario = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      if (isEdit && id) {
        const response = await marcaApi.updateMarca(Number(id), formData);
        if (response.success) {
          setToast({
            message: "Marca actualizada exitosamente",
            type: "success",
          });
          setTimeout(() => navigate("/marcas"), 1500);
        } else {
          setToast({
            message: response.error || "Error al actualizar marca",
            type: "error",
          });
        }
      } else {
        const response = await marcaApi.createMarca(formData);
        if (response.success) {
          setToast({
            message: "Marca creada exitosamente",
            type: "success",
          });
          setTimeout(() => navigate("/marcas"), 1500);
        } else {
          setToast({
            message: response.error || "Error al crear marca",
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al guardar la marca", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (loadingData) return <FormSkeleton />;

  return (
    <div className="marca-form-page fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h2>{isEdit ? "Editar Marca" : "Nueva Marca"}</h2>
          <p>
            {isEdit
              ? "Modifica los datos de la marca"
              : "Completa el formulario para crear una nueva marca"}
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Samsung"
              className={errors.nombre ? "input-error" : ""}
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la marca"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <Link to="/marcas" className="btn-secondary">
              <FaTimes /> Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : (
                <>
                  <FaSave /> {isEdit ? "Actualizar" : "Crear Marca"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarcaForm;
