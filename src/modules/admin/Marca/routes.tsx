import type { RouteObject } from "react-router-dom";
import { MarcasList, MarcaForm, MarcaDetail } from "./pages";

export const marcasRoutes: RouteObject[] = [
  {
    index: true,
    element: <MarcasList />,
  },
  {
    path: "nuevo",
    element: <MarcaForm />,
  },
  {
    path: "editar/:id",
    element: <MarcaForm />,
  },
  {
    path: ":id",
    element: <MarcaDetail />,
  },
];

export default marcasRoutes;
