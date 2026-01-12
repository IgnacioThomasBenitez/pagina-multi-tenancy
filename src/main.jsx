// ==========================
// IMPORTS PRINCIPALES
// ==========================

// Importa React (necesario para JSX)
import React from "react";

// Importa ReactDOM para renderizar la app en el DOM
import ReactDOM from "react-dom/client";

// BrowserRouter permite usar rutas (/ventas, /inventario, etc.)
import { BrowserRouter } from "react-router-dom";

// Componente principal de la app
import App from "./App";

// Estilos globales (Tailwind + CSS base)
import "./index.css";

// ==========================
// RENDER DE LA APLICACIÓN
// ==========================

// Crea la raíz React dentro del div <div id="root"></div> del index.html
ReactDOM.createRoot(document.getElementById("root")).render(

  // BrowserRouter envuelve toda la app
  // Esto habilita el uso de rutas con react-router-dom
  <BrowserRouter>

    {/* App es el componente principal */}
    <App />

  </BrowserRouter>
);
