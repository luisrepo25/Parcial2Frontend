import { useEffect, useState, useCallback } from "react";
import {
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaUndo,
  FaEye,
} from "react-icons/fa";
import { useVentas } from "../ventas/hooks/useVentas";
import type { NotaVenta, EstadoVenta } from "../ventas/types";
import { TableSkeleton } from "../../../shared/components";

const Ordenes = () => {
  const { loading, error, obtenerCompras } = useVentas();
  const [compras, setCompras] = useState<NotaVenta[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoVenta | "todas">(
    "todas"
  );
  const [estadisticas, setEstadisticas] = useState({
    total_compras: 0,
    compras_pagadas: 0,
    compras_pendientes: 0,
    total_gastado: 0,
  });

  const cargarCompras = useCallback(async () => {
    const estado = filtroEstado === "todas" ? undefined : filtroEstado;
    const { compras: data, estadisticas: stats } = await obtenerCompras(estado);
    setCompras(data);
    if (stats) setEstadisticas(stats);
  }, [filtroEstado, obtenerCompras]);

  useEffect(() => {
    cargarCompras();
  }, [cargarCompras]);

  const getEstadoBadge = (estado: EstadoVenta) => {
    const badges = {
      pagada: {
        icon: <FaCheckCircle />,
        class: "badge-success",
        text: "Pagada",
      },
      pendiente: {
        icon: <FaClock />,
        class: "badge-warning",
        text: "Pendiente",
      },
      fallida: { icon: <FaTimes />, class: "badge-danger", text: "Fallida" },
      cancelada: {
        icon: <FaTimes />,
        class: "badge-secondary",
        text: "Cancelada",
      },
      reembolsada: {
        icon: <FaUndo />,
        class: "badge-info",
        text: "Reembolsada",
      },
    };
    const badge = badges[estado];
    return (
      <span className={`badge ${badge.class}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  if (loading && compras.length === 0) {
    return (
      <div className="page-container fade-in">
        <div className="page-header">
          <div>
            <h2>
              <FaReceipt /> Mis Órdenes de Compra
            </h2>
            <p>Historial de tus compras realizadas</p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>
            <FaReceipt /> Mis Órdenes de Compra
          </h2>
          <p>Historial de tus compras realizadas</p>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas.total_compras > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FaReceipt />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Compras</span>
              <span className="stat-value">{estadisticas.total_compras}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pagadas</span>
              <span className="stat-value">{estadisticas.compras_pagadas}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">
              <FaClock />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pendientes</span>
              <span className="stat-value">
                {estadisticas.compras_pendientes}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon info">
              <FaReceipt />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Gastado</span>
              <span className="stat-value">
                {formatPrice(estadisticas.total_gastado)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value as EstadoVenta | "todas")
            }
            className="form-input"
          >
            <option value="todas">Todas</option>
            <option value="pagada">Pagadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="fallida">Fallidas</option>
            <option value="cancelada">Canceladas</option>
            <option value="reembolsada">Reembolsadas</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <FaTimes /> {error}
        </div>
      )}

      {compras.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaReceipt size={48} />
          </div>
          <h3>No tienes órdenes registradas</h3>
          <p>Aquí aparecerá el historial de tus compras</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Método de Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>#{compra.id}</td>
                  <td>{formatDate(compra.created_at)}</td>
                  <td>
                    <div className="producto-preview">
                      {compra.detalles.slice(0, 2).map((detalle, idx) => (
                        <span key={idx} className="producto-tag">
                          {detalle.producto.nombre} x{detalle.cantidad}
                        </span>
                      ))}
                      {compra.detalles.length > 2 && (
                        <span className="producto-tag">
                          +{compra.detalles.length - 2} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="font-bold">{formatPrice(compra.total)}</td>
                  <td>{getEstadoBadge(compra.estado)}</td>
                  <td>
                    {typeof compra.metodo_pago === "string"
                      ? compra.metodo_pago
                      : compra.metodo_pago.nombre}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-info"
                        title="Ver detalles"
                      >
                        <FaEye />
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

export default Ordenes;
