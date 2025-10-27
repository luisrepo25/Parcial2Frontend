/**
 * ========================================
 * PLANTILLA DE PÁGINA - LISTA
 * ========================================
 * Copiar y adaptar para nuevas páginas de listado
 */

import React, { useState } from "react";
import {
  MdAdd, // Icono de agregar
  MdEdit, // Icono de editar
  MdDelete, // Icono de eliminar
  MdSearch, // Icono de búsqueda
  MdFilterList, // Icono de filtros
  // Cambia este icono según tu módulo:
  MdInventory, // Icono del módulo
} from "react-icons/md";
import { BsEye } from "react-icons/bs";

// Cambiar el nombre de la interfaz según tu entidad
interface MiEntidad {
  id: number;
  nombre: string;
  // Agregar más campos según necesites
}

export const MiEntidadList: React.FC = () => {
  const [items] = useState<MiEntidad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="page-container fade-in">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <MdInventory />
            Gestión de MiEntidad
          </h1>
          <p className="page-subtitle">
            Administra todos los registros de MiEntidad
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary">
            <MdAdd />
            Nuevo
          </button>
        </div>
      </div>

      {/* ========== FILTROS (Opcional) ========== */}
      <div className="page-filters">
        <div className="filters-row">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Filtro 1</label>
            <select>
              <option value="">Todos</option>
              <option value="1">Opción 1</option>
              <option value="2">Opción 2</option>
            </select>
          </div>

          <button className="btn-secondary">
            <MdFilterList />
            Aplicar
          </button>
        </div>
      </div>

      {/* ========== TABLA ========== */}
      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              {/* Agregar más columnas */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <MdInventory />
                    </div>
                    <h3 className="empty-state-title">No hay registros</h3>
                    <p className="empty-state-description">
                      Comienza agregando tu primer registro
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-button view" title="Ver">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * ========================================
 * PLANTILLA DE PÁGINA - FORMULARIO
 * ========================================
 * Copiar y adaptar para nuevas páginas de formulario
 */

export const MiEntidadForm: React.FC = () => {
  return (
    <div className="page-container fade-in">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <MdAdd />
            Nuevo Registro
          </h1>
          <p className="page-subtitle">
            Complete el formulario para crear un nuevo registro
          </p>
        </div>
      </div>

      {/* ========== FORMULARIO ========== */}
      <form className="form-card">
        {/* Fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label>
              Campo 1 <span className="required">*</span>
            </label>
            <input type="text" placeholder="Ingrese el valor" />
          </div>

          <div className="form-group">
            <label>
              Campo 2 <span className="required">*</span>
            </label>
            <input type="text" placeholder="Ingrese el valor" />
          </div>
        </div>

        {/* Campo de área de texto */}
        <div className="form-group">
          <label>Descripción</label>
          <textarea rows={4} placeholder="Descripción opcional" />
        </div>

        {/* Campo de selección */}
        <div className="form-group">
          <label>
            Categoría <span className="required">*</span>
          </label>
          <select>
            <option value="">Seleccione una opción</option>
            <option value="1">Opción 1</option>
            <option value="2">Opción 2</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="button" className="btn-secondary">
            <MdDelete />
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <MdAdd />
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * ========================================
 * PLANTILLA DE PÁGINA - DETALLE
 * ========================================
 * Copiar y adaptar para páginas de detalle/vista
 */

export const MiEntidadDetail: React.FC = () => {
  return (
    <div className="page-container fade-in">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <MdInventory />
            Detalle del Registro
          </h1>
          <p className="page-subtitle">Información completa del registro</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary">Volver</button>
          <button className="btn-warning">
            <MdEdit />
            Editar
          </button>
          <button className="btn-danger">
            <MdDelete />
            Eliminar
          </button>
        </div>
      </div>

      {/* ========== CONTENIDO EN GRID ========== */}
      <div className="content-grid content-grid-2">
        {/* Tarjeta 1 */}
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">
              <MdInventory />
              Información General
            </h3>
          </div>
          <div className="content-card-body">
            <div style={{ marginBottom: "16px" }}>
              <strong style={{ color: "var(--text-secondary)" }}>
                Campo 1:
              </strong>
              <p style={{ margin: "4px 0 0 0" }}>Valor 1</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong style={{ color: "var(--text-secondary)" }}>
                Campo 2:
              </strong>
              <p style={{ margin: "4px 0 0 0" }}>Valor 2</p>
            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">
              <MdInventory />
              Información Adicional
            </h3>
          </div>
          <div className="content-card-body">
            <div style={{ marginBottom: "16px" }}>
              <strong style={{ color: "var(--text-secondary)" }}>
                Estado:
              </strong>
              <p style={{ margin: "4px 0 0 0" }}>
                <span className="badge badge-success">Activo</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ========================================
 * NOTAS DE USO
 * ========================================
 *
 * 1. Copiar la plantilla que necesites (Lista, Formulario o Detalle)
 * 2. Renombrar "MiEntidad" por el nombre de tu entidad
 * 3. Cambiar el icono de "MdInventory" por el apropiado
 * 4. Agregar/quitar campos según necesites
 * 5. Implementar la lógica (estados, funciones, API calls)
 *
 * ICONOS COMUNES:
 * - MdInventory: Productos, inventario
 * - MdCategory: Categorías
 * - MdBusiness: Empresas, marcas
 * - MdPerson: Usuarios, clientes
 * - MdShoppingCart: Carrito, ventas
 * - MdLocalOffer: Ofertas, garantías
 * - MdDashboard: Dashboard
 * - MdSettings: Configuración
 *
 * CLASES PRINCIPALES:
 * - page-container: Contenedor principal
 * - page-header: Encabezado
 * - page-filters: Filtros
 * - table-container: Tabla
 * - form-card: Formulario
 * - content-card: Tarjeta de contenido
 * - content-grid: Grid de tarjetas
 *
 * BOTONES:
 * - btn-primary: Acción principal
 * - btn-secondary: Acción secundaria
 * - btn-success: Confirmar
 * - btn-warning: Advertencia
 * - btn-danger: Eliminar
 *
 * BADGES:
 * - badge-success: Verde (activo, confirmado)
 * - badge-danger: Rojo (inactivo, error)
 * - badge-warning: Naranja (pendiente, advertencia)
 * - badge-info: Azul (información)
 */

export default {
  MiEntidadList,
  MiEntidadForm,
  MiEntidadDetail,
};
