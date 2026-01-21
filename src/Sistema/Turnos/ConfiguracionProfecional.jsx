import React, { useState } from 'react';
import { Plus, Trash2, Upload, Image, Save, X, Clock, UserCheck, Settings, FileText, Award, AlertTriangle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

// Modal de Confirmación
function ConfirmModal({ isOpen, onConfirm, onCancel, professional }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-700 animate-in">
        <div className="flex items-center justify-center w-16 h-16 bg-red-500 bg-opacity-20 rounded-full mx-auto mb-4">
          <AlertTriangle className="text-red-500" size={32} />
        </div>
        
        <h3 className="text-2xl font-bold text-white text-center mb-2">
          ¿Eliminar profesional?
        </h3>
        
        <p className="text-gray-400 text-center mb-6">
          ¿Estás seguro que deseas eliminar a{' '}
          <span className="text-white font-semibold">
            {professional?.name || 'este profesional'}
          </span>
          ? Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceConfigStyle4() {
  const [professionals, setProfessionals] = useState([
    { id: 1, photo: null, name: 'Juan Pérez', specialty: 'Barbero Senior', state: 'Activo', services: '', schedule: '' },
    { id: 2, photo: null, name: 'María García', specialty: 'Estilista', state: 'Activo', services: '', schedule: '' }
  ]);
  
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, professional: null });

  const addProfessional = () => {
    const newProfessional = { 
      id: Date.now(), 
      photo: null, 
      name: `Profesional ${professionals.length + 1}`, 
      specialty: '',
      state: 'Activo',
      services: '',
      schedule: ''
    };
    setProfessionals([...professionals, newProfessional]);
    setSelectedProfessional(newProfessional);
  };

  const removeProfessional = () => {
    const id = confirmModal.professional?.id;
    if (professionals.length > 1 && id) {
      setProfessionals(professionals.filter(p => p.id !== id));
      if (selectedProfessional?.id === id) {
        setSelectedProfessional(null);
      }
    }
    setConfirmModal({ isOpen: false, professional: null });
  };

  const handleDeleteClick = (e, professional) => {
    e.stopPropagation();
    setConfirmModal({ isOpen: true, professional });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedProfessional) {
      const updatedProfessional = { ...selectedProfessional, [name]: value };
      setSelectedProfessional(updatedProfessional);
      setProfessionals(professionals.map(p => 
        p.id === selectedProfessional.id ? updatedProfessional : p
      ));
    }
  };

  const handlePhotoUpload = (file) => {
    if (file && selectedProfessional) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfessional = { ...selectedProfessional, photo: reader.result };
        setSelectedProfessional(updatedProfessional);
        setProfessionals(professionals.map(p => 
          p.id === selectedProfessional.id ? updatedProfessional : p
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardPhotoUpload = (professional, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfessionals = professionals.map(p => 
          p.id === professional.id ? { ...p, photo: reader.result } : p
        );
        setProfessionals(updatedProfessionals);
        if (selectedProfessional?.id === professional.id) {
          setSelectedProfessional({ ...professional, photo: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    if (selectedProfessional) {
      const updatedProfessional = { ...selectedProfessional, photo: null };
      setSelectedProfessional(updatedProfessional);
      setProfessionals(professionals.map(p => 
        p.id === selectedProfessional.id ? updatedProfessional : p
      ));
    }
  };

  const handleSelectProfessional = (professional) => {
    setSelectedProfessional(professional);
  };

  const handleSave = () => {
    if (!selectedProfessional) {
      alert('⚠️ Selecciona un profesional para guardar');
      return;
    }
    
    if (!selectedProfessional.name.trim()) {
      alert('⚠️ El nombre del profesional es requerido');
      return;
    }
    
    console.log('Guardando configuración:', professionals);
    alert('✅ Configuración guardada exitosamente');
  };

  const handleCancel = () => {
    setSelectedProfessional(null);
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
              <h1 className="text-4xl font-bold text-white mb-2">Configuración / Profesionales</h1>
              <p className="text-gray-400">Administra y personaliza los profesionales de tu negocio</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Profesionales</p>
                    <p className="text-white text-3xl font-bold mt-1">{professionals.length}</p>
                  </div>
                  <UserCheck className="text-blue-200" size={40} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Activos</p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {professionals.filter(p => p.state === 'Activo').length}
                    </p>
                  </div>
                  <Award className="text-green-200" size={40} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Con Foto</p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {professionals.filter(p => p.photo).length}
                    </p>
                  </div>
                  <Settings className="text-purple-200" size={40} />
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="grid grid-cols-12 gap-0">
                {/* Panel central - Profesionales */}
                <div className="col-span-7 p-8 border-r border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <UserCheck size={24} className="text-blue-400" />
                      Lista de Profesionales
                    </h2>
                    <button
                      onClick={addProfessional}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Plus size={18} />
                      <span className="text-sm font-medium">Nuevo</span>
                    </button>
                  </div>

                  {/* Grid de profesionales */}
                  <div className="grid grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {professionals.map((professional) => (
                      <div 
                        key={professional.id} 
                        onClick={() => handleSelectProfessional(professional)}
                        className={`bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 relative group hover:shadow-xl transition-all cursor-pointer border-2 ${
                          selectedProfessional?.id === professional.id ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent'
                        }`}
                      >
                        <button
                          onClick={(e) => handleDeleteClick(e, professional)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 z-10"
                          title="Eliminar profesional"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="relative mb-3">
                          {professional.photo ? (
                            <label className="cursor-pointer block">
                              <img 
                                src={professional.photo} 
                                alt="Preview" 
                                className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleCardPhotoUpload(professional, e.target.files[0])}
                              />
                            </label>
                          ) : (
                            <label className="bg-gray-600 bg-opacity-30 border-2 border-dashed border-gray-500 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 hover:bg-opacity-50 transition-all">
                              <Image size={28} className="text-gray-400 mb-1" />
                              <span className="text-xs text-gray-400">Añadir foto</span>
                              
                            </label>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="text-white font-semibold text-sm truncate">
                            {professional.name || 'Sin nombre'}
                          </div>
                          <div className="text-gray-400 text-xs truncate">
                            {professional.specialty || 'Sin especialidad'}
                          </div>
                          <div className="flex items-center justify-start">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              professional.state === 'Activo' 
                                ? 'bg-green-500 text-white' 
                                : professional.state === 'Inactivo'
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-orange-500 text-white'
                            }`}>
                              {professional.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {professionals.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <UserCheck size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg">No hay profesionales configurados</p>
                      <p className="text-sm mt-2">Haz clic en "Nuevo" para agregar uno</p>
                    </div>
                  )}
                </div>

                {/* Panel derecho - Formulario detallado */}
                <div className="col-span-5 bg-gradient-to-br from-gray-750 to-gray-850 p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-400" />
                    Detalles del Profesional
                  </h3>
                  
                  {selectedProfessional ? (
                    <>
                      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4 mb-6">
                        <p className="text-blue-300 text-sm">
                          <span className="font-semibold">Editando:</span> {selectedProfessional.name || 'Profesional sin nombre'}
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Foto de referencia
                          </label>
                          {selectedProfessional.photo ? (
                            <div className="relative">
                              <label className="cursor-pointer block">
                                <img 
                                  src={selectedProfessional.photo} 
                                  alt="Preview" 
                                  className="w-full h-40 object-cover rounded-xl hover:opacity-80 transition-opacity"
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handlePhotoUpload(e.target.files[0])}
                                />
                              </label>
                              <button
                                onClick={removePhoto}
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
                                onChange={(e) => handlePhotoUpload(e.target.files[0])}
                              />
                            </label>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={selectedProfessional.name}
                            onChange={handleInputChange}
                            placeholder="Nombre del profesional"
                            className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Especialidad
                          </label>
                          <input
                            type="text"
                            name="specialty"
                            value={selectedProfessional.specialty}
                            onChange={handleInputChange}
                            placeholder="Ej: Barbero, Estilista, Colorista"
                            className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Estado
                          </label>
                          <select
                            name="state"
                            value={selectedProfessional.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                          >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="Vacaciones">Vacaciones</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Servicios que realiza
                          </label>
                          <textarea
                            name="services"
                            value={selectedProfessional.services}
                            onChange={handleInputChange}
                            placeholder="Ej: Corte de cabello, Peinado, Coloración"
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Horarios
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea
                              name="schedule"
                              value={selectedProfessional.schedule}
                              onChange={handleInputChange}
                              placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                              rows="2"
                              className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all placeholder-gray-500 resize-none"
                            />
                          </div>
                        </div>

                        {/* Botones de acción */}
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
                    </>
                  ) : (
                    <div className="bg-gray-700 bg-opacity-30 border border-gray-600 rounded-lg p-4 mb-6">
                      <p className="text-gray-400 text-sm">
                        Selecciona un profesional para editar sus detalles
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nota informativa */}
            <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-30 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-blue-200 text-sm">
                <span className="font-semibold">💡 Consejo:</span> Haz clic en cualquier imagen para cambiarla. Asigna servicios y horarios específicos para cada profesional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        professional={confirmModal.professional}
        onConfirm={removeProfessional}
        onCancel={() => setConfirmModal({ isOpen: false, professional: null })}
      />
    </div>
  );
}