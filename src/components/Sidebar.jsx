// Importación de React
import React, { useState } from 'react';
// Importación de iconos de lucide-react para la interfaz
import { 
  ShoppingCart, Package, BarChart3, Settings, LogOut, 
  FileText, DollarSign, TrendingUp, Truck, ShoppingBag,
  Users, Clock, CreditCard, ChevronDown, ChevronRight,
  UtensilsCrossed, Upload, Store
} from 'lucide-react';
// Hook para navegación entre rutas
import { useNavigate, useLocation } from "react-router-dom";

// Componente reutilizable del Sidebar
export default function Sidebar() {
  // Hook para manejar la navegación programática
  const navigate = useNavigate();
  // Hook para obtener la ruta actual
  const location = useLocation();
  // Estado para controlar secciones colapsadas
  const [collapsedSections, setCollapsedSections] = useState({});
  // Estado para la imagen del logo
  const [logoImage, setLogoImage] = useState(null);
  // Estado para mostrar selector de logo
  const [showLogoUpload, setShowLogoUpload] = useState(false);

  // Función para manejar la carga de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        setShowLogoUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };
   // Cargar logo guardado al iniciar
  React.useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('commerce_logo');
      if (savedLogo) {
        setLogoImage(savedLogo);
      }
    } catch (error) {
      console.log('No hay logo guardado');
    }
  }, []);

  // Función helper para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;

  // Función para toggle de secciones
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Configuración del menú con estructura mejorada
  const menuSections = [
    {
      id: 'Inicio',
      title: 'Inicio',
      items: [
        { path: '/administrar', label: 'Administrar', icon: BarChart3 }
      ]
    },

     // INFORMES
    {
      id: 'informes',
      title: 'Informes',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/resumenes', label: 'Resúmenes', icon: FileText }
      ]
    },

    // FINANZAS
    {
      id: 'finanzas',
      title: 'Finanzas',
      items: [
        { path: '/ventas', label: 'Registrar Ventas', icon: ShoppingCart },
        { path: '/contabilidad', label: 'Contabilidad', icon: DollarSign },
        { path: '/ingresos-egresos', label: 'Ingresos', icon: TrendingUp }
      ]
    },

    // STOCK
    {
      id: 'stock',
      title: 'Stock',
      items: [
        { path: '/inventario', label: 'Inventario', icon: Package },
        { path: '/atencion', label: 'Atención', icon: Truck },
        { path: '/compras', label: 'Compras', icon: ShoppingBag }
      ]
    },

    // ADMINISTRACIÓN
    {
      id: 'administracion',
      title: 'Administración',
      items: [
        { path: '/cocina', label: 'Cocina', icon: UtensilsCrossed },
        { path: '/mesas', label: 'Mesas', icon: UtensilsCrossed },
        { path: '/empleados', label: 'Empleados', icon: Users },
        { path: '/turnos', label: 'Turnos', icon: Clock },
        { path: '/metodos-pago', label: 'Métodos de Pago', icon: CreditCard },
        { path: '/configuracion', label: 'Información Fiscal', icon: Settings }
      ]
    }
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen">
      {/* Header del sidebar con logo y nombre del comercio */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Logo del comercio con imagen personalizable */}
          <div 
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg cursor-pointer relative group overflow-hidden"
            onClick={() => setShowLogoUpload(true)}
          >
            {logoImage ? (
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Store size={24} className="text-white" />
            )}
            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={16} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base truncate">Nombre del Comercio</h2>
            <p className="text-slate-400 text-xs">Sistema de gestión</p>
          </div>
        </div>
      </div>

      {/* Modal para cambiar logo */}
      {showLogoUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-slate-700">
            <h3 className="text-white font-bold text-lg mb-4">Cambiar Logo</h3>
            <div className="space-y-4">
              <label className="block">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                  <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                  <p className="text-slate-300 text-sm mb-1">Haz clic para subir una imagen</p>
                  <p className="text-slate-500 text-xs">PNG, JPG o GIF (máx. 2MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </label>
              {logoImage && (
                <button
                  onClick={() => {
                    setLogoImage(null);
                    setShowLogoUpload(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                >
                  Eliminar logo
                </button>
              )}
              <button
                onClick={() => setShowLogoUpload(false)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menú de navegación con scroll */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.id}>
            {/* Título de sección con opción de colapsar */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition"
            >
              <span>{section.title}</span>
              {collapsedSections[section.id] ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            
            {/* Items del menú */}
            {!collapsedSections[section.id] && (
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                        active 
                          ? 'bg-blue-600/20 text-blue-400 shadow-sm' 
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon 
                        size={18} 
                        className={`flex-shrink-0 ${
                          active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                      
                      {/* Indicador activo */}
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* Footer con Cerrar Sesión */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => {
            if (window.confirm('¿Estás seguro de cerrar sesión?')) {
              // Lógica de cerrar sesión
              navigate('/login');
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}