# Módulo de Usuarios

Gestión unificada de usuarios del sistema (clientes y administradores).

## 📁 Estructura

```
users/
├── pages/
│   ├── UsersList.tsx          # Lista unificada de usuarios
│   ├── UserForm.tsx            # Formulario con selector de rol
│   ├── UserDetail.tsx          # Vista de detalles
│   └── styles/
│       ├── UsersList.css
│       ├── UserForm.css
│       └── UserDetail.css
├── services/
│   ├── usersApi.ts             # Operaciones unificadas
│   ├── clienteApi.ts           # CRUD de clientes
│   └── adminApi.ts             # CRUD de admins
├── types/
│   └── index.ts                # Interfaces TypeScript
└── index.ts                    # Exports
```

## 🎯 Características

### Lista Unificada (UsersList.tsx)

- **Vista consolidada**: Muestra clientes y admins en una sola tabla
- **Filtros dinámicos**: Todos / Clientes / Admins
- **Badges visuales**: Identificación de tipo con iconos y colores
- **Acciones**: Ver, Editar, Eliminar

### Formulario Dinámico (UserForm.tsx)

- **Selector de rol**: Cliente o Administrador (solo en creación)
- **Formularios adaptativos**:
  - **Cliente**: Nombres, apellidos, CI, teléfono, correo, contraseña
  - **Admin**: Nombre, correo, contraseña
- **Modo edición**: Contraseña opcional al editar

### Vista de Detalles (UserDetail.tsx)

- **Info completa**: Todos los datos del usuario según tipo
- **Metadata**: Fechas de registro y actualización
- **Acciones rápidas**: Botón de edición

## 🔌 APIs

### usersApi

```typescript
// Obtener todos los usuarios (clientes + admins)
const usuarios = await usersApi.getUsers();

// Eliminar usuario
const response = await usersApi.deleteUser(id, tipo);
```

### clienteApi

```typescript
// CRUD completo para clientes
clienteApi.getClientes();
clienteApi.getCliente(id);
clienteApi.createCliente(data);
clienteApi.updateCliente(id, data);
clienteApi.deleteCliente(id);
```

### adminApi

```typescript
// CRUD completo para administradores
adminApi.getAdmins();
adminApi.getAdmin(id);
adminApi.createAdmin(data);
adminApi.updateAdmin(id, data);
adminApi.deleteAdmin(id);
```

## 📡 Endpoints Backend

### Clientes

- `GET /users/clientes/` - Listar
- `GET /users/clientes/{id}/` - Detalle
- `POST /users/clientes/register/` - Crear
- `PUT /users/clientes/{id}/update/` - Actualizar
- `DELETE /users/clientes/{id}/delete/` - Eliminar

### Administradores

- `GET /users/admins/` - Listar
- `GET /users/admins/{id}/` - Detalle
- `POST /users/admins/register/` - Crear
- `PUT /users/admins/{id}/update/` - Actualizar
- `DELETE /users/admins/{id}/delete/` - Eliminar

## 🎨 Diseño

- **Tema**: Gradientes morados/azules
- **Componentes**: Cards, badges, botones con iconos
- **Responsive**: Adaptable a móviles
- **Estados**: Loading spinners, mensajes de error
- **Animaciones**: Transiciones suaves en hover

## 🔗 Rutas

```typescript
/admin/usuarios              # Lista
/admin/usuarios/nuevo        # Crear
/admin/usuarios/:id          # Ver detalle
/admin/usuarios/:id/editar   # Editar
```

## 📝 Tipos

```typescript
interface Usuario {
  id: number;
  correo: string;
  created_at?: string;
  updated_at?: string;
}

interface Cliente extends Usuario {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ci: string;
  telefono: string;
  tipo: "cliente";
}

interface Administrador extends Usuario {
  nombre?: string;
  tipo: "admin";
}

type UsuarioCompleto = Cliente | Administrador;

interface UsuarioListItem {
  id: number;
  correo: string;
  tipo: "cliente" | "admin";
  nombreCompleto: string;
  created_at?: string;
}
```

## ✅ Validaciones

### Cliente

- ✅ Correo electrónico válido
- ✅ Nombres, apellidos, CI, teléfono obligatorios
- ✅ Contraseña obligatoria al crear
- ✅ Contraseña opcional al editar

### Admin

- ✅ Correo electrónico válido
- ✅ Nombre obligatorio
- ✅ Contraseña obligatoria al crear
- ✅ Contraseña opcional al editar

## 🔐 Seguridad

- Headers de autenticación en todas las peticiones
- Confirmación antes de eliminar
- Protección de rutas con ProtectedRoute
- Validación de roles (solo admin puede acceder)

## 🚀 Uso

```tsx
import { UsersList, UserForm, UserDetail } from '@/modules/admin/users';

// En adminRoutes.tsx
{ path: "usuarios", element: <UsersList /> },
{ path: "usuarios/nuevo", element: <UserForm /> },
{ path: "usuarios/:id", element: <UserDetail /> },
{ path: "usuarios/:id/editar", element: <UserForm /> },
```

## 📊 Ejemplos de Respuesta

### Lista de Usuarios

```json
[
  {
    "id": 1,
    "correo": "cliente@test.com",
    "tipo": "cliente",
    "nombreCompleto": "Juan Pérez García",
    "created_at": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "correo": "admin@test.com",
    "tipo": "admin",
    "nombreCompleto": "María López",
    "created_at": "2024-01-10T09:00:00"
  }
]
```

### Detalle de Cliente (Backend)

```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "correo": "cliente@test.com",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  "nombres": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "ci": "12345678",
  "telefono": "77777777"
}
```

---

**Última actualización**: Enero 2024
**Autor**: Sistema SmartSales
