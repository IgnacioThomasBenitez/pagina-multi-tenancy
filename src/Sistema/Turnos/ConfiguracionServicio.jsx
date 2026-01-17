import React, { useState } from 'react';
import { Plus, Trash2, Upload, Image, Save, X, Menu, Home, Calendar, Settings, Users, FileText, LogOut } from 'lucide-react';

export default function ServiceConfigStyle3() {
  const [services, setServices] = useState([
    { id: 1, refPhoto: null, name: '', price: '' },
    { id: 2, refPhoto: null, name: '', price: '' }
  ]);
  
  const [formData, setFormData] = useState({
    nombreAtencion: '',
    fotoReferencia: null,
    precio: '',
    profesionales: '',
    duracionMin: '',
    activo: true
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Inicio', active: false },
    { icon: Calendar, label: 'Turnos', active: false },
    { icon: Settings, label: 'Servicios', active: true },
    { icon: Users, label: 'Clientes', active: false },
    { icon: FileText, label: 'Reportes', active: false },
  ];

  const addService = () => {
    setServices([...services, { 
      id: Date.now(), 
      refPhoto: null, 
      name: '', 
      price: '' 
    }]);
  };

  const removeService = (id) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleServiceChange = (id, field, value) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleFileUpload = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleServiceChange(id, 'refPhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainPhotoUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fotoReferencia: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Guardando configuración:', { services, formData });
    alert('Configuración guardada exitosamente');
  };

  const handleCancel = () => {
    if (confirm('¿Deseas cancelar los cambios?')) {
      setFormData({
        nombreAtencion: '',
        fotoReferencia: null,
        precio: '',
        profesionales: '',
        duracionMin: '',
        activo: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="flex h-screen">
        {/* Sidebar mejorado */}
        <div className={`bg-gradient-to-b from-gray-800 to-gray-900 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl`}>
          {/* Header del sidebar */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-white font-bold text-xl">Mi Negocio</h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-700">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-all">
              <LogOut size={20} />
              {sidebarOpen && <span>Cerrar sesión</span>}
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Configuración de Servicios</h1>
              <p className="text-gray-600">Administra los servicios de tu negocio</p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-0">
                {/* Panel central - Servicios */}
                <div className="col-span-7 bg-gradient-to-br from-gray-700 to-gray-800 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Settings size={24} />
                      Lista de Servicios
                    </h2>
                    <div className="text-sm text-gray-300 bg-gray-600 px-3 py-1 rounded-full">
                      {new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  {/* Grid de servicios */}
                  <div className="grid grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {services.map((service) => (
                      <div key={service.id} className="bg-white rounded-xl p-4 relative group hover:shadow-xl transition-shadow">
                        <button
                          onClick={() => removeService(service.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 z-10"
                          title="Eliminar servicio"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="relative mb-3">
                          {service.refPhoto ? (
                            <div className="relative">
                              <img 
                                src={service.refPhoto} 
                                alt="Preview" 
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => handleServiceChange(service.id, 'refPhoto', null)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                              <Image size={20} className="text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">Foto de referencia</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(service.id, e.target.files[0])}
                              />
                            </label>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nombre del servicio"
                            value={service.name}
                            onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <input
                            type="number"
                            placeholder="$"
                            value={service.price}
                            onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                            className="w-24 px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón agregar */}
                  <button
                    onClick={addService}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                {/* Panel derecho - Formulario detallado */}
                <div className="col-span-5 bg-gradient-to-br from-gray-50 to-white p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FileText size={20} />
                    Detalles del Servicio
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de atención
                      </label>
                      <input
                        type="text"
                        name="nombreAtencion"
                        value={formData.nombreAtencion}
                        onChange={handleInputChange}
                        placeholder="Ej: Corte de cabello premium"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto de referencia
                      </label>
                      {formData.fotoReferencia ? (
                        <div className="relative">
                          <img 
                            src={formData.fotoReferencia} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => setFormData({ ...formData, fotoReferencia: null })}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Subir imagen</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleMainPhotoUpload(e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio
                      </label>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        placeholder="$0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profesionales asignados
                      </label>
                      <input
                        type="text"
                        name="profesionales"
                        value={formData.profesionales}
                        onChange={handleInputChange}
                        placeholder="Seleccionar profesionales"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración mínima (minutos)
                      </label>
                      <input
                        type="number"
                        name="duracionMin"
                        value={formData.duracionMin}
                        onChange={handleInputChange}
                        placeholder="30"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Estado del servicio</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="activo"
                          checked={formData.activo}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {formData.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </label>
                    </div>

                    {/* Botones de acción mejorados */}
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Save size={20} />
                        Guardar
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <X size={20} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota informativa */}
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-blue-800">
                <span className="font-semibold">Nota:</span> Los cambios se guardarán automáticamente al presionar el botón "Guardar". Asegúrate de completar todos los campos requeridos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}