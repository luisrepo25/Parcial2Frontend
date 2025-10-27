import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { productoApi } from "../services/productoApi";
import { categoriaApi } from "../../../admin/categoria/services/categoriaApi";
import { marcaApi } from "../../Marca/services/marcaApi";
import { garantiaApi } from "../../../admin/garantia/services/garantiaApi";
import type { ProductoFormData } from "../types";
import type { Categoria } from "../../../admin/categoria/types";
import type { Marca } from "../../Marca/types";
import type { Garantia } from "../../garantia/types";
import { FormSkeleton, Toast } from "../../../../shared/components";
import type { ToastType } from "../../../../shared/components/Toast";

import { FaSave, FaTimes, FaBoxOpen, FaImage, FaTrash } from "react-icons/fa";

const ProductoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria_id: 0,
    marca_id: 0,
    garantia_id: 0,
    imagen: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    cargarDatosIniciales();
    if (isEditMode && id) {
      cargarProducto(parseInt(id));
    }
  }, [id, isEditMode]);

  const cargarDatosIniciales = async () => {
    try {
      const [categoriasData, marcasData, garantiasData] = await Promise.all([
        categoriaApi.getCategorias(),
        marcaApi.getMarcas(),
        garantiaApi.getGarantias(),
      ]);
      setCategorias(categoriasData);
      setMarcas(marcasData);
      setGarantias(garantiasData);
    } catch (err) {
      console.error("Error al cargar datos iniciales:", err);
      setToast({
        message: "Error al cargar datos del formulario",
        type: "error",
      });
    }
  };

  const cargarProducto = async (productoId: number) => {
    try {
      setLoadingData(true);
      const producto = await productoApi.getProducto(productoId);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria_id: producto.categoria.id,
        marca_id: producto.marca.id,
        garantia_id: producto.garantia?.id || 0,
        imagen: null,
      });

      // Establecer imagen actual si existe
      if (producto.imagen_url) {
        setImagenActual(producto.imagen_url);
      }
    } catch (err) {
      console.error("Error al cargar producto:", err);
      setToast({
        message: "Error al cargar producto",
        type: "error",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre || formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.descripcion || formData.descripcion.trim().length < 10) {
      newErrors.descripcion =
        "La descripción debe tener al menos 10 caracteres";
    }

    if (formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (formData.categoria_id === 0) {
      newErrors.categoria_id = "Debes seleccionar una categoría";
    }

    if (formData.marca_id === 0) {
      newErrors.marca_id = "Debes seleccionar una marca";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let finalValue: string | number = value;

    // Convertir a número si es un input de tipo número
    if (type === "number") {
      const numValue = parseFloat(value);
      finalValue = isNaN(numValue) ? 0 : numValue;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setToast({
          message: "Por favor selecciona un archivo de imagen válido",
          type: "error",
        });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({
          message: "La imagen no debe superar los 5MB",
          type: "error",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imagen: null,
    }));
    setImagenPreview(null);

    // Limpiar el input file
    const fileInput = document.getElementById("imagen") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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
      // Preparar datos para enviar
      const dataToSend: ProductoFormData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        categoria_id: Number(formData.categoria_id),
        marca_id: Number(formData.marca_id),
        garantia_id:
          formData.garantia_id === 0 ? undefined : Number(formData.garantia_id),
        imagen: formData.imagen,
      };

      let response;
      if (isEditMode && id) {
        response = await productoApi.updateProducto(parseInt(id), dataToSend);
      } else {
        response = await productoApi.createProducto(dataToSend);
      }

      if (response.success) {
        setToast({
          message: isEditMode
            ? "Producto actualizado exitosamente"
            : "Producto creado exitosamente",
          type: "success",
        });
        setTimeout(() => navigate("/admin/productos"), 1500);
      } else {
        setToast({
          message: response.error || "Error al guardar producto",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setToast({
        message: "Error al guardar producto",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <FormSkeleton />;

  return (
    <div className="producto-form-page fade-in">
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
            <FaBoxOpen /> {isEditMode ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <p>
            {isEditMode
              ? "Modifica los datos del producto"
              : "Completa el formulario para crear un nuevo producto"}
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
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
                className={errors.nombre ? "input-error" : ""}
                placeholder="Ej: Laptop HP Pavilion"
                required
              />
              {errors.nombre && (
                <span className="error-message">{errors.nombre}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="descripcion">
                Descripción <span className="required">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className={errors.descripcion ? "input-error" : ""}
                placeholder="Describe el producto..."
                rows={4}
                required
              />
              {errors.descripcion && (
                <span className="error-message">{errors.descripcion}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">
                Precio (USD) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={errors.precio ? "input-error" : ""}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              {errors.precio && (
                <span className="error-message">{errors.precio}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock <span className="required">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? "input-error" : ""}
                placeholder="0"
                min="0"
                required
              />
              {errors.stock && (
                <span className="error-message">{errors.stock}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria_id">
                Categoría <span className="required">*</span>
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className={errors.categoria_id ? "input-error" : ""}
                required
              >
                <option value={0}>Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <span className="error-message">{errors.categoria_id}</span>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="garantia_id">Garantía (Opcional)</label>
              <select
                id="garantia_id"
                name="garantia_id"
                value={formData.garantia_id}
                onChange={handleChange}
              >
                <option value={0}>Sin garantía</option>
                {garantias.map((garantia) => (
                  <option key={garantia.id} value={garantia.id}>
                    {garantia.cobertura} meses - {garantia.marca.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="imagen">
                <FaImage /> Imagen del Producto (Opcional)
              </label>

              {/* Mostrar imagen actual en modo edición */}
              {isEditMode && imagenActual && !imagenPreview && (
                <div className="image-preview-container">
                  <img
                    src={imagenActual}
                    alt="Imagen actual del producto"
                    className="product-image-preview"
                  />
                  <p className="image-info">Imagen actual del producto</p>
                </div>
              )}

              {/* Mostrar preview de nueva imagen */}
              {imagenPreview && (
                <div className="image-preview-container">
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="product-image-preview"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-remove-image"
                    title="Eliminar imagen"
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              )}

              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input-file"
              />
              <small className="form-help-text">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
              </small>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/productos" className="btn-secondary">
              <FaTimes /> Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : (
                <>
                  <FaSave /> {isEditMode ? "Actualizar" : "Crear"} Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;
