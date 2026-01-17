import React, { useState } from 'react';
import { Clock, Plus, Edit, X, Trash2, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

export default function TurnosManager() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTurnoDetail, setShowTurnoDetail] = useState(false);
  const [showAddTurnoModal, setShowAddTurnoModal] = useState(false);
  const [showEditTurnoModal, setShowEditTurnoModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-05-20');
  const [selectedLocation, setSelectedLocation] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const [schedules, setSchedules] = useState({
    Lunes: [{ start: '09:00', end: '13:00' }],
    Martes: [],
    Miercoles: [{ start: '15:00', end: '20:00' }],
    Jueves: [],
    Viernes: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }],
    Sabado: [],
    Domingo: []
  });

  const [turnos, setTurnos] = useState([
    { id: 23, fecha: '20/05/2026', hora: '15:30', tipo: 'Corte', estado: 'Pendiente', cliente: 'Juan Pérez', local: 'Local' },
    { id: 24, fecha: '20/05/2026', hora: '16:00', tipo: 'Barba', estado: 'En atención', cliente: 'María López', local: 'Local' },
    { id: 25, fecha: '20/05/2026', hora: '16:30', tipo: 'Corte + Barba', estado: 'Finalizado', cliente: 'Carlos García', local: 'Sucursal 1' },
    { id: 26, fecha: '20/05/2026', hora: '17:00', tipo: 'Corte', estado: 'Cancelado', cliente: 'Ana Martínez', local: 'Local' }
  ]);

  const [newTurno, setNewTurno] = useState({ fecha: '20/05/2026', hora: '', tipo: 'Corte', cliente: '', local: 'Local' });
  const [editTurno, setEditTurno] = useState(null);

  const addSchedule = (day) => setSchedules({...schedules, [day]: [...schedules[day], { start: '', end: '' }]});
  const removeSchedule = (day, idx) => setSchedules({...schedules, [day]: schedules[day].filter((_, i) => i !== idx)});
  const updateSchedule = (day, idx, field, val) => {
    const u = [...schedules[day]];
    u[idx][field] = val;
    setSchedules({ ...schedules, [day]: u });
  };

  const addTurno = () => {
    if (!newTurno.hora || !newTurno.cliente) return alert('Completa todos los campos');
    setTurnos([...turnos, { id: Math.max(...turnos.map(t => t.id)) + 1, ...newTurno, estado: 'Pendiente' }]);
    setNewTurno({ fecha: '20/05/2026', hora: '', tipo: 'Corte', cliente: '', local: 'Local' });
    setShowAddTurnoModal(false);
  };

  const updateTurnoStatus = (id, s) => {
    setTurnos(turnos.map(t => t.id === id ? { ...t, estado: s } : t));
    setShowTurnoDetail(false);
  };

  const deleteTurno = (id) => {
    if (confirm('¿Eliminar turno?')) {
      setTurnos(turnos.filter(t => t.id !== id));
      setShowTurnoDetail(false);
    }
  };

  const saveEditTurno = () => {
    if (!editTurno.hora || !editTurno.cliente) return alert('Completa todos los campos');
    setTurnos(turnos.map(t => t.id === editTurno.id ? editTurno : t));
    setShowEditTurnoModal(false);
    setShowTurnoDetail(false);
  };

  const getStatusColor = (e) => {
    const c = {
      'Pendiente': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      'En atención': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Finalizado': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Cancelado': 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    return c[e] || 'bg-slate-500/20 text-slate-400';
  };

  const getStatusIcon = (e) => {
    const i = { 'Pendiente': AlertCircle, 'En atención': Clock, 'Finalizado': CheckCircle, 'Cancelado': XCircle };
    const Icon = i[e];
    return Icon ? <Icon size={16} /> : null;
  };

  const filteredTurnos = turnos.filter(t => 
    (selectedLocation === 'Todos' || t.local === selectedLocation) &&
    (selectedStatus === 'Todos' || t.estado === selectedStatus) &&
    t.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: turnos.length,
    atendidos: turnos.filter(t => t.estado === 'Finalizado').length,
    pendientes: turnos.filter(t => t.estado === 'Pendiente').length,
    cancelados: turnos.filter(t => t.estado === 'Cancelado').length
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Gestión de Turnos</h1>
        <p className="text-slate-400">Administración completa de turnos y horarios</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setShowAddTurnoModal(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition flex items-center gap-2 font-semibold shadow-lg">
          <Plus size={20} /> Nuevo Turno
        </button>
        <button onClick={() => setShowScheduleModal(true)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-2 font-semibold">
          <Clock size={20} /> Configurar Horarios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Turnos del día', val: stats.total, color: 'from-blue-400 to-cyan-400', bg: 'from-slate-800 to-slate-900' },
          { label: 'Atendidos', val: stats.atendidos, color: 'text-green-400', bg: 'from-green-900/30 to-green-950/30', icon: CheckCircle },
          { label: 'Pendientes', val: stats.pendientes, color: 'text-yellow-400', bg: 'from-yellow-900/30 to-yellow-950/30', icon: AlertCircle },
          { label: 'Cancelados', val: stats.cancelados, color: 'text-red-400', bg: 'from-red-900/30 to-red-950/30', icon: XCircle }
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.bg} border border-slate-700 rounded-xl p-6 shadow-xl`}>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              {s.icon && <s.icon size={16} />}
              <p>{s.label}</p>
            </div>
            <p className={`text-4xl font-bold ${s.color.includes('gradient') ? 'bg-gradient-to-r ' + s.color + ' bg-clip-text text-transparent' : s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none">
            {['Todos', 'Local', 'Sucursal 1', 'Sucursal 2'].map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none">
            {['Todos', 'Pendiente', 'En atención', 'Finalizado', 'Cancelado'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none" />
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/80">
              <tr className="text-left text-slate-400 text-sm">
                {['N°', 'Cliente', 'Fecha', 'Hora', 'Tipo', 'Local', 'Estado', 'Acciones'].map(h => <th key={h} className="p-4 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredTurnos.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-500">No se encontraron turnos</td></tr>
              ) : (
                filteredTurnos.map(t => (
                  <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-800/50 transition">
                    <td className="p-4 font-semibold text-purple-400">#{t.id}</td>
                    <td className="p-4">{t.cliente}</td>
                    <td className="p-4">{t.fecha}</td>
                    <td className="p-4 font-medium">{t.hora}</td>
                    <td className="p-4">{t.tipo}</td>
                    <td className="p-4 text-sm text-slate-400">{t.local}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(t.estado)}`}>
                        {getStatusIcon(t.estado)} {t.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => { setSelectedTurno(t); setShowTurnoDetail(true); }} className="text-blue-400 hover:text-blue-300 transition p-2 hover:bg-blue-500/10 rounded-lg">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddTurnoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Nuevo Turno</h2>
              <button onClick={() => setShowAddTurnoModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Cliente', type: 'text', val: newTurno.cliente, key: 'cliente', placeholder: 'Nombre' },
                { label: 'Hora', type: 'time', val: newTurno.hora, key: 'hora' },
                { label: 'Tipo', type: 'select', val: newTurno.tipo, key: 'tipo', opts: ['Corte', 'Barba', 'Corte + Barba', 'Tintura'] },
                { label: 'Local', type: 'select', val: newTurno.local, key: 'local', opts: ['Local', 'Sucursal 1', 'Sucursal 2'] }
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-slate-400 mb-2">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={f.val} onChange={(e) => setNewTurno({...newTurno, [f.key]: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none">
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={f.val} onChange={(e) => setNewTurno({...newTurno, [f.key]: e.target.value})} placeholder={f.placeholder} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddTurnoModal(false)} className="flex-1 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition font-semibold">Cancelar</button>
              <button onClick={addTurno} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-semibold">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Configuración de horarios</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              {Object.keys(schedules).map(day => (
                <div key={day} className="border-b border-slate-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{day}</h3>
                    <button onClick={() => addSchedule(day)} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 font-semibold">
                      <Plus size={16} /> Agregar
                    </button>
                  </div>
                  {schedules[day].length === 0 ? (
                    <p className="text-slate-500 text-sm italic">Sin atención</p>
                  ) : (
                    <div className="space-y-2">
                      {schedules[day].map((s, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input type="time" value={s.start} onChange={(e) => updateSchedule(day, idx, 'start', e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none" />
                          <span className="text-slate-400">-</span>
                          <input type="time" value={s.end} onChange={(e) => updateSchedule(day, idx, 'end', e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none" />
                          <button onClick={() => removeSchedule(day, idx)} className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowScheduleModal(false)} className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition font-semibold">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showTurnoDetail && selectedTurno && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Detalle del Turno</h2>
              <button onClick={() => setShowTurnoDetail(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-3 mb-6 bg-slate-800/50 rounded-lg p-4 text-sm">
              {[
                ['N°', `#${selectedTurno.id}`, 'text-purple-400'],
                ['Cliente', selectedTurno.cliente],
                ['Fecha', selectedTurno.fecha],
                ['Hora', selectedTurno.hora],
                ['Tipo', selectedTurno.tipo],
                ['Local', selectedTurno.local]
              ].map(([k, v, c]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}:</span>
                  <span className={`font-medium ${c || 'text-white'}`}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                <span className="text-slate-400">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2 ${getStatusColor(selectedTurno.estado)}`}>
                  {getStatusIcon(selectedTurno.estado)} {selectedTurno.estado}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {selectedTurno.estado === 'Pendiente' && (
                <button onClick={() => updateTurnoStatus(selectedTurno.id, 'En atención')} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Iniciar atención
                </button>
              )}
              {selectedTurno.estado === 'En atención' && (
                <button onClick={() => updateTurnoStatus(selectedTurno.id, 'Finalizado')} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Finalizar atención
                </button>
              )}
              {(selectedTurno.estado === 'Pendiente' || selectedTurno.estado === 'En atención') && (
                <>
                  <button onClick={() => { setEditTurno({...selectedTurno}); setShowEditTurnoModal(true); }} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2">
                    <Edit size={18} /> Editar
                  </button>
                  <button onClick={() => updateTurnoStatus(selectedTurno.id, 'Cancelado')} className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2">
                    <X size={18} /> Cancelar turno
                  </button>
                </>
              )}
              <button onClick={() => deleteTurno(selectedTurno.id)} className="w-full bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-700/30 py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2">
                <Trash2 size={18} /> Eliminar
              </button>
              <button onClick={() => setShowTurnoDetail(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg transition font-semibold">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showEditTurnoModal && editTurno && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Editar Turno</h2>
              <button onClick={() => setShowEditTurnoModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Cliente', type: 'text', val: editTurno.cliente, key: 'cliente' },
                { label: 'Hora', type: 'time', val: editTurno.hora, key: 'hora' },
                { label: 'Tipo', type: 'select', val: editTurno.tipo, key: 'tipo', opts: ['Corte', 'Barba', 'Corte + Barba', 'Tintura'] },
                { label: 'Local', type: 'select', val: editTurno.local, key: 'local', opts: ['Local', 'Sucursal 1', 'Sucursal 2'] }
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-slate-400 mb-2">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={f.val} onChange={(e) => setEditTurno({...editTurno, [f.key]: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none">
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={f.val} onChange={(e) => setEditTurno({...editTurno, [f.key]: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditTurnoModal(false)} className="flex-1 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition font-semibold">Cancelar</button>
              <button onClick={saveEditTurno} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-semibold">Guardar</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}