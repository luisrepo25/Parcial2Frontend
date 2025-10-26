# 🎨 Guía de Estilos - SmartSales

## Paleta de Colores

### Colores Principales

- **Primary**: `#6366f1` (Índigo) - Botones principales, enlaces
- **Primary Hover**: `#4f46e5` - Estado hover del primary
- **Secondary**: `#8b5cf6` (Púrpura) - Acentos y degradados

### Colores de Estado

- **Success**: `#10b981` (Verde) - Acciones exitosas
- **Warning**: `#f59e0b` (Ámbar) - Advertencias
- **Danger**: `#ef4444` (Rojo) - Errores y acciones destructivas
- **Info**: `#3b82f6` (Azul) - Información

### Colores de Texto

- **Text Primary**: `#1e293b` - Texto principal
- **Text Secondary**: `#64748b` - Texto secundario
- **Text Muted**: `#94a3b8` - Texto deshabilitado/placeholders

### Colores de Fondo

- **Background**: `#f8fafc` - Fondo principal
- **Card Background**: `#ffffff` - Fondo de tarjetas
- **Sidebar**: `#1a1d2e` - Sidebar oscuro

### Colores de Borde

- **Border Light**: `#f1f5f9`
- **Border**: `#e2e8f0`
- **Border Dark**: `#cbd5e1`

---

## Tipografía

### Familia de Fuentes

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
```

### Tamaños de Texto

- **Extra Small**: `12px` - Badges, etiquetas
- **Small**: `13px` - Texto secundario
- **Base**: `14px` - Texto principal
- **Medium**: `16px` - Subtítulos
- **Large**: `20px` - Títulos de sección
- **XL**: `24px` - Títulos principales
- **2XL**: `28px` - Títulos de página
- **3XL**: `36px` - Valores destacados

---

## Componentes de Botones

### Uso de Botones

#### Botón Primario

```jsx
<button className="btn-primary">Guardar</button>
// O como link
<Link to="/productos/nuevo" className="btn-primary">Nuevo Producto</Link>
```

#### Botón Secundario

```jsx
<button className="btn-secondary">Cancelar</button>
```

#### Botón de Éxito

```jsx
<button className="btn-success">Confirmar</button>
```

#### Botón de Peligro

```jsx
<button className="btn-danger">Eliminar</button>
```

#### Tamaños

```jsx
<button className="btn-primary btn-sm">Pequeño</button>
<button className="btn-primary">Normal</button>
<button className="btn-primary btn-lg">Grande</button>
```

---

## Tarjetas

### Tarjeta Básica

```jsx
<div className="card">
  <h3>Título</h3>
  <p>Contenido de la tarjeta</p>
</div>
```

### Tarjeta Moderna (sin animación previa)

```jsx
<div className="card-modern">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

---

## Tablas

### Tabla Moderna

```jsx
<div className="table-container">
  <table className="table-modern">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Producto 1</td>
        <td>$100.00</td>
        <td>
          <button className="btn-sm btn-secondary">Ver</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Formularios

### Estructura de Formulario

```jsx
<form>
  <div className="form-group">
    <label htmlFor="nombre">Nombre</label>
    <input type="text" id="nombre" placeholder="Ingrese el nombre" />
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="precio">Precio</label>
      <input type="number" id="precio" />
    </div>
    <div className="form-group">
      <label htmlFor="stock">Stock</label>
      <input type="number" id="stock" />
    </div>
  </div>

  <div className="form-actions">
    <button type="button" className="btn-secondary">
      Cancelar
    </button>
    <button type="submit" className="btn-primary">
      Guardar
    </button>
  </div>
</form>
```

---

## Badges

### Uso de Badges

```jsx
<span className="badge badge-primary">Activo</span>
<span className="badge badge-success">Completado</span>
<span className="badge badge-warning">Pendiente</span>
<span className="badge badge-danger">Cancelado</span>
```

---

## Alertas

### Mensajes de Alerta

```jsx
<div className="alert alert-info">
  ℹ️ Información importante
</div>

<div className="alert alert-success">
  ✅ Operación exitosa
</div>

<div className="alert alert-warning">
  ⚠️ Advertencia
</div>

<div className="alert alert-danger">
  ❌ Error en la operación
</div>
```

---

## Espaciado

### Clases de Utilidad

```jsx
// Margin Top
<div className="mt-1">Margin top 0.5rem</div>
<div className="mt-2">Margin top 1rem</div>
<div className="mt-3">Margin top 1.5rem</div>
<div className="mt-4">Margin top 2rem</div>

// Margin Bottom
<div className="mb-1">Margin bottom 0.5rem</div>
<div className="mb-2">Margin bottom 1rem</div>
<div className="mb-3">Margin bottom 1.5rem</div>
<div className="mb-4">Margin bottom 2rem</div>
```

---

## Animaciones

### Clases de Animación

```jsx
// Fade in
<div className="fade-in">Aparece suavemente</div>

// Slide in desde la izquierda
<div className="slide-in-left">Entra desde izquierda</div>

// Slide in desde la derecha
<div className="slide-in-right">Entra desde derecha</div>
```

---

## Efectos de Hover

Todos los botones y elementos interactivos tienen efectos de hover incorporados:

- **translateY(-2px)**: Elevación al hacer hover
- **box-shadow**: Sombra aumentada
- Transiciones suaves con `cubic-bezier(0.4, 0, 0.2, 1)`

---

## Bordes Redondeados

- **Pequeño**: `8px` - Inputs, badges
- **Mediano**: `10px` - Botones
- **Grande**: `12px` - Alertas
- **XL**: `16px` - Tarjetas

---

## Sombras

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

---

## Importar Estilos de Componentes

Para usar los estilos de componentes en tus páginas:

```tsx
import "../../../shared/styles/components.css";
```

---

## Ejemplo Completo

```tsx
import { useState } from "react";
import "../../../shared/styles/components.css";

const ProductosList = () => {
  return (
    <div className="fade-in">
      <div className="alert alert-info">
        ℹ️ Mostrando todos los productos disponibles
      </div>

      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Laptop HP</td>
              <td>
                <span className="badge badge-success">Activo</span>
              </td>
              <td>
                <button className="btn-primary btn-sm">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## Buenas Prácticas

1. **Usa las clases predefinidas** en lugar de crear estilos inline
2. **Mantén la consistencia** usando siempre los mismos colores y espaciados
3. **Aprovecha las animaciones** para mejorar la UX
4. **Usa los botones apropiados** según la acción (primary, danger, etc.)
5. **Estructura tus formularios** con form-group y form-actions
6. **Añade feedback visual** con badges y alertas

---

¡Disfruta del diseño moderno y minimalista! 🎨
