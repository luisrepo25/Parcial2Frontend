const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Bienvenido al sistema de ventas SmartSales</p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Ventas del Mes</h3>
          <p className="card-value">$0.00</p>
        </div>
        <div className="card">
          <h3>Productos</h3>
          <p className="card-value">0</p>
        </div>
        <div className="card">
          <h3>Clientes</h3>
          <p className="card-value">0</p>
        </div>
        <div className="card">
          <h3>Usuarios</h3>
          <p className="card-value">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
