import type { RouteObject } from "react-router-dom";
import CategoriasList from "./pages/CategoriasList";
import CategoriaForm from "./pages/CategoriaForm";
import CategoriaDetail from "./pages/CategoriaDetail";

const categoriasRoutes: RouteObject[] = [
  {
    index: true,
    element: <CategoriasList />,
  },
  {
    path: "nuevo",
    element: <CategoriaForm />,
  },
  {
    path: "editar/:id",
    element: <CategoriaForm />,
  },
  {
    path: ":id",
    element: <CategoriaDetail />,
  },
];

export default categoriasRoutes;
