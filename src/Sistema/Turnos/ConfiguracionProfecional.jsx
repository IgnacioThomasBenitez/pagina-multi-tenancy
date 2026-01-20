import React, { useState } from 'react';
import { Plus, Trash2, Upload, Image, Save, X, DollarSign, Clock, UserCheck, Settings, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

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

  const [selectedService, setSelectedService] = useState(null);

  const addService = () => {
    const newService = { 
      id: Date.now(), 
      refPhoto: null, 
      name: '', 
      price: '' 
    };
    setServices([...services, newService]);
    setSelectedService(newService);
  };

  const removeService = (id) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id));
      if (selectedService?.id === id) {
        setSelectedService(null);
      }
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
    alert('✅ Configuración guardada exitosamente');
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
      setSelectedService(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="flex h-screen">
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-8xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Configuración de Servicios</h1>
              <p className="text-gray-400">Administra y personaliza los servicios de tu negocio</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Servicios</p>
                    <p className="text-white text-3xl font-bold mt-1">{services.length}</p>
                  </div>
                  <Settings className="text-blue-200" size={40} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Servicios Activos</p>
                    <p className="text-white text-3xl font-bold mt-1">{services.length}</p>
                  </div>
                  <UserCheck className="text-green-200" size={40} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Precio Promedio</p>
                    <p className="text-white text-3xl font-bold mt-1">$0</p>
                  </div>
                  <DollarSign className="text-purple-200" size={40} />
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="grid grid-cols-12 gap-0">
                {/* Panel central - Servicios */}
                <div className="col-span-7 p-8 border-r border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Settings size={24} className="text-blue-400" />
                      Lista de Servicios
                    </h2>
                    <button
                      onClick={addService}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Plus size={18} />
                      <span className="text-sm font-medium">Nuevo</span>
                    </button>
                  </div>

                  {/* Grid de servicios */}
                  <div className="grid grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {services.map((service) => (
                      <div 
                        key={service.id} 
                        onClick={() => setSelectedService(service)}
                        className={`bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 relative group hover:shadow-xl transition-all cursor-pointer border-2 ${
                          selectedService?.id === service.id ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent'
                        }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeService(service.id);
                          }}
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
                                className="w-full h-28 object-cover rounded-lg"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleServiceChange(service.id, 'refPhoto', null);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="bg-gray-600 bg-opacity-30 border-2 border-dashed border-gray-500 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 hover:bg-opacity-50 transition-all">
                              <Image size={24} className="text-gray-400 mb-1" />
                              <span className="text-xs text-gray-400">Añadir foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleFileUpload(service.id, e.target.files[0])}
                              />
                            </label>
                          )}
                        </div>
                        
                      </div>
                    ))}
                  </div>

                  {services.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Settings size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg">No hay servicios configurados</p>
                      <p className="text-sm mt-2">Haz clic en "Nuevo" para agregar uno</p>
                    </div>
                  )}
                </div>

                {/* Panel derecho - Formulario detallado */}
                <div className="col-span-5 bg-gradient-to-br from-gray-750 to-gray-850 p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-400" />
                    Detalles del Servicio
                  </h3>
                  
                  {selectedService ? (
                    <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4 mb-6">
                      <p className="text-blue-300 text-sm">
                        <span className="font-semibold">Editando:</span> {selectedService.name || 'Servicio sin nombre'}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-700 bg-opacity-30 border border-gray-600 rounded-lg p-4 mb-6">
                      <p className="text-gray-400 text-sm">
                        Selecciona un servicio para editar sus detalles
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre de atención
                      </label>
                      <input
                        type="text"
                        name="nombreAtencion"
                        value={formData.nombreAtencion}
                        onChange={handleInputChange}
                        placeholder="Ej: Corte de cabello premium"
                        className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Foto de referencia
                      </label>
                      {formData.fotoReferencia ? (
                        <div className="relative">
                          <img 
                            src={formData.fotoReferencia} 
                            alt="Preview" 
                            className="w-full h-40 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => setFormData({ ...formData, fotoReferencia: null })}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-900 hover:bg-opacity-10 transition-all">
                          <Upload size={32} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">Haz clic para subir imagen</span>
                          <span className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</span>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Precio
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="precio"
                          value={formData.precio}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profesionales asignados
                      </label>
                      <div className="relative">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="profesionales"
                          value={formData.profesionales}
                          onChange={handleInputChange}
                          placeholder="Seleccionar profesionales"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duración mínima
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="duracionMin"
                          value={formData.duracionMin}
                          onChange={handleInputChange}
                          placeholder="30"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-30 rounded-xl border border-gray-600">
                      <span className="text-sm font-medium text-gray-300">Estado del servicio</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="activo"
                          checked={formData.activo}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-300">
                          {formData.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </label>
                    </div>

                    {/* Botones de acción mejorados */}
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Save size={20} />
                        Guardar
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
            <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-30 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-blue-200 text-sm">
                <span className="font-semibold">💡 Consejo:</span> Los cambios se guardarán automáticamente al presionar el botón "Guardar". Asegúrate de completar todos los campos requeridos antes de guardar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}