import { FaReceipt } from "react-icons/fa";

const Ordenes = () => {
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

      <div className="empty-state">
        <div className="empty-icon">
          <FaReceipt size={48} />
        </div>
        <h3>No tienes órdenes registradas</h3>
        <p>Aquí aparecerá el historial de tus compras</p>
      </div>
    </div>
  );
};

export default Ordenes;
