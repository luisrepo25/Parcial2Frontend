import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Producto } from "../../modules/admin/productos/types";

// Tipo para items del carrito
export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  items: CarritoItem[];
  addToCart: (producto: Producto) => void;
  removeFromCart: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CarritoItem[]>(() => {
    // Cargar del localStorage al iniciar
    const savedCart = localStorage.getItem("smartsales-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem("smartsales-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (producto: Producto) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.producto.id === producto.id
      );

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { producto, cantidad: 1 }];
      }
    });
  };

  const removeFromCart = (productoId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.producto.id !== productoId)
    );
  };

  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const precio =
        typeof item.producto.precio === "string"
          ? parseFloat(item.producto.precio)
          : item.producto.precio;
      return total + precio * item.cantidad;
    }, 0);
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error("useCarrito debe ser usado dentro de un CarritoProvider");
  }
  return context;
};
