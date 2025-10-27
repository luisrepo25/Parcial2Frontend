/**
 * EJEMPLO DE PÁGINA MIGRADA AL NUEVO SISTEMA DE ESTILOS
 *
 * Esta página demuestra:
 * - Uso de clases globales en lugar de CSS individuales
 * - Integración de React Icons
 * - Estructura semántica
 * - Variables CSS
 */

import React, { useState } from "react";
import {
  MdInventory,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdFilterList,
  MdCheck,
  MdClose,
} from "react-icons/md";
import { BsEye } from "react-icons/bs";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  activo: boolean;
}

export const ProductosListExample: React.FC = () => {
  const [productos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Laptop HP Pavilion",
      categoria: "Electrónica",
      precio: 899.99,
      stock: 15,
      activo: true,
    },
    {
      id: 2,
      nombre: "Mouse Logitech MX",
      categoria: "Accesorios",
      precio: 79.99,
      stock: 50,
      activo: true,
    },
    {
      id: 3,
      nombre: "Teclado Mecánico",
      categoria: "Accesorios",
      precio: 149.99,
      stock: 0,
      activo: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="page-container fade-in">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <MdInventory />
            Gestión de Productos
          </h1>
          <p className="page-subtitle">
            Administra todos los productos del sistema
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary">
            <MdFilterList />
            Filtros
          </button>
          <button className="btn-primary">
            <MdAdd />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* ========== ESTADÍSTICAS ========== */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Productos</span>
            <div className="stat-card-icon primary">
              <MdInventory />
            </div>
          </div>
          <div className="stat-card-value">{productos.length}</div>
          <div className="stat-card-change positive">
            <MdCheck />
            100% Registrados
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Productos Activos</span>
            <div className="stat-card-icon success">
              <MdCheck />
            </div>
          </div>
          <div className="stat-card-value">
            {productos.filter((p) => p.activo).length}
          </div>
          <div className="stat-card-change positive">
            <MdCheck />
            Disponibles
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Sin Stock</span>
            <div className="stat-card-icon danger">
              <MdClose />
            </div>
          </div>
          <div className="stat-card-value">
            {productos.filter((p) => p.stock === 0).length}
          </div>
          <div className="stat-card-change negative">
            <MdClose />
            Requieren atención
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Valor Total</span>
            <div className="stat-card-icon warning">
              <MdInventory />
            </div>
          </div>
          <div className="stat-card-value">
            $
            {productos
              .reduce((acc, p) => acc + p.precio * p.stock, 0)
              .toFixed(2)}
          </div>
        </div>
      </div>

      {/* ========== FILTROS Y BÚSQUEDA ========== */}
      <div className="page-filters">
        <div className="filters-row">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Categoría</label>
            <select>
              <option value="">Todas las categorías</option>
              <option value="electronica">Electrónica</option>
              <option value="accesorios">Accesorios</option>
              <option value="ropa">Ropa</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Estado</label>
            <select>
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <button className="btn-secondary">
            <MdFilterList />
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* ========== TABLA DE PRODUCTOS ========== */}
      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos
              .filter((p) =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>
                    <strong>{producto.nombre}</strong>
                  </td>
                  <td>{producto.categoria}</td>
                  <td className="font-semibold text-primary">
                    ${producto.precio.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={
                        producto.stock === 0 ? "text-danger font-semibold" : ""
                      }
                    >
                      {producto.stock} unidades
                    </span>
                  </td>
                  <td>
                    {producto.activo ? (
                      <span className="badge badge-success">
                        <MdCheck />
                        Activo
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <MdClose />
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action-button view"
                        title="Ver detalles"
                      >
                        <BsEye />
                      </button>
                      <button
                        className="table-action-button edit"
                        title="Editar"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="table-action-button delete"
                        title="Eliminar"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINACIÓN (Ejemplo) ========== */}
      <div className="page-pagination">
        <button className="pagination-button" disabled>
          Anterior
        </button>
        <button className="pagination-button active">1</button>
        <button className="pagination-button">2</button>
        <button className="pagination-button">3</button>
        <span className="pagination-info">Página 1 de 3</span>
        <button className="pagination-button">Siguiente</button>
      </div>

      {/* ========== ESTADO VACÍO (Condicional) ========== */}
      {productos.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <MdInventory />
          </div>
          <h3 className="empty-state-title">No hay productos</h3>
          <p className="empty-state-description">
            Comienza agregando tu primer producto al sistema
          </p>
          <button className="btn-primary">
            <MdAdd />
            Agregar Primer Producto
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * NOTAS DE MIGRACIÓN:
 *
 * 1. ✅ NO se importa ningún archivo CSS
 * 2. ✅ Se usan clases globales del sistema centralizado
 * 3. ✅ Se integran React Icons de forma consistente
 * 4. ✅ Se usan variables CSS implícitamente a través de las clases
 * 5. ✅ Estructura semántica y accesible
 * 6. ✅ Responsive por defecto
 * 7. ✅ Animaciones incluidas (fade-in)
 *
 * CLASES PRINCIPALES USADAS:
 * - page-container: Contenedor principal
 * - page-header: Encabezado con título y acciones
 * - stats-grid: Grid de estadísticas
 * - page-filters: Sección de filtros
 * - table-container: Contenedor de tabla
 * - table-modern: Tabla con estilos modernos
 * - badge-*: Badges de estado
 * - btn-*: Botones con variantes
 * - table-actions: Acciones de tabla
 * - page-pagination: Paginación
 * - empty-state: Estado vacío
 *
 * REACT ICONS USADOS:
 * - Material Design (md): MdInventory, MdAdd, MdEdit, etc.
 * - Bootstrap (bs): BsEye
 */

export default ProductosListExample;
