# ☗ Kafra — Distribuidora de Abarrotes

Proyecto de sistema web de gestión para la distribuidora Kafra

**Integrantes:**
- Arenas Moran Derek Yael
- Carrillo López Diego Sebastián
- Ramos Tellez Erick

---

## 🌐 ¿Como esta hosteada?

| Componente | Plataforma | URL |
|---|---|---|
| **Página web** | GitHub Pages | `https://derekarenas.github.io/kafra-dashboard` |
| **API / Backend** | Render (Web Service) | `https://kafra-api.onrender.com` |
| **Base de datos** | Render (PostgreSQL 18) | `kafra-db` — Oregon, US West |

---

## 🗂️ Estructura del repositorio


kafra-dashboard/
├── index.html     ← Página web completa (frontend)
├── server.js      ← API backend (Node.js + Express)
├── package.json   ← Dependencias del backend
├── .gitignore     ← Archivos ignorados por Git
└── README.md      ← Este archivo
```

---

## ⚙️ Arquitectura del sistema

```
Usuario (navegador)
       ↓
GitHub Pages — sirve el index.html
       ↓
Render Web Service — kafra-api.onrender.com/api
       ↓
Render PostgreSQL 18 — kafra-db
```

> ⚠️ El plan gratuito de Render duerme el servidor tras 15 minutos de inactividad. La primera petición puede tardar hasta 50 segundos. La página despierta el servidor automáticamente al abrirse.

---

## 📚 Desarrollo del Proyecto — Prácticas

 Modelo Entidad-Relación

#### Caso de estudio
Para el caso de estudio se hizo entrevista  con el padre de Diego Carrillo, dueño de una distribuidora de abarrotes . De la entrevista se obtuvo la siguiente información:

- La distribuidora se dedica a la distribución de frutas, verduras, productos de limpieza y cremería
- Es una empresa pequeña con 10 empleados, 30 clientes fijos y algunos ocasionales, además de más de 20 proveedores
- Los productos se identifican mediante código de barras o código numérico
- Para clientes con factura se registra el RFC; para los demás solo nombre, dirección y teléfono
- Los clientes se clasifican en dos grupos: clientes de entrega a domicilio y clientes de mostrador

 Entidades y atributos identificados
Se identificaron las siguientes entidades:
| Entidad | Atributos |
|---|---|
| **Producto** | ID_Producto, Nombre, Código de barras, Precio, Peso, Tipo |
| **Cliente** | ID_Cliente, Nombre, Teléfono, Correo, Dirección, Tipo de cliente |
| **Trabajador** | ID_Trabajador, Nombre, Teléfono, Dirección, Correo, Sueldo |
| **Distribuidora** | ID_Distribuidora, Nombre, Dirección, Teléfono, Correo |

#### Relaciones y cardinalidades

| Relación | Cardinalidad | Justificación |
|---|---|---|
| Cliente — Compra — Producto | N:M | Muchos clientes compran muchos productos |
| Distribuidora — Consigue — Producto | 1:N | Una distribuidora consigue muchos productos |
| Distribuidora — Contrata — Trabajadores | 1:N | Una distribuidora contrata a todos sus trabajadores |



— Modelo Entidad-Relación Extendido

#### Limitaciones del modelo básico
El modelo entidad relacion tenía cuatro limitaciones principales:

1. **Sin generalizaciones ni especializaciones**: el atributo `tipo_cliente` distinguía entre tipos pero no podía expresar esta diferencia estructuralmente. El RFC quedaba vacío para clientes sin factura.
2. **Sin atributos multivaluados**: clientes y trabajadores pueden tener más de un teléfono, pero el modelo básico solo almacenaba uno.
3. **Sin entidades débiles**: la relación compra-producto requería atributos propios (fecha, cantidad, precio aplicado) que no tenían dónde almacenarse.
4. **Sin agregación**: la relación entre distribuidora, compras y proveedores no podía representarse con relaciones binarias simples.

#### Nuevos elementos del modelo extendido

**Entidad nueva: Proveedor**
Se agregó Proveedor como entidad independiente, ya que en el modelo básico era imposible registrar con quién se hacían los suministros.

**Entidades débiles identificadas:**
- **Compra**: no puede existir sin un Cliente. Su clave parcial es `Num_Orden` y su relación identificadora es `Realiza`.
- **DetalleCompra**: depende de Compra. Su clave parcial es `ID_Producto` y combinada con la clave de Compra forma su identificador completo.

**Jerarquías de especialización:**

*Cliente* se especializa en:
- `ClienteConFactura` — agrega RFC y Razón Social. Especialización **disjunta, total, por condición** (atributo `Tipo_Cliente`)
- `ClienteSinFactura` — solo requiere nombre, dirección y teléfono
  - Ambos subtipos se subclasifican en `ClienteEntrega` y `ClienteMostrador`

*Trabajador* se especializa en:
- `RepartidorConseguidor` — agrega Zona de reparto y Tipo de vehículo
- `TrabajadorInterno` — agrega Área asignada y Turno. Especialización **disjunta, parcial, definida por el usuario**

**Relación  — Suministro:**
Se identificó entre Distribuidora, Proveedor y Producto. El mismo producto puede ser suministrado por distintos proveedores a precios diferentes. Sus atributos propios son: fecha de suministro, cantidad recibida y precio de adquisición.

**Cardinalidades mínimas y máximas:**

| Relación | Cardinalidad | Justificación |
|---|---|---|
| Distribuidora — Contrata — Trabajador | (1,1):(1,N) | La distribuidora debe tener al menos un trabajador; un trabajador pertenece a una sola distribuidora |
| Cliente — Realiza — Compra | (1,N):(1,1) | Un cliente debe tener al menos una compra; una compra pertenece a un único cliente |
| Compra — Contiene — Producto | (1,N):(0,N) | Una compra contiene al menos un producto; un producto puede existir sin haber sido comprado |
| Proveedor — Suministra — Producto | (1,N):(1,N) | Un proveedor suministra al menos un producto; un producto viene de al menos un proveedor |

---

 Transformación al Modelo Relacional

Se eligió la estrategia de **tabla por subtipo** para ambas jerarquías. La tabla del supertipo almacena los atributos comunes y cada subtipo tiene su propia tabla con sus atributos específicos más una FK hacia el supertipo. Esta decisión evita los valores nulos que existían en la práctica 1, donde el RFC quedaba vacío para clientes sin factura.

#### Tablas generadas y sus decisiones de diseño

**Tabla Distribuidora**

ID_Distribuidora (PK), Nombre, RFC (UNIQUE), Dir_Calle, Dir_Numero,
Dir_Colonia, Dir_Ciudad, Dir_CP, Telefono, Correo (UNIQUE)
```

**Tabla Cliente** (supertipo)

ID_Cliente (PK), Nombre, Dir_Calle, Dir_Numero, Dir_Colonia,
Dir_Ciudad, Dir_CP, Correo, Tipo_Cliente (ENUM), Tipo_Atencion (ENUM)
```
> El RFC se movió a `ClienteConFactura` y desapareció de la tabla general, eliminando los nulos del modelo básico.

**Tabla Trabajador** (supertipo)

ID_Trabajador (PK), Nombre, Dir_Calle, Dir_Numero, Dir_Colonia,
Dir_Ciudad, Dir_CP, Correo, Sueldo, ID_Distribuidora (FK)
```

**Tablas de atributos :**

Telefonos_Cliente (ID_Cliente FK, Telefono) -- PK compuesta
Telefonos_Trabajador (ID_Trabajador FK, Telefono) -- PK compuesta
```

**Tabla asociativa DetalleCompra:**

ID_Compra (FK), ID_Producto (FK), Cantidad DEFAULT 1,
Precio_Unitario, Subtotal
-- PK compuesta (ID_Compra, ID_Producto)
```

**Tabla Suministro :**
ID_Distribuidora (FK), ID_Proveedor (FK), ID_Producto (FK),
Fecha_Suministro, Cantidad_Recibida, Precio_Adquisicion
-- PK compuesta de las 4 columnas
```

- `ID_Distribuidora` se propagó hacia `Trabajador` y `Suministro`
- `ID_Cliente` se propagó hacia `Compra`
- `ID_Compra` e `ID_Producto` forman la clave compuesta de `DetalleCompra`
- Los subtipos heredan la PK del supertipo como FK y PK a la vez

#### Validación del modelo — Preservación de semántica

| Aspecto | Modelo EER | Modelo Relacional |
|---|---|---|
| Entidades fuertes | Cliente, Trabajador, Producto, Proveedor, Distribuidora | Tablas con PK propias |
| Relaciones N:M | Compra–Producto, Proveedor–Producto | Tablas intermedias: DetalleCompra, Suministro |
| Jerarquías ISA | Cliente → ConFactura/SinFactura; Trabajador → Interno/Repartidor | Tablas separadas con FK al supertipo |
| Atributos multivaluados | Teléfono en Cliente y Trabajador | Tablas independientes con PK compuesta |

---

DDL, Restricciones de Dominio y DCL

#### Configuración del SGBD
- **Sistema:** PostgreSQL 18.2
- **Plataforma:** Windows x86-64, 64-bit
- **Charset:** UTF-8 — estándar universal, permite caracteres en español sin errores
- **Collation:** English_United States.932 — asignado por el instalador según la configuración regional del sistema

#### Justificación de PostgreSQL
Se eligió PostgreSQL por tres razones: soporte completo para restricciones avanzadas (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFERRABLE), características de seguridad robustas (autenticación scram-sha-256, GRANT/REVOKE, Row-Level Security), y facilidad de uso con pgAdmin 4.

#### Restricciones DEFAULT implementadas y justificadas

| Campo | DEFAULT | Justificación |
|---|---|---|
| `Producto.stock` | `0` | Al dar de alta un producto no existen unidades hasta que se registre un suministro |
| `Compra.fecha` | `CURRENT_DATE` | Automatizar la fecha reduce errores humanos en el punto de venta |
| `Cliente.tipo_cliente` | `'Sin factura'` | Por volumen, la mayoría son clientes de mostrador general |
| `Cliente.tipo_atencion` | `'Mostrador'` | La atención física es la actividad primaria del negocio |
| `DetalleCompra.cantidad` | `1` | Permite registrar el producto al escanearlo sin entrada de teclado obligatoria |
| `Compra.total` | `0.00` | Permite inicializar la cabecera antes de calcular el detalle |
| `Trabajador.sueldo` | `0.00` | Evita valores nulos para que cualquier cálculo de nómina parta de una base válida |

#### Restricciones UNIQUE implementadas

| Campo | Justificación |
|---|---|
| `Proveedor.RFC` | No pueden registrarse dos proveedores con la misma clave fiscal |
| `Trabajador.CURP` | Identifica de forma única a cada empleado ante las autoridades mexicanas |
| `ClienteConFactura.RFC` | Impide dos clientes con facturación bajo el mismo identificador fiscal |
| `Producto.Codigo_Barras` | Cada artículo debe tener un código universal único para el inventario |
| `Distribuidora.RFC` | Cada sucursal debe estar correctamente identificada de forma individual |
| `Suministro (4 columnas)` | Evita el registro duplicado del mismo lote por el mismo proveedor en la misma fecha |

#### DCL — Control de acceso con roles

Se implementaron roles con permisos diferenciados:
- **rol_gerente** — acceso completo a todas las tablas
- **rol_cajero** — INSERT y SELECT en compras y detalle
- **rol_almacenista** — UPDATE en productos y SELECT en suministros
- **rol_auditor** — solo SELECT en todas las tablas

---


| Rol | Acceso |
|---|---|
| **Admin** | Todo — incluyendo gestión de usuarios, edición y eliminación |
| **Gerente** | Todo — puede agregar y editar, sin gestión de usuarios |
| **Vendedor** | Clientes, productos, compras |
| **Almacenista** | Productos, suministros, proveedores |
| **Repartidor** | Compras y clientes |
| **Consulta** | Solo lectura, sin botones de acción |

Para administrar usuarios desde pgAdmin:
```sql
-- Agregar usuario
INSERT INTO usuarios (usuario, password, nombre, rol)
VALUES ('nuevousuario', 'contrasena', 'Nombre Completo', 'vendedor');

-- Cambiar contraseña
UPDATE usuarios SET password = 'nueva_contrasena' WHERE usuario = 'nombre';

-- Desactivar usuario sin borrarlo
UPDATE usuarios SET activo = false WHERE usuario = 'nombre';
```

---

## 🗄️ Tablas de la base de datos (15)

| Tabla | Descripción |
|---|---|
| `usuarios` | Cuentas de acceso con roles del sistema web |
| `distribuidora` | Datos de la empresa distribuidora |
| `cliente` | Todos los clientes (supertipo) |
| `cliente_factura` | Clientes que requieren factura con RFC |
| `cliente_sin_factura` | Clientes sin factura |
| `proveedor` | Proveedores registrados |
| `producto` | Catálogo de productos con precio y stock |
| `trabajador` | Personal de la distribuidora (supertipo) |
| `trabajador_interno` | Trabajadores de bodega con turno y área |
| `repartidor` | Repartidores con zona y tipo de vehículo |
| `compra` | Ventas registradas |
| `detalle_compra` | Productos por venta con subtotal calculado |
| `suministro` | Entradas de mercancía de proveedores |
| `tel_cliente` | Teléfonos de clientes (atributo multivaluado) |
| `tel_trabajador` | Teléfonos de trabajadores (atributo multivaluado) |



## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5, CSS3, JavaScript | Frontend completo en un solo archivo |
| Node.js + Express.js | API REST del backend con endpoints por tabla |
| PostgreSQL 18 | Motor de base de datos relacional |
| GitHub Pages | Hosting del frontend (archivos estáticos) |
| Render | Hosting del backend y la base de datos en la nube |
| pgAdmin 4 | Administración visual de la base de datos |


### Conectarse con pgAdmin

| Campo | Valor |
|---|---|
| Host | `dpg-d873hpreo5us73dokp9g-a.oregon-postgres.render.com` |
| Port | `5432` |
| Database | `kafra_db` |
| Username | `kafra_db_user` |

---

## 📖 Bibliografía

- PostgreSQL Global Development Group. (2025). *PostgreSQL Documentation*. https://www.postgresql.org/docs/
- Silberschatz, A., Korth, H. F., & Sudarshan, S. (2020). *Database System Concepts* (7th ed.). McGraw-Hill.
- Elmasri, R., & Navathe, S. B. (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.
- Connolly, T. y Begg, C. (2015). *Database Systems*. Pearson.
- Ramakrishnan, R. y Gehrke, J. (2013). *Sistemas de Gestión de Bases de Datos*. McGraw-Hill.
- ISO. (2016). *ISO/IEC 9075: SQL Standard*. International Organization for Standardization.
