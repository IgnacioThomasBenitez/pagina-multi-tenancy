// Importación de componente Routes y Route desde react-router-dom para manejar el enrutamiento de la aplicación
import { Routes, Route } from "react-router-dom";

// Importación del componente Home desde la carpeta raíz
import Home from "./Home";

// Importación de componentes del sistema desde la carpeta Sistema
import Inventario from "./Sistema/Gestion/Inventario";
import Venta from "./Sistema/Gestion/Venta";
import Atencion from "./Sistema/Turnos/Atencion";
import Mesas from "./Sistema/Mesas";
import Dashboard from "./Sistema/Gestion/dashboard";
import Turnos from "./Sistema/Turnos/Turnos";
import ConfiguracionServicio from "./Sistema/Turnos/ConfiguracionServicio";

// Importación del componente Administrar desde la carpeta Cliente
import Administrar from "./Cliente/Administrar";

// Componente principal de rutas que define todas las rutas de la aplicación
export default function AppRoutes() {
  return (
    // Contenedor de todas las rutas de la aplicación
    <Routes>
      {/* Ruta principal que renderiza el componente Home */}
      <Route path="/" element={<Home />} />
      
      {/* Ruta para el módulo de ventas */}
      <Route path="/ventas" element={<Venta />} />
      
      {/* Ruta para el módulo de inventario */}
      <Route path="/inventario" element={<Inventario />} />
      
      {/* Ruta para el módulo de administración de clientes */}
      <Route path="/administrar" element={<Administrar />} />
      
      {/* Ruta para el módulo de atención al cliente */}
      <Route path="/atencion" element={<Atencion />} />
      
      {/* Ruta para el módulo de gestión de mesas */}
      <Route path="/mesas" element={<Mesas />} />
      
      {/* Ruta para el módulo de dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Ruta para el módulo de turnos */}
      <Route path="/turnos" element={<Turnos />} />
      
      {/* Ruta para el módulo de configuración de servicios */}
      <Route path="/configuracionservicio" element={<ConfiguracionServicio />} />
    </Routes>
  );
}