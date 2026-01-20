// Importación de React
import React from 'react';
// Importación de iconos
import { ShoppingCart, Package, TrendingUp, Users, DollarSign, Calendar, Settings, Cog } from 'lucide-react';
// Hook para navegación
import { useNavigate } from "react-router-dom";
// Importar el Sidebar reutilizable
import Sidebar from '../components/Sidebar';

// Componente de la página de Inicio
export default function Inicio() {
  const navigate = useNavigate();

  // Datos estáticos de estadísticas principales
  const stats = [
    { 
      label: 'Ventas de Hoy', 
      value: '$42,850', 
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      change: '+12.5%'
    },
    { 
      label: 'Productos', 
      value: '120', 
      icon: Package,
      color: 'from-blue-500 to-cyan-600',
      change: '+3'
    },
    { 
      label: 'Pedidos Hoy', 
      value: '18', 
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-600',
      change: '+5'
    },
    { 
      label: 'Clientes', 
      value: '57', 
      icon: Users,
      color: 'from-orange-500 to-red-600',
      change: '+8'
    }
  ];

  // Datos de accesos rápidos
  const quickAccess = [
    { 
      title: 'Registrar Venta', 
      icon: ShoppingCart, 
      path: '/ventas',
      description: 'Nueva transacción',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Inventario', 
      icon: Package, 
      path: '/inventario',
      description: 'Gestionar productos',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Mesas', 
      icon: Calendar, 
      path: '/mesas',
      description: 'Ver disponibilidad',
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Cocina', 
      icon: Calendar, 
      path: '/cocina',
      description: 'Ver pedidos pendientes',
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Reportes', 
      icon: TrendingUp, 
      path: '/configuracionservicio',
      description: 'Análisis y métricas',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      title: 'Configuración', 
      icon: Cog, 
      path: '/configuracionprofecional',
      description: 'Configuración del sistema',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Datos estáticos de actividad reciente
  const recentActivity = [
    { id: 1, action: 'Nueva venta registrada', amount: '$1,250', date: '10:30 AM', type: 'venta' },
    { id: 2, action: 'Producto agregado al inventario', amount: '15 unidades', date: '09:45 AM', type: 'inventario' },
    { id: 3, action: 'Mesa 5 cerrada', amount: '$850', date: '09:20 AM', type: 'mesa' },
    { id: 4, action: 'Pago recibido', amount: '$2,300', date: '08:55 AM', type: 'pago' }
  ];

  const getActivityColor = (type) => {
    switch(type) {
      case 'venta': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inventario': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'mesa': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pago': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar reutilizable */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Encabezado con saludo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bienvenido de vuelta 👋
            </h1>
            <p className="text-slate-400">
              Aquí está el resumen de tu negocio hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Stats Cards con diseño mejorado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-slate-400 text-sm mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Accesos Rápidos - 2 columnas */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4">Accesos Rápidos</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickAccess.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(item.path)}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-800 transition-all text-left group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actividad Reciente - 1 columna */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div
                      key={activity.id}
                      className="pb-4 border-b border-slate-800 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-slate-300 text-sm flex-1">{activity.action}</p>
                        <span className="text-slate-500 text-xs ml-2">{activity.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getActivityColor(activity.type)}`}>
                          {activity.type}
                        </span>
                        <span className="text-white font-semibold">{activity.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/resumenes')}
                  className="w-full mt-4 py-2 text-center text-sm text-slate-400 hover:text-white transition"
                >
                  Ver toda la actividad →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}