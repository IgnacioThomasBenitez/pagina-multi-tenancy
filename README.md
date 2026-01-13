# 📦 pagina-multi-tenancy

Proyecto **multi-tenant** desarrollado en **React + Vite**, pensado para gestionar distintos tipos de negocios (restaurante, barbería, comercio, etc.) desde una misma base de código.

---

## 🚀 Descripción

**pagina-multi-tenancy** es una aplicación web moderna orientada a la gestión de negocios. Permite reutilizar la misma estructura para distintos rubros, cambiando solo las vistas y funcionalidades específicas de cada uno.

El proyecto está enfocado en:

* Escalabilidad
* UI moderna
* Separación clara de módulos
* Uso intensivo de componentes reutilizables

---

## 🧩 Funcionalidades principales

* 🧑‍💼 Sistema multi-negocio (multi-tenant)
* 🍽️ Gestión de mesas y pedidos (restaurante)
* 💈 Módulo de barbería
* 📦 Inventario de productos
* 🛒 Ventas
* 📊 Dashboard general
* 🧭 Navegación con React Router
* 🎨 Estilos con Tailwind CSS

---

## 🛠️ Tecnologías utilizadas

* **React 18**
* **Vite**
* **React Router DOM**
* **Tailwind CSS**
* **Lucide React (iconos)**
* **JavaScript (JSX)**

---

## 📂 Estructura del proyecto

```
pagina-multi-tenancy/
│
├── public/
│
├── src/
│   ├── assets/          # Imágenes e íconos
│   ├── components/      # Componentes reutilizables
│   ├── Sistema/         # Módulos principales del sistema
│   │   ├── Inventario.jsx
│   │   ├── Venta.jsx
│   │   ├── Atencion.jsx
│   │   ├── Almacen.jsx
│   │   └── Reposicion.jsx
│   ├── Barber/          # Módulo barbería
│   ├── Cliente/         # Vistas cliente
│   ├── App.jsx          # Componente raíz
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ▶️ Instalación y uso

### 1️⃣ Clonar el repositorio

```
git clone https://github.com/tu-usuario/pagina-multi-tenancy.git
```

### 2️⃣ Instalar dependencias

```
npm install
```

### 3️⃣ Ejecutar en desarrollo

```
npm run dev
```

La app se abrirá en:

```
http://localhost:5173
```

---

## 🧠 Concepto Multi-Tenant

El proyecto está diseñado para que **un solo código base** pueda manejar:

* Restaurantes
* Barberías
* Comercios
* Negocios personalizados

Cada tenant puede tener:

* Su propio flujo
* Sus propias vistas
* Sus propias reglas

---

## 📌 Estado del proyecto

🚧 En desarrollo activo

Próximas mejoras:

* Persistencia con localStorage
* Roles de usuario
* Autenticación
* Exportación de datos
* Backend 

---

## 👤 Autores

**Ignacio Thomas Benítez**
Desarrollador Front-End

**Franco Plate Paz**
Desarrollador Back-End

---

## 📄 Licencia


---

✨ *Proyecto pensado para escalar y convertirse en un sistema comercial real.*
