import React from 'react';
import { ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";


const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Productos', value: '120' },
    { label: 'Pedidos Hoy', value: '18' },
    { label: 'Clientes', value: '57' }
  ];

  const recentMovements = [
    { id: 1, action: 'Nuevo producto agregado', date: '20 Nov 2025', status: 'Completado' },
    { id: 2, action: 'Pedido recibido', date: '19 Nov 2025', status: 'Pendiente' },
    { id: 3, action: 'Actualización de precio', date: '18 Nov 2025', status: 'Completado' }
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center text-4xl">
            💈
          </div>
          <h2 className="text-white font-bold text-lg">Nombre del Comercio</h2>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => navigate("/administrar")}
            className="w-full text-left px-4 py-3 rounded-lg bg-slate-800 text-white transition"
          >
            <BarChart3 className="inline mr-3" size={18} /> Mesas
          </button>

          <button
            onClick={() => navigate("/configuracion")}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 transition"
          >
            <Settings className="inline mr-3" size={18} /> Configuración
          </button>

          <button
            onClick={() => navigate("/barberia")}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 transition"
          >
            💈 Barbería
          </button>

          <button
            onClick={() => navigate("/kiosco")}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 transition"
          >
            🏪 Almacen / Kiosco 
          </button>

          <button
            onClick={() => navigate("/restaurante")}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 transition"
          >
            🍔 Restaurantes
          </button>

          <button
            onClick={() => navigate("/atencion")}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 transition"
          >
            📞 Atencion
          </button>
        </nav>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all mt-auto">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-slate-400">Gestiona toda tu tienda desde aquí.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-slate-400 mb-2">{stat.label}</h3>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Movements */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Últimos movimientos</h2>
          <div className="space-y-4">
            {recentMovements.map(mov => (
              <div
                key={mov.id}
                className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
              >
                <span className="text-slate-300">{mov.action}</span>
                <span className="text-slate-400">{mov.date}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    mov.status === 'Completado'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {mov.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/ventas")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            <ShoppingCart className="inline mr-2" size={18} /> Ir a Ventas
          </button>

          <button
            onClick={() => navigate("/inventario")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Package className="inline mr-2" size={18} /> Ir a Inventario
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
