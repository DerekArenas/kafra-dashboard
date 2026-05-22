#  Kafra  — Distribuidora de Abarrotes

Sistema web de gestión para la distribuidora Kafra. Permite administrar clientes, productos, compras, trabajadores, suministros y más, con control de acceso por roles.

---


| **Página web** | GitHub Pages | `https://derekarenas.github.io/kafra-dashboard` |
| **API / Backend** | Render (Web Service) | `https://kafra-api.onrender.com` |
| **Base de datos** | Render (PostgreSQL) | `kafra-db` — Oregon, US West |

---

##  Estructura del repositorio


kafra-dashboard/
├── index.html     ← Página web completa (frontend)
├── server.js      ← API backend (Node.js + Express)
├── package.json   ← Dependencias del backend
├── .gitignore     ← Archivos ignorados por Git
└── README.md     
```

---

##  ¿Cómo funciona?

```
Usuario (navegador)
       ↓
GitHub Pages — sirve el index.html
       ↓
Render Web Service — kafra-api.onrender.com/api
       ↓
Render PostgreSQL — kafra-db
```

1. El usuario abre la página desde GitHub Pages
2. La página hace peticiones a la API en Render
3. La API consulta o modifica la base de datos PostgreSQL
4. Los resultados regresan a la página y se muestran en pantalla
---

## 🔐 Acceso y roles

La página requiere iniciar sesión. Los usuarios y contraseñas están almacenados en la base de datos PostgreSQL.

| Rol | Acceso |
|---|---|
| **Admin** | Todo — agregar, editar y eliminar en todas las secciones |
| **Gerente** | Todo — igual que admin pero sin gestión de usuarios |
| **Vendedor** | Clientes, productos, compras y detalle de compras |
| **Almacenista** | Productos, suministros y proveedores |
| **Repartidor** | Compras y clientes (lo necesario para entregas) |
| **Consulta** | Ve todo pero no puede agregar ni eliminar |

Para agregar o modificar usuarios se hace directamente en la base de datos con pgAdmin:

```sql
-- Agregar usuario
INSERT INTO usuarios (usuario, password, nombre, rol)
VALUES ('nuevousuario', 'contrasena', 'Nombre Completo', 'vendedor');

-- Cambiar contraseña
UPDATE usuarios SET password = 'nueva_contrasena' WHERE usuario = 'nombre';

-- Desactivar usuario
UPDATE usuarios SET activo = false WHERE usuario = 'nombre';
```

---

## 🗄️ Base de datos

**Plataforma:** Render PostgreSQL (plan gratuito)  
**Región:** Oregon (US West)  
**Versión:** PostgreSQL 18  
**Expiración del plan gratuito:** 19 de junio de 2026 — renovar o actualizar antes de esa fecha

### Tablas (14)

| Tabla | Descripción |
|---|---|
| `usuarios` | Cuentas de acceso con roles |
| `distribuidora` | Datos de la empresa |
| `cliente` | Todos los clientes |
| `cliente_factura` | Clientes que requieren factura |
| `cliente_sin_factura` | Clientes sin factura |
| `proveedor` | Proveedores registrados |
| `producto` | Catálogo de productos con stock |
| `trabajador` | Personal de la distribuidora |
| `trabajador_interno` | Trabajadores de bodega con turno |
| `repartidor` | Repartidores |
| `compra` | Ventas registradas |
| `detalle_compra` | Productos por cada venta |
| `suministro` | Entradas de mercancía de proveedores |
| `tel_cliente` | Teléfonos de clientes |
| `tel_trabajador` | Teléfonos de trabajadores |

### Conectarse con pgAdmin

| Campo | Valor |
|---|---|
| Host | `dpg-d873hpreo5us73dokp9g-a.oregon-postgres.render.com` |
| Port | `5432` |
| Database | `kafra_db` |
| Username | `kafra_db_user` |

---

##  Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Node.js, Express.js
- **Base de datos:** PostgreSQL
- **Hosting frontend:** GitHub Pages
- **Hosting backend + BD:** Render

---

