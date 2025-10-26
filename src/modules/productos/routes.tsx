import type { RouteObject } from "react-router-dom";
import { ProductosList, ProductoForm, ProductoDetail } from "./pages";

export const productosRoutes: RouteObject[] = [
  {
    index: true,
    element: <ProductosList />,
  },
  {
    path: "nuevo",
    element: <ProductoForm />,
  },
  {
    path: "editar/:id",
    element: <ProductoForm />,
  },
  {
    path: ":id",
    element: <ProductoDetail />,
  },
];

export default productosRoutes;
