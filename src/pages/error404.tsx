// Pagina para mostrar el error 404 - Página no encontrada o ruta invalida
import { Link } from "react-router-dom";
import "./error404.css";

const Error404 = () => {
  return (
    <div className="error404-container">
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/">Volver a la página de inicio</Link>
    </div>
  );
};

export default Error404;
