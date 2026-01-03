import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Inventario from "./Sistema/Inventario";
import Venta from "./Sistema/Venta";
import Administrar from "./Cliente/Administrar"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ventas" element={<Venta />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/administrar" element={<Administrar />} />
    </Routes>
  );
}
