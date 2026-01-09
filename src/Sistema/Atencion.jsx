import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, DollarSign, Menu, Home, Settings, BarChart, Users, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    cliente: '',
    telefono: '',
    fecha: '',
    hora: ''
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    { id: 1, nombre: 'Corte de Cabello', precio: 500, icon: '✂️', color: 'from-blue-500 to-blue-600' },
    { id: 2, nombre: 'Manicure', precio: 350, icon: '💅', color: 'from-pink-500 to-pink-600' },
    { id: 3, nombre: 'Tratamiento Facial', precio: 800, icon: '✨', color: 'from-purple-500 to-purple-600' },
    { id: 4, nombre: 'Masaje Relajante', precio: 400, icon: '💆', color: 'from-green-500 to-green-600' },
    { id: 5, nombre: 'Depilación', precio: 600, icon: '🌟', color: 'from-yellow-500 to-yellow-600' },
    { id: 6, nombre: 'Pedicure', precio: 300, icon: '🦶', color: 'from-red-500 to-red-600' }
  ];

  const menuItems = [
    { icon: Home, label: 'Inicio', active: true },
    { icon: Calendar, label: 'Agenda' },
    { icon: Users, label: 'Clientes' },
    { icon: BarChart, label: 'Reportes' },
    { icon: Settings, label: 'Configuración' }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
    setFormData({ cliente: '', telefono: '', fecha: '', hora: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Turno confirmado:', { ...formData, servicio: selectedService });
    setShowModal(false);
  };

  const formatDateTime = (date) => {
    return {
      date: date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(currentTime);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar Mejorado */}
      <div className="w-72 bg-gray-900/50 backdrop-blur-xl border-r border-gray-700/50 p-6 flex flex-col">
        {/* Logo/Avatar */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 flex items-center justify-center mx-auto shadow-xl">
            <span className="text-4xl">💼</span>
          </div>
          <h2 className="text-white text-xl font-bold text-center">Mi Negocio</h2>
          <p className="text-gray-400 text-sm text-center mt-1">Sistema de Turnos</p>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all mt-4">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Mejorado */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Servicios Disponibles</h1>
                <p className="text-gray-400">Selecciona un servicio para agendar un turno</p>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm flex items-center gap-2 justify-end mb-1">
                  <Calendar size={16} />
                  {date}
                </div>
                <div className="text-white text-2xl font-bold flex items-center gap-2 justify-end">
                  <Clock size={20} />
                  {time}
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid Mejorado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className={`bg-gradient-to-br ${service.color} rounded-xl aspect-square mb-4 flex items-center justify-center text-6xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{service.nombre}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Precio</span>
                  <span className="text-green-400 font-bold text-xl">${service.precio}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Mejorado */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 w-full max-w-md relative shadow-2xl border border-gray-700/50 animate-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2 transition-all"
            >
              <X size={24} />
            </button>

            <h3 className="text-3xl font-bold text-white mb-2">
              Agendar Turno
            </h3>
            <p className="text-gray-400 mb-6">Complete los datos del cliente</p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                  <User size={18} />
                  Cliente
                </label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                  <Phone size={18} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                  <Calendar size={18} />
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                  <Clock size={18} />
                  Hora
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className={`bg-gradient-to-r ${selectedService?.color} rounded-xl p-5 mt-6 shadow-lg`}>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Servicio seleccionado</p>
                    <p className="font-bold text-lg">{selectedService?.nombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Precio</p>
                    <p className="font-bold text-2xl">${selectedService?.precio}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-4 font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-6"
              >
                Confirmar Turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;