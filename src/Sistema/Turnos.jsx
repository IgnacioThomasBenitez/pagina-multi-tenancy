import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit, X, Trash2, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
// Importar el Sidebar reutilizable
import Sidebar from '../components/Sidebar';


export default function TurnosManager() {
  /* =========================
     ESTADOS
  ========================== */
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTurnoDetail, setShowTurnoDetail] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-05-20');
  const [selectedLocation, setSelectedLocation] = useState('Local');
  const [selectedStatus, setSelectedStatus] = useState('En atención');

  // Horarios de atención por día
  const [schedules, setSchedules] = useState({
    Lunes: [{ start: '09:00', end: '13:00' }],
    Martes: [],
    Miercoles: [{ start: '15:00', end: '20:00' }],
    Jueves: [],
    Viernes: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }],
    Sabado: [],
    Domingo: []
  });

  // Turnos del día
  const [turnos, setTurnos] = useState([
    { id: 23, fecha: '20/05/2026', hora: '15:30', tipo: 'Corte', estado: 'Pendiente', cliente: 'Juan Pérez' },
    { id: 24, fecha: '20/05/2026', hora: '16:00', tipo: 'Barba', estado: 'En atención', cliente: 'María López' },
    { id: 25, fecha: '20/05/2026', hora: '16:30', tipo: 'Corte + Barba', estado: 'Finalizado', cliente: 'Carlos García' }
  ]);

  /* =========================
     FUNCIONES - Gestión de horarios
  ========================== */
  const addSchedule = (day) => {
    setSchedules({
      ...schedules,
      [day]: [...schedules[day], { start: '', end: '' }]
    });
  };

  const removeSchedule = (day, index) => {
    setSchedules({
      ...schedules,
      [day]: schedules[day].filter((_, i) => i !== index)
    });
  };

  const updateSchedule = (day, index, field, value) => {
    const updated = [...schedules[day]];
    updated[index][field] = value;
    setSchedules({ ...schedules, [day]: updated });
  };

  /* =========================
     FUNCIONES - Gestión de turnos
  ========================== */
  const getStatusColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'bg-orange-500/20 text-orange-400';
      case 'En atención': return 'bg-yellow-500/20 text-yellow-400';
      case 'Finalizado': return 'bg-green-500/20 text-green-400';
      case 'Cancelado': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (estado) => {
    switch(estado) {
      case 'Pendiente': return <AlertCircle size={16} />;
      case 'En atención': return <Clock size={16} />;
      case 'Finalizado': return <CheckCircle size={16} />;
      case 'Cancelado': return <XCircle size={16} />;
      default: return null;
    }
  };

  // Estadísticas
  const turnosDelDia = turnos.length;
  const atendidos = turnos.filter(t => t.estado === 'Finalizado').length;
  const pendientes = turnos.filter(t => t.estado === 'Pendiente').length;
  const cancelados = turnos.filter(t => t.estado === 'Cancelado').length;

  /* =========================
     UI - Interfaz
  ========================== */
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Turnos</h1>
          <p className="text-slate-400">Gestión de turnos y horarios de atención</p>
        </div>

        {/* Botón configurar horarios */}
        <div className="mb-6">
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2"
          >
            <Clock size={20} />
            Configurar Horarios
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Turnos del día</p>
            <p className="text-3xl font-bold">{turnosDelDia}</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
              <CheckCircle size={16} />
              <p>Atendidos</p>
            </div>
            <p className="text-3xl font-bold">{atendidos}</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
              <AlertCircle size={16} />
              <p>Pendientes</p>
            </div>
            <p className="text-3xl font-bold">{pendientes}</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
              <XCircle size={16} />
              <p>Cancelados</p>
            </div>
            <p className="text-3xl font-bold">{cancelados}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
          <div className="flex gap-4 items-center">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            />
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            >
              <option>Local</option>
              <option>Sucursal 1</option>
              <option>Sucursal 2</option>
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            >
              <option>En atención</option>
              <option>Pendiente</option>
              <option>Finalizado</option>
              <option>Cancelado</option>
            </select>
            <input 
              type="text"
              placeholder="Buscar cliente"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Tabla de turnos */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr className="text-left text-slate-400 text-sm">
                <th className="p-4">N°</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id} className="border-t border-slate-700 hover:bg-slate-750 transition">
                  <td className="p-4">{turno.id}</td>
                  <td className="p-4">{turno.fecha}</td>
                  <td className="p-4">{turno.hora}</td>
                  <td className="p-4">{turno.tipo}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(turno.estado)}`}>
                      {getStatusIcon(turno.estado)}
                      {turno.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => {
                        setSelectedTurno(turno);
                        setShowTurnoDetail(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL - Configuración de horarios */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Configuración de horarios</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {Object.keys(schedules).map((day) => (
                <div key={day} className="border-b border-slate-700 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{day}</h3>
                    <button 
                      onClick={() => addSchedule(day)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      + Agregar horario
                    </button>
                  </div>

                  {schedules[day].length === 0 ? (
                    <p className="text-slate-500 text-sm">Sin atención</p>
                  ) : (
                    <div className="space-y-2">
                      {schedules[day].map((schedule, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input 
                            type="time"
                            value={schedule.start}
                            onChange={(e) => updateSchedule(day, index, 'start', e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                          />
                          <span className="text-slate-400">-</span>
                          <input 
                            type="time"
                            value={schedule.end}
                            onChange={(e) => updateSchedule(day, index, 'end', e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                          />
                          <button 
                            onClick={() => removeSchedule(day, index)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
                Cancelar
              </button>
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Detalle del turno */}
      {showTurnoDetail && selectedTurno && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Detalle del Turno</h2>
              <button onClick={() => setShowTurnoDetail(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-slate-400 text-sm">N°: <span className="text-white font-medium">{selectedTurno.id}</span></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Cliente: <span className="text-white font-medium">{selectedTurno.cliente}</span></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Fecha: <span className="text-white font-medium">{selectedTurno.fecha}</span></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Hora: <span className="text-white font-medium">{selectedTurno.hora}</span></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Tipo: <span className="text-white font-medium">{selectedTurno.tipo}</span></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Estado:</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2 ${getStatusColor(selectedTurno.estado)}`}>
                  {getStatusIcon(selectedTurno.estado)}
                  {selectedTurno.estado}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Edit size={18} />
                Editar
              </button>
              <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <X size={18} />
                Cancelar
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                Iniciar atención
              </button>
              <button onClick={() => setShowTurnoDetail(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg transition font-medium">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}