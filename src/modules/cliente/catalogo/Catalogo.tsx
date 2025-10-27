import { useState, useEffect } from "react";
import { productoApi } from "../../admin/productos/services/productoApi";
import type { Producto } from "../../admin/productos/types";
import { FaShoppingCart, FaImage, FaCheck } from "react-icons/fa";
import { useCarrito } from "../../../shared/contexts/CarritoContext";

const Catalogo = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());
  const { addToCart } = useCarrito();

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productoApi.getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  // Agregar producto al carrito
  const handleAddToCart = (producto: Producto) => {
    addToCart(producto);
    setAddedProducts((prev) => new Set(prev).add(producto.id));

    // Remover animación después de 2 segundos
    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(producto.id);
        return newSet;
      });
    }, 2000);
  };

  // Determinar badge del producto (simulado)
  const getProductoBadge = (index: number) => {
    if (index % 3 === 0) return { text: "Nuevo", class: "badge-nuevo" };
    if (index % 3 === 1) return { text: "Popular", class: "badge-popular" };
    return null;
  };

  if (loading) {
    return (
      <div className="catalogo-loading">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="catalogo-page">
      {/* Hero Section */}
      <div className="catalogo-hero">
        <h1 className="catalogo-title">Catálogo de Productos</h1>
        <p className="catalogo-subtitle">
          Descubre nuestra selección exclusiva de productos premium
        </p>
      </div>

      {/* Grid de Productos */}
      <div className="catalogo-grid">
        {productos.map((producto, index) => {
          const badge = getProductoBadge(index);

          return (
            <div key={producto.id} className="catalogo-card">
              {/* Badge superior izquierdo */}
              {badge && (
                <span className={`catalogo-badge ${badge.class}`}>
                  {badge.text}
                </span>
              )}

              {/* Imagen del Producto */}
              <div className="catalogo-card-image">
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre} />
                ) : (
                  <div className="catalogo-no-image">
                    <FaImage />
                  </div>
                )}
              </div>

              {/* Información del Producto */}
              <div className="catalogo-card-content">
                <p className="catalogo-card-category">
                  {producto.categoria.nombre}
                </p>
                <h3 className="catalogo-card-title">{producto.nombre}</h3>
                <p className="catalogo-card-price">
                  {formatPrice(producto.precio)}
                </p>

                {/* Botón Agregar al Carrito */}
                <button
                  className={`catalogo-add-btn ${
                    addedProducts.has(producto.id) ? "btn-added" : ""
                  }`}
                  onClick={() => handleAddToCart(producto)}
                  disabled={producto.stock === 0}
                >
                  {addedProducts.has(producto.id) ? (
                    <>
                      <FaCheck />
                      <span>¡Agregado!</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart />
                      <span>
                        {producto.stock === 0
                          ? "Agotado"
                          : "Agregar al Carrito"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {productos.length === 0 && (
        <div className="catalogo-empty">
          <p>No hay productos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
