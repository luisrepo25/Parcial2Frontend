# 🎨 Sistema de Estilos Centralizado - SmartSales

## 📁 Estructura de Estilos

```
src/shared/styles/
├── variables.css      # Variables CSS (colores, tamaños, espaciado)
├── components.css     # Estilos de componentes (botones, tablas, formularios, etc.)
├── layout.css         # Estilos de layout (sidebar, header, modal, etc.)
└── pages.css          # Estilos de páginas (contenedores, headers, grids, etc.)
```

## 🚀 Cómo Usar

### 1. Los estilos se importan automáticamente

El archivo `src/index.css` ya importa todos los estilos necesarios:

```css
@import "./shared/styles/variables.css";
@import "./shared/styles/components.css";
@import "./shared/styles/layout.css";
@import "./shared/styles/pages.css";
```

### 2. NO importar CSS en componentes individuales

❌ **NO hacer esto:**

```tsx
import "./MiComponente.css";
```

✅ **Hacer esto:**

```tsx
// Sin imports de CSS, usar clases globales
<div className="page-container">
  <button className="btn-primary">Guardar</button>
</div>
```

### 3. Usar React Icons

```bash
npm install react-icons
```

```tsx
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

<button className="btn-primary">
  <MdAdd />
  Nuevo
</button>;
```

## 📦 Clases Principales

### Contenedores

- `.page-container` - Contenedor principal de página (con padding y max-width)
- `.page-container-full` - Contenedor de ancho completo
- `.content-card` - Tarjeta de contenido
- `.table-container` - Contenedor de tabla

### Encabezados

- `.page-header` - Header de página
- `.page-title` - Título principal con icono
- `.page-subtitle` - Subtítulo
- `.page-header-actions` - Contenedor de acciones

### Botones

- `.btn-primary` - Botón principal (violeta)
- `.btn-secondary` - Botón secundario (gris)
- `.btn-success` - Botón de éxito (verde)
- `.btn-danger` - Botón de peligro (rojo)
- `.btn-warning` - Botón de advertencia (naranja)
- `.btn-sm` / `.btn-lg` - Tamaños
- `.btn-icon` - Solo icono

### Formularios

- `.form-card` - Contenedor de formulario
- `.form-group` - Grupo de campo
- `.form-row` - Fila con múltiples campos
- `.form-actions` - Contenedor de botones del formulario

### Tablas

- `.table-modern` - Tabla con estilos modernos
- `.table-actions` - Contenedor de acciones de tabla
- `.table-action-button` - Botón de acción

### Badges

- `.badge` - Badge base
- `.badge-primary` / `.badge-success` / `.badge-danger` / `.badge-warning`

### Alertas

- `.alert` - Alerta base
- `.alert-success` / `.alert-danger` / `.alert-warning` / `.alert-info`

## 🎨 Variables CSS Principales

### Colores

```css
var(--primary-600)      /* #6366f1 - Violeta primario */
var(--success-600)      /* #16a34a - Verde */
var(--danger-600)       /* #dc2626 - Rojo */
var(--warning-600)      /* #d97706 - Naranja */
var(--text-primary)     /* #1e293b - Texto principal */
var(--text-secondary)   /* #64748b - Texto secundario */
var(--bg-primary)       /* #ffffff - Fondo blanco */
var(--bg-secondary)     /* #f8fafc - Fondo gris claro */
```

### Espaciado

```css
var(--spacing-sm)       /* 8px */
var(--spacing-md)       /* 12px */
var(--spacing-lg)       /* 16px */
var(--spacing-xl)       /* 20px */
var(--spacing-2xl)      /* 24px */
var(--spacing-3xl)      /* 32px */
```

### Iconos (React Icons)

```css
var(--icon-xs)          /* 14px */
var(--icon-sm)          /* 16px */
var(--icon-md)          /* 20px */
var(--icon-lg)          /* 24px */
var(--icon-xl)          /* 28px */
var(--icon-2xl)         /* 32px */
```

### Border Radius

```css
var(--radius-sm)        /* 6px */
var(--radius-md)        /* 8px */
var(--radius-lg)        /* 12px */
var(--radius-xl)        /* 16px */
var(--radius-full)      /* 9999px - Círculo */
```

## 📖 Ejemplo Completo

```tsx
import React from "react";
import { MdAdd, MdEdit, MdDelete, MdInventory } from "react-icons/md";
import { BsEye } from "react-icons/bs";

export const ProductosList: React.FC = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <MdInventory />
            Gestión de Productos
          </h1>
          <p className="page-subtitle">
            Administra todos los productos del sistema
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary">
            <MdAdd />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Laptop HP</td>
              <td>$899.99</td>
              <td>
                <span className="badge badge-success">Activo</span>
              </td>
              <td>
                <div className="table-actions">
                  <button className="table-action-button view">
                    <BsEye />
                  </button>
                  <button className="table-action-button edit">
                    <MdEdit />
                  </button>
                  <button className="table-action-button delete">
                    <MdDelete />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

## 🔄 Migración de Componentes Existentes

1. **Eliminar** el import de CSS específico:

   ```tsx
   // import './MiComponente.css'; // ❌ Eliminar
   ```

2. **Reemplazar** clases personalizadas por clases globales:

   ```tsx
   // ❌ Antes
   <div className="mi-contenedor-custom">

   // ✅ Después
   <div className="page-container">
   ```

3. **Agregar** React Icons:

   ```tsx
   // ❌ Antes
   <button>Guardar</button>;

   // ✅ Después
   import { MdSave } from "react-icons/md";
   <button className="btn-primary">
     <MdSave />
     Guardar
   </button>;
   ```

## 📚 Documentación Completa

Ver `EstilosForm.md` para:

- Lista completa de clases disponibles
- Ejemplos de todas las páginas
- Guía de uso de React Icons
- Best practices

## 🛠️ Mantenimiento

### Para agregar nuevos estilos:

1. Evaluar si debe ir en `components.css`, `layout.css` o `pages.css`
2. Usar variables CSS en lugar de valores hardcodeados
3. Seguir las convenciones de nomenclatura existentes
4. Documentar en `EstilosForm.md` si es necesario

### Variables CSS:

- Definir en `variables.css`
- Usar nombres semánticos
- Agrupar por categorías (colores, espaciado, tipografía, etc.)

## ✅ Beneficios

- ✨ **Consistencia** - Mismo estilo en toda la aplicación
- 🎨 **Paleta unificada** - Colores y espaciados consistentes
- 🚀 **Desarrollo rápido** - Clases reutilizables
- 📱 **Responsive** - Diseño adaptable incluido
- 🔧 **Mantenible** - Un solo lugar para cambios
- ♿ **Accesible** - Mejores prácticas de accesibilidad
- 🎯 **Iconografía consistente** - React Icons integrado
