import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar";
import {
  FaBox,
  FaTags,
  FaCertificate,
  FaShieldAlt,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";

const AdminLayout = () => {
  const adminMenuItems = [
    { path: "/admin/productos", label: "Productos", icon: <FaBox /> },
    { path: "/admin/categorias", label: "Categorías", icon: <FaTags /> },
    { path: "/admin/marcas", label: "Marcas", icon: <FaCertificate /> },
    { path: "/admin/garantias", label: "Garantías", icon: <FaShieldAlt /> },
    { path: "/admin/usuarios", label: "Usuarios", icon: <FaUsers /> },
    { path: "/admin/reportes", label: "Reportes", icon: <FaChartBar /> },
  ];

  return (
    <div className="admin-layout">
      <Sidebar items={adminMenuItems} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
