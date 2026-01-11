import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Inventario from "./Sistema/Inventario";
import Venta from "./Sistema/Venta";
import Administrar from "./Cliente/Administrar"
import Atencion from "./Sistema/Atencion"
import Mesas from "./Sistema/Mesas"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ventas" element={<Venta />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/administrar" element={<Administrar />} />
      <Route path="/atencion" element={<Atencion />} />
      <Route path="/mesas" element={<Mesas />} />
    </Routes>
  );
}
