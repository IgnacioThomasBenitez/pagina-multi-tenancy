import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Globe } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const TenantAuthSystem = () => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState('register'); // 'register' o 'login'
  const [showPassword, setShowPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    businessType: '',
    domain: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    domain: ''
  });

  const businessTypes = [
    { id: 'barberia', name: 'Barbería', emoji: '💈' },
    { id: 'kiosco', name: 'Kiosco', emoji: '🏪' },
    { id: 'ropa', name: 'Ropa', emoji: '👗' },
    { id: 'tecnologia', name: 'Tecnología', emoji: '💻' },
    { id: 'restaurante', name: 'Restaurante', emoji: '🍔' }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registro:', registerData);
    navigate("/administrar");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', loginData);
    navigate("/administrar");
  };

  const handleBusinessTypeSelect = (typeId) => {
    setRegisterData({ ...registerData, businessType: typeId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header Buttons */}
        <div className="flex gap-3 mb-6 justify-center">
          <button 
            onClick={() => setCurrentView('register')}
            className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition text-sm ${
              currentView === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>👤</span> Registro
          </button>

          <button 
            onClick={() => setCurrentView('login')}
            className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition text-sm ${
              currentView === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>→</span> Iniciar sesión
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700">

          {/* REGISTRO */}
          {currentView === 'register' && (
            <>
              <div className="flex justify-center mb-4">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition text-sm">
                  <span>✨</span> Crear cuenta
                </button>
              </div>

              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-white mb-1">
                  Comenzá tu negocio digital
                </h1>
                <p className="text-slate-400 text-sm">
                  Gratis, sin tarjeta de crédito
                </p>
              </div>

              <div className="space-y-3">
                {/* EMAIL */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-10 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* TIPO NEGOCIO */}
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    Tipo de negocio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {businessTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleBusinessTypeSelect(type.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          registerData.businessType === type.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
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

                {/* DOMINIO */}
                <div>
                  <label className="block text-white font-semibold mb-1.5 text-sm">
                    Tu dominio
                  </label>
                  <div className="relative">
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

          {/* LOGIN */}
          {currentView === 'login' && (
            <>
              <div className="flex justify-center mb-4">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition text-sm">
                  <span>🔐</span> Acceder
                </button>
              </div>

              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-white mb-1">
                  Bienvenido de vuelta
                </h1>
                <p className="text-slate-400 text-sm">
                  Ingresa a tu negocio digital
                </p>
              </div>

              <div className="space-y-3">
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

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
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm mt-4"
                >
                  Iniciar sesión
                  <span>→</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantAuthSystem;
