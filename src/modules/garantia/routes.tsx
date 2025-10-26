import type { RouteObject } from "react-router-dom";
import { GarantiasList, GarantiaForm, GarantiaDetail } from "./pages";

export const garantiasRoutes: RouteObject[] = [
  {
    index: true,
    element: <GarantiasList />,
  },
  {
    path: "nuevo",
    element: <GarantiaForm />,
  },
  {
    path: "editar/:id",
    element: <GarantiaForm />,
  },
  {
    path: ":id",
    element: <GarantiaDetail />,
  },
];

export default garantiasRoutes;
