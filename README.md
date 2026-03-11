# pagina-multi-tenancy

> Plataforma web **multi-tenant** desarrollada en **React + Vite** para la gestión integral de distintos tipos de negocios desde una única base de código.

---

## Descripción

**pagina-multi-tenancy** es una aplicación moderna orientada a la administración de negocios. Permite reutilizar la misma arquitectura para distintos rubros —barbería, restaurante, comercio— cambiando únicamente las vistas y reglas específicas de cada uno.

El proyecto está enfocado en:

- Escalabilidad y separación de módulos
- UI moderna con Tailwind CSS
- Estado global compartido mediante React Context
- Navegación fluida con React Router DOM
- Componentes reutilizables

---

## Funcionalidades

| Módulo | Descripción |
|---|---|
| 🧑‍💼 Multi-tenant | Un código base, múltiples rubros |
| 💈 Barbería | Atención al cliente y gestión de turnos |
| 🍽️ Restaurante | Mesas, pedidos y atención |
| 📦 Inventario | Control de stock y reposición |
| 🛒 Ventas | Registro y seguimiento de ventas |
| 📊 Dashboard | Vista general del negocio |
| 👤 Clientes | Vistas y administración por cliente |

---

## Tecnologías

- **React 18**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**
- **Lucide React**
- **React Context API**
- **JavaScript (JSX)**

---

## Estructura del proyecto

```
pagina-multi-tenancy/
│
├── public/
│
├── src/
│   ├── assets/                  # Imágenes e íconos
│   │   └── services/            # Imágenes de servicios
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # Componentes de UI base
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Modal.jsx
│   │
│   ├── context/                 # Estado global compartido
│   │   └── AppContext.jsx       # Contexto principal (turnos, servicios, horarios)
│   │
│   ├── Sistema/                 # Módulos del sistema por rubro
│   │   ├── Turnos/
│   │   │   ├── Atencion.jsx          # Pantalla de servicios y agendado
│   │   │   ├── Turnos.jsx            # Gestión y administración de turnos
│   │   │   ├── ConfiguracionProfesional.jsx
│   │   │   └── ConfiguracionServicio.jsx
│   │   ├── Gestion/
│   │   │   ├── Almacen.jsx
│   │   │   ├── Mesas.jsx
│   │   │   └── Reposicion.jsx
│   │   ├── Inventario.jsx
│   │   └── Venta.jsx
│   │
│   ├── Barber/                  # Módulo barbería
│   │
│   ├── Cliente/                 # Vistas del cliente
│   │   ├── Administrar.jsx
│   │   ├── HomeComercio.jsx
│   │   └── InicioBasico.jsx
│   │
│   ├── App.jsx                  # Rutas + AppProvider
│   ├── Home.jsx                 # Página de inicio
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/IgnacioThomasBenitez/pagina-multi-tenancy.git
cd pagina-multi-tenancy
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## Arquitectura de estado

El proyecto utiliza **React Context API** para compartir datos entre módulos sin prop drilling.

```
AppProvider  (src/context/AppContext.jsx)
│
├── turnos[]             → Atencion.jsx  +  Turnos.jsx
├── servicios[]          → Atencion.jsx
├── horarios{}           → Turnos.jsx (modal de configuración)
└── stats { total, atendidos, pendientes, cancelados }
```

Los turnos creados desde `Atencion.jsx` aparecen automáticamente en `Turnos.jsx` gracias al contexto compartido.

---

## Rutas disponibles

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home.jsx` | Inicio |
| `/atencion` | `Atencion.jsx` | Servicios y agendado de turnos |
| `/turnos` | `Turnos.jsx` | Gestión de turnos |
| `/config-profesional` | `ConfiguracionProfesional.jsx` | Config. de profesionales |
| `/config-servicio` | `ConfiguracionServicio.jsx` | Config. de servicios |
| `/administrar` | `Administrar.jsx` | Panel de administración |
| `/comercio` | `HomeComercio.jsx` | Vista comercio |
| `/inicio` | `InicioBasico.jsx` | Inicio básico cliente |

---

## Concepto Multi-Tenant

El proyecto está diseñado para que **un solo código base** soporte múltiples rubros:

- **Barbería / Centro de belleza** — turnos, servicios, atención
- **Restaurante** — mesas, pedidos, cocina
- **Comercio** — inventario, ventas, reposición

Cada tenant puede tener su propio flujo, vistas y reglas de negocio sin necesidad de duplicar código.

---

## Estado del proyecto

🚧 En desarrollo activo

**Próximas mejoras:**
- [ ] Persistencia con `localStorage` / base de datos
- [ ] Roles de usuario y permisos
- [ ] Autenticación (JWT / OAuth)
- [ ] Exportación de datos (PDF / Excel)
- [ ] Backend con API REST o Supabase
- [ ] Modo oscuro / claro por tenant

---

## Autores

**Ignacio Thomas Benítez** — Desarrollador Front-End

**Franco Plate Paz** — Desarrollador Back-End

---

✨ *Proyecto pensado para escalar y convertirse en un sistema comercial real.*