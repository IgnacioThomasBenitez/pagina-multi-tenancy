// Importación de React y el hook useState para manejar el estado del componente
import React, { useState } from 'react';

// Importación de iconos desde lucide-react para usar en la interfaz
import { Eye, EyeOff, Mail, Lock, Globe } from 'lucide-react';

// Componente principal del sistema de autenticación multi-tenant
const TenantAuthSystem = () => {
  // Estado para controlar qué vista mostrar: 'register' (registro) o 'login' (inicio de sesión)
  const [currentView, setCurrentView] = useState('register');
  
  // Estado para mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Estado para almacenar los datos del formulario de registro
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    businessType: '', // Tipo de negocio seleccionado
    domain: '' // Dominio personalizado del tenant
  });

  // Estado para almacenar los datos del formulario de inicio de sesión
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    domain: '' // Dominio del tenant al que se quiere acceder
  });

  // Array con los tipos de negocio disponibles para seleccionar en el registro
  const businessTypes = [
    { id: 'barberia', name: 'Barbería', emoji: '💈' },
    { id: 'kiosco', name: 'Kiosco', emoji: '🏪' },
    { id: 'ropa', name: 'Ropa', emoji: '👗' },
    { id: 'tecnologia', name: 'Tecnología', emoji: '💻' },
    { id: 'restaurante', name: 'Restaurante', emoji: '🍔' }
  ];

  // Función para manejar el envío del formulario de registro
  const handleRegister = (e) => {
    e.preventDefault(); // Prevenir recarga de página
    console.log('Registro:', registerData); // Log de los datos (temporal)
    alert('Registro exitoso! Redirigiendo a administración...');
  };

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault(); // Prevenir recarga de página
    console.log('Login:', loginData); // Log de los datos (temporal)
    alert('Login exitoso! Redirigiendo a administración...');
  };

  // Función para navegar a diferentes secciones (simulación)
  const handleNavigate = (section) => {
    alert(`Navegando a: ${section}`);
    console.log('Navegando a:', section);
  };

  // Función para actualizar el tipo de negocio seleccionado en el registro
  const handleBusinessTypeSelect = (typeId) => {
    setRegisterData({ ...registerData, businessType: typeId });
  };

  return (
    // Contenedor principal con gradiente de fondo y centrado
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Botones de navegación entre Registro e Inicio de sesión */}
        <div className="flex gap-3 mb-6 justify-center">
          {/* Botón de Registro */}
          <button 
            onClick={() => setCurrentView('register')}
            className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition text-sm ${
              currentView === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' // Estilo activo
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600' // Estilo inactivo
            }`}
          >
            <span>👤</span> Registro
          </button>

          {/* Botón de Iniciar sesión */}
          <button 
            onClick={() => setCurrentView('login')}
            className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition text-sm ${
              currentView === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' // Estilo activo
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600' // Estilo inactivo
            }`}
          >
            <span>→</span> Iniciar sesión
          </button>
        </div>

        {/* Tarjeta principal que contiene los formularios */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700">

          {/* FORMULARIO DE REGISTRO - Se muestra cuando currentView es 'register' */}
          {currentView === 'register' && (
            <>
              {/* Botón decorativo de título */}
              <div className="flex justify-center mb-4">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition text-sm">
                  <span>✨</span> Crear cuenta
                </button>
              </div>

              {/* Título y descripción del formulario de registro */}
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-white mb-1">
                  Comenzá tu negocio digital
                </h1>
                <p className="text-slate-400 text-sm">
                  Gratis, sin tarjeta de crédito
                </p>
              </div>

              {/* Contenedor de campos del formulario */}
              <div className="space-y-3">
                {/* Campo de EMAIL */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Email
                  </label>
                  <div className="relative">
                    {/* Icono de email */}
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={registerData.email}
                      // Actualizar el estado con el valor ingresado
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Campo de CONTRASEÑA */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Contraseña
                  </label>
                  <div className="relative">
                    {/* Icono de candado */}
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      // Tipo dinámico según si se muestra la contraseña o no
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-10 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                    {/* Botón para mostrar/ocultar contraseña */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Selector de TIPO DE NEGOCIO */}
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    Tipo de negocio
                  </label>
                  {/* Grid de 3 columnas con los tipos de negocio */}
                  <div className="grid grid-cols-3 gap-2">
                    {businessTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleBusinessTypeSelect(type.id)}
                        // Estilo condicional según si está seleccionado
                        className={`p-3 rounded-lg border-2 transition-all ${
                          registerData.businessType === type.id
                            ? 'border-blue-500 bg-blue-500/10' // Seleccionado
                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500' // No seleccionado
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.emoji}</div>
                        <div className="text-white font-medium text-xs">
                          {type.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campo de DOMINIO personalizado */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Tu dominio
                  </label>
                  <div className="relative">
                    {/* Icono de globo */}
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="minegocio"
                      value={registerData.domain}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, domain: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Botón de envío del formulario de registro */}
                <button
                  onClick={handleRegister}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm mt-4"
                >
                  Crear mi negocio
                  <span>→</span>
                </button>
              </div>
            </>
          )}

          {/* FORMULARIO DE LOGIN - Se muestra cuando currentView es 'login' */}
          {currentView === 'login' && (
            <>
              {/* Botón decorativo de título */}
              <div className="flex justify-center mb-4">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition text-sm">
                  <span>🔐</span> Acceder
                </button>
              </div>

              {/* Título y descripción del formulario de login */}
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-white mb-1">
                  Bienvenido de vuelta
                </h1>
                <p className="text-slate-400 text-sm">
                  Ingresa a tu negocio digital
                </p>
              </div>

              {/* Contenedor de campos del formulario */}
              <div className="space-y-3">
                {/* Campo de EMAIL */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Campo de CONTRASEÑA */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-10 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                    {/* Botón para mostrar/ocultar contraseña */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Campo de DOMINIO - necesario para identificar el tenant */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Dominio
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="minegocio"
                      value={loginData.domain}
                      onChange={(e) =>
                        setLoginData({ ...loginData, domain: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Botón de envío del formulario de login */}
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm mt-4"
                >
                  Iniciar sesión
                  <span>→</span>
                </button>

                {/* Separador con texto */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-800/50 text-slate-400">Acceso para personal</span>
                  </div>
                </div>

                {/* Grid de botones para personal/encargado */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigate('configuracionservicio')}
                    className="py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>📦</span> Configuracion Servicio
                  </button>
                  
                  <button
                    onClick={() => handleNavigate('Ventas')}
                    className="py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>💰</span> Ventas
                  </button>
                  
                  <button
                    onClick={() => handleNavigate('Caja')}
                    className="py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🏦</span> Caja
                  </button>
                  
                  <button
                    onClick={() => handleNavigate('Reportes')}
                    className="py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>📊</span> Reportes
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Exportación del componente para su uso en otras partes de la aplicación
export default TenantAuthSystem;