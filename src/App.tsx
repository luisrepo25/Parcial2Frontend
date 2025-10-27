import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CarritoProvider } from "./shared/contexts/CarritoContext";

function App() {
  return (
    <CarritoProvider>
      <RouterProvider router={router} />
    </CarritoProvider>
  );
}

export default App;
