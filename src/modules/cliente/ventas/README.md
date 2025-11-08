# 📦 Módulo de Ventas - Guía de Uso

## 🎯 Descripción

El módulo de ventas integra todos los endpoints de la API de ventas (Stripe) documentados en `sales.md`. Incluye servicios, tipos TypeScript y hooks personalizados para facilitar el manejo de compras, pagos y órdenes.

---

## 📁 Estructura del Módulo

```
src/modules/cliente/ventas/
├── services/
│   └── ventasApi.ts          # Servicio con todos los endpoints
├── types/
│   └── index.ts              # Tipos TypeScript
├── hooks/
│   └── useVentas.ts          # Hook personalizado
└── index.ts                  # Exportaciones principales
```

---

## 🔧 Servicios Disponibles

### 1. **createCheckout** - Crear sesión de pago

```typescript
import { ventasApi } from "@/modules/cliente/ventas";

const response = await ventasApi.createCheckout({
  items: [
    { producto_id: 1, cantidad: 2 },
    { producto_id: 3, cantidad: 1 },
  ],
});

if (response.ok) {
  // Redirigir a Stripe
  window.location.href = response.url!;
}
```

### 2. **verifySession** - Verificar sesión de pago

```typescript
const response = await ventasApi.verifySession(sessionId);

if (response.ok) {
  console.log("Estado:", response.nota_venta?.estado);
  console.log("Total:", response.nota_venta?.total);
}
```

### 3. **getMisCompras** - Obtener lista de compras

```typescript
// Todas las compras
const response = await ventasApi.getMisCompras();

// Filtrar por estado
const response = await ventasApi.getMisCompras("pagada");

if (response.ok) {
  console.log("Compras:", response.compras);
  console.log("Estadísticas:", response.estadisticas);
}
```

### 4. **getDetalleCompra** - Obtener detalle de una compra

```typescript
const response = await ventasApi.getDetalleCompra(15);

if (response.ok) {
  console.log("Compra:", response.compra);
}
```

### 5. **solicitarReembolso** - Solicitar reembolso

```typescript
const response = await ventasApi.solicitarReembolso(15);

if (response.ok) {
  console.log("Reembolso exitoso");
}
```

---

## 🪝 Hook `useVentas`

El hook personalizado simplifica el uso de los servicios y maneja automáticamente el estado de carga y errores.

### Ejemplo de uso en componente

```tsx
import { useEffect, useState } from "react";
import { useVentas } from "@/modules/cliente/ventas";
import type { NotaVenta } from "@/modules/cliente/ventas";

const MisCompras = () => {
  const { loading, error, obtenerCompras } = useVentas();
  const [compras, setCompras] = useState<NotaVenta[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { compras: data } = await obtenerCompras();
    setCompras(data);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {compras.map((compra) => (
        <div key={compra.id}>
          <p>ID: {compra.id}</p>
          <p>Total: ${compra.total}</p>
          <p>Estado: {compra.estado}</p>
        </div>
      ))}
    </div>
  );
};
```

### Métodos disponibles en el hook

```typescript
const {
  loading, // Estado de carga
  error, // Mensaje de error
  crearCheckout, // Crear checkout y redirigir a Stripe
  verificarSesion, // Verificar sesión de pago
  obtenerCompras, // Obtener lista de compras
  obtenerDetalleCompra, // Obtener detalle de compra
  solicitarReembolso, // Solicitar reembolso
} = useVentas();
```

---

## 📊 Tipos TypeScript

### Estados de Venta

```typescript
type EstadoVenta =
  | "pendiente"
  | "pagada"
  | "fallida"
  | "cancelada"
  | "reembolsada";
```

### Interfaces Principales

```typescript
// Item del carrito
interface CheckoutItem {
  producto_id: number;
  cantidad: number;
}

// Nota de Venta
interface NotaVenta {
  id: number;
  total: number;
  estado: EstadoVenta;
  metodo_pago: string | MetodoPago;
  created_at: string;
  detalles: DetalleVenta[];
}

// Detalle de Venta
interface DetalleVenta {
  producto: ProductoVenta;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
```

---

## 🎨 Ejemplo Completo: Flujo de Compra

### 1. Página del Carrito

```tsx
import { useVentas } from "@/modules/cliente/ventas";

const Carrito = () => {
  const { loading, crearCheckout } = useVentas();
  const [items, setItems] = useState([
    { producto_id: 1, cantidad: 2 },
    { producto_id: 5, cantidad: 1 },
  ]);

  const handlePagar = async () => {
    await crearCheckout(items);
    // Se redirige automáticamente a Stripe
  };

  return (
    <div>
      {/* Lista de productos */}
      <button onClick={handlePagar} disabled={loading}>
        {loading ? "Procesando..." : "Pagar con Stripe"}
      </button>
    </div>
  );
};
```

### 2. Página de Verificación (después del pago)

```tsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVentas } from "@/modules/cliente/ventas";

const VerificarPago = () => {
  const [searchParams] = useSearchParams();
  const { verificarSesion } = useVentas();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      verificar();
    }
  }, [sessionId]);

  const verificar = async () => {
    const result = await verificarSesion(sessionId!);

    if (result?.nota_venta?.estado === "pagada") {
      // Pago exitoso
      console.log("¡Pago completado!");
    }
  };

  return <div>Verificando pago...</div>;
};
```

### 3. Página de Órdenes (implementada en `Ordenes.tsx`)

```tsx
import { useVentas } from "@/modules/cliente/ventas";

const Ordenes = () => {
  const { loading, obtenerCompras, solicitarReembolso } = useVentas();
  const [compras, setCompras] = useState([]);

  const handleReembolso = async (ventaId: number) => {
    const success = await solicitarReembolso(ventaId);
    if (success) {
      // Recargar compras
      const { compras: data } = await obtenerCompras();
      setCompras(data);
    }
  };

  // ... resto del componente
};
```

---

## ⚙️ Configuración

### URL del API

Cambiar la URL base en `ventasApi.ts`:

```typescript
const API_URL = "http://localhost:8000/sales"; // Desarrollo
// const API_URL = "https://parcial2backend.onrender.com/sales"; // Producción
```

### Autenticación

El servicio usa automáticamente el token JWT del `authApi`:

```typescript
const token = authApi.getToken();
```

---

## 🧪 Testing con Stripe

Tarjetas de prueba para desarrollo:

| Resultado    | Número                | CVC | Fecha |
| ------------ | --------------------- | --- | ----- |
| ✅ Éxito     | `4242 4242 4242 4242` | 123 | 12/30 |
| 🔐 3D Secure | `4000 0025 0000 3155` | 123 | 12/30 |
| ❌ Rechazada | `4000 0000 0000 9995` | 123 | 12/30 |

---

## 🚨 Manejo de Errores

Todas las respuestas siguen el patrón:

```typescript
{
  ok: boolean;
  // ... datos si ok=true
  error?: string; // mensaje si ok=false
}
```

Ejemplo de manejo:

```typescript
const response = await ventasApi.createCheckout({ items });

if (!response.ok) {
  // Mostrar error al usuario
  alert(response.error);
  return;
}

// Continuar con el flujo exitoso
window.location.href = response.url!;
```

---

## 📝 Notas Importantes

1. **Autenticación requerida**: Todos los endpoints (excepto webhook) requieren JWT
2. **Estados de venta**: Las ventas pasan por diferentes estados según el flujo de pago
3. **Stock automático**: El stock se reduce al pagar y se restaura al reembolsar
4. **Webhook de Stripe**: El backend maneja automáticamente los eventos de Stripe

---

## 🔗 Referencias

- Documentación completa: `sales.md`
- API Backend: `http://localhost:8000/sales/`
- Stripe Docs: https://stripe.com/docs
