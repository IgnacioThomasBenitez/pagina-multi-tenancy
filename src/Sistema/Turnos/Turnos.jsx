import React, { useState, useEffect } from 'react';
import {
  Clock, Plus, Edit, X, Trash2, CheckCircle,
  XCircle, AlertCircle, Eye, Search, Filter,
  Calendar, MapPin, Scissors, Sparkles,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

/* ─── Paleta unificada ─── */
const t = {
  bg: '#0a0d12', surface: '#111720', card: '#161d28',
  border: '#1e2d3d', borderLight: '#243447',
  accent: '#10b981', accentMuted: '#064e3b',
  text: '#e2e8f0', textMuted: '#64748b', textDim: '#334155',
  danger: '#ef4444', gold: '#f59e0b', info: '#38bdf8', purple: '#8b5cf6',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .tm2-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }

  /* Stat cards */
  .stat-c { transition: transform 0.2s ease, border-color 0.2s ease; cursor: default; }
  .stat-c:hover { transform: translateY(-2px); border-color: ${t.borderLight} !important; }

  /* Table rows */
  .tr-row { transition: background 0.15s ease; }
  .tr-row:hover { background: ${t.accent}08 !important; }
  .tr-row:hover .eye-btn { opacity: 1 !important; color: ${t.accent} !important; }
  .eye-btn { opacity: 0.3; transition: opacity 0.15s, color 0.15s; cursor: pointer; }

  /* Buttons */
  .btn-p { transition: all 0.15s ease; }
  .btn-p:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-p:active { transform: translateY(0); }
  .btn-g { transition: all 0.15s ease; }
  .btn-g:hover { background: ${t.border} !important; }

  /* Inputs */
  .tm2-input {
    width: 100%; background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 10px; padding: 11px 14px 11px 38px;
    color: ${t.text}; font-family: 'Sora', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.15s, background 0.15s;
  }
  .tm2-input::placeholder { color: ${t.textMuted}; }
  .tm2-input:focus { border-color: ${t.accent}; background: ${t.accent}08; }
  .tm2-input::-webkit-calendar-picker-indicator { filter: invert(0.4); }

  .tm2-select {
    width: 100%; background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 10px; padding: 11px 14px 11px 38px;
    color: ${t.text}; font-family: 'Sora', sans-serif; font-size: 13px;
    outline: none; cursor: pointer; appearance: none;
    transition: border-color 0.15s;
  }
  .tm2-select:focus { border-color: ${t.accent}; }
  .tm2-select option { background: ${t.card}; }

  /* Backdrops & modals */
  .tm2-backdrop { animation: bdIn 0.18s ease; }
  @keyframes bdIn { from{opacity:0} to{opacity:1} }
  .tm2-modal { animation: mdIn 0.26s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes mdIn { from{opacity:0;transform:scale(0.92) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* Action buttons in detail */
  .act-btn {
    width: 100%; border-radius: 10px; padding: 11px 14px;
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    cursor: pointer; border: none; transition: all 0.15s ease;
  }
  .act-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .act-btn:active { transform: translateY(0); }

  /* Day blocks in schedule */
  .day-block {
    border-radius: 12px; border: 1px solid ${t.border};
    padding: 14px 16px; background: ${t.surface};
    transition: border-color 0.2s;
  }
  .day-block:hover { border-color: ${t.borderLight}; }

  /* Dot pulse */
  .dot-pulse {
    width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0;
    animation: dp 2s infinite;
  }
  @keyframes dp { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
`;

/* ─── Status config ─── */
const STATUS = {
  'Pendiente':   { bg: `${t.gold}15`,   color: t.gold,   border: `${t.gold}35`,   Icon: AlertCircle },
  'En atención': { bg: `${t.info}15`,   color: t.info,   border: `${t.info}35`,   Icon: Clock       },
  'Finalizado':  { bg: `${t.accent}15`, color: t.accent, border: `${t.accent}35`, Icon: CheckCircle },
  'Cancelado':   { bg: `${t.danger}15`, color: t.danger, border: `${t.danger}35`, Icon: XCircle     },
};

function StatusPill({ estado }) {
  const cfg = STATUS[estado] || {};
  const Icon = cfg.Icon || AlertCircle;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <Icon size={11} /> {estado}
    </span>
  );
}

/* ─── Input con icono ─── */
function IconInput({ icon: Icon, type = 'text', value, onChange, placeholder, name, className = 'tm2-input' }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={14} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={className} />
    </div>
  );
}

function IconSelect({ icon: Icon, value, onChange, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={14} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
      <select value={value} onChange={onChange} className="tm2-select">{children}</select>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: t.surface, border: `1px solid ${t.border}`,
  borderRadius: 10, padding: '11px 14px', color: t.text,
  fontFamily: 'Sora, sans-serif', fontSize: 13, outline: 'none',
};

/* ─── Label ─── */
const Label = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 7 }}>
    {children}
  </div>
);

/* ─── Modal wrapper ─── */
function Modal({ onClose, children, maxWidth = 440 }) {
  return (
    <div
      className="tm2-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(7px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
      }}
    >
      <div className="tm2-modal" style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 20, padding: 30, width: '100%', maxWidth,
        position: 'relative', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          width: 28, height: 28, borderRadius: 8,
          background: t.surface, border: `1px solid ${t.border}`,
          color: t.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={14} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ─── TurnoForm ─── */
function TurnoForm({ data, setData }) {
  const onF = (e) => setData({ ...data, [e.target.name]: e.target.value });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <Label>Cliente</Label>
        <div style={{ position: 'relative' }}>
          <Search size={13} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input name="cliente" value={data.cliente} onChange={onF} placeholder="Nombre del cliente" className="tm2-input" />
        </div>
      </div>
      <div>
        <Label>Hora</Label>
        <div style={{ position: 'relative' }}>
          <Clock size={13} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input type="time" name="hora" value={data.hora} onChange={onF} className="tm2-input" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <Label>Tipo</Label>
          <div style={{ position: 'relative' }}>
            <Scissors size={13} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select name="tipo" value={data.tipo} onChange={onF} className="tm2-select">
              {['Corte', 'Barba', 'Corte + Barba', 'Tintura'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Local</Label>
          <div style={{ position: 'relative' }}>
            <MapPin size={13} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select name="local" value={data.local} onChange={onF} className="tm2-select">
              {['Local', 'Sucursal 1', 'Sucursal 2'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPONENTE PRINCIPAL ─── */
export default function TurnosManager() {
  const [showScheduleModal,  setShowScheduleModal]  = useState(false);
  const [showDetail,         setShowDetail]         = useState(false);
  const [showAddModal,       setShowAddModal]       = useState(false);
  const [showEditModal,      setShowEditModal]      = useState(false);
  const [selectedTurno,      setSelectedTurno]      = useState(null);
  const [selectedDate,       setSelectedDate]       = useState('2026-05-20');
  const [selectedLocation,   setSelectedLocation]   = useState('Todos');
  const [selectedStatus,     setSelectedStatus]     = useState('Todos');
  const [searchTerm,         setSearchTerm]         = useState('');

  const [schedules, setSchedules] = useState({
    Lunes:     [{ start: '09:00', end: '13:00' }],
    Martes:    [],
    Miércoles: [{ start: '15:00', end: '20:00' }],
    Jueves:    [],
    Viernes:   [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }],
    Sábado:    [],
    Domingo:   [],
  });

  const [turnos, setTurnos] = useState([
    { id: 23, fecha: '20/05/2026', hora: '15:30', tipo: 'Corte',         estado: 'Pendiente',   cliente: 'Juan Pérez',    local: 'Local'      },
    { id: 24, fecha: '20/05/2026', hora: '16:00', tipo: 'Barba',         estado: 'En atención', cliente: 'María López',   local: 'Local'      },
    { id: 25, fecha: '20/05/2026', hora: '16:30', tipo: 'Corte + Barba', estado: 'Finalizado',  cliente: 'Carlos García', local: 'Sucursal 1' },
    { id: 26, fecha: '20/05/2026', hora: '17:00', tipo: 'Corte',         estado: 'Cancelado',   cliente: 'Ana Martínez',  local: 'Local'      },
  ]);

  const EMPTY_TURNO = { fecha: '20/05/2026', hora: '', tipo: 'Corte', cliente: '', local: 'Local' };
  const [newTurno,  setNewTurno]  = useState(EMPTY_TURNO);
  const [editTurno, setEditTurno] = useState(null);

  /* Schedule helpers */
  const addSchedule    = (d)          => setSchedules({ ...schedules, [d]: [...schedules[d], { start: '', end: '' }] });
  const removeSchedule = (d, i)       => setSchedules({ ...schedules, [d]: schedules[d].filter((_, idx) => idx !== i) });
  const updateSchedule = (d, i, f, v) => {
    const u = [...schedules[d]]; u[i][f] = v;
    setSchedules({ ...schedules, [d]: u });
  };

  /* Turno helpers */
  const addTurno = () => {
    if (!newTurno.hora || !newTurno.cliente) return;
    setTurnos([...turnos, { id: Math.max(...turnos.map(t => t.id)) + 1, ...newTurno, estado: 'Pendiente' }]);
    setNewTurno(EMPTY_TURNO);
    setShowAddModal(false);
  };

  const updateStatus = (id, estado) => {
    setTurnos(turnos.map(t => t.id === id ? { ...t, estado } : t));
    setShowDetail(false);
  };

  const deleteTurno = (id) => {
    if (window.confirm('¿Eliminar este turno?')) {
      setTurnos(turnos.filter(t => t.id !== id));
      setShowDetail(false);
    }
  };

  const saveEdit = () => {
    if (!editTurno?.hora || !editTurno?.cliente) return;
    setTurnos(turnos.map(t => t.id === editTurno.id ? editTurno : t));
    setShowEditModal(false);
    setShowDetail(false);
  };

  const filtered = turnos.filter(t =>
    (selectedLocation === 'Todos' || t.local === selectedLocation) &&
    (selectedStatus   === 'Todos' || t.estado === selectedStatus) &&
    t.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total',       val: turnos.length,                                      color: t.info,   Icon: Scissors   },
    { label: 'Finalizados', val: turnos.filter(t => t.estado === 'Finalizado').length, color: t.accent, Icon: CheckCircle },
    { label: 'Pendientes',  val: turnos.filter(t => t.estado === 'Pendiente').length,  color: t.gold,   Icon: AlertCircle },
    { label: 'Cancelados',  val: turnos.filter(t => t.estado === 'Cancelado').length,  color: t.danger, Icon: XCircle    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="tm2-root" style={{ display: 'flex', height: '100vh', background: t.bg }}>
        <Sidebar />

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* ─── Header ─── */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 18, padding: '22px 28px', marginBottom: 22,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: `${t.accent}15`, border: `1px solid ${t.accent}30`,
                borderRadius: 20, padding: '3px 11px',
                fontSize: 10, color: t.accent, fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8,
              }}>
                <Sparkles size={10} /> Administración
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 3 }}>
                Gestión de Turnos
              </h1>
              <p style={{ fontSize: 13, color: t.textMuted }}>Administración completa de turnos y horarios</p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-g"
                onClick={() => setShowScheduleModal(true)}
                style={{
                  padding: '10px 18px', background: t.card, border: `1px solid ${t.border}`,
                  borderRadius: 10, color: t.textMuted, cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                <Clock size={15} /> Horarios
              </button>
              <button
                className="btn-p"
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '10px 18px', background: t.accent, border: 'none',
                  borderRadius: 10, color: '#fff', cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                <Plus size={15} /> Nuevo Turno
              </button>
            </div>
          </div>

          {/* ─── Stats ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {stats.map(({ label, val, color, Icon }) => (
              <div key={label} className="stat-c" style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  <Icon size={14} color={color} style={{ opacity: 0.7 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <div className="mono" style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
                  <span className="dot-pulse" style={{ background: color, marginBottom: 4 }} />
                </div>
              </div>
            ))}
          </div>

          {/* ─── Filtros ─── */}
          <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: '16px 20px', marginBottom: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Filter size={13} color={t.accent} />
              <span style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Filtros</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <IconInput icon={Calendar} type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              <IconSelect icon={MapPin} value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                {['Todos', 'Local', 'Sucursal 1', 'Sucursal 2'].map(l => <option key={l}>{l}</option>)}
              </IconSelect>
              <IconSelect icon={AlertCircle} value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                {['Todos', 'Pendiente', 'En atención', 'Finalizado', 'Cancelado'].map(s => <option key={s}>{s}</option>)}
              </IconSelect>
              <IconInput icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar cliente..." />
            </div>
          </div>

          {/* ─── Tabla ─── */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              padding: '14px 20px', borderBottom: `1px solid ${t.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scissors size={14} color={t.accent} />
                <span style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Turnos del día
                </span>
              </div>
              <span style={{ fontSize: 11, color: t.textDim }}>
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['N°', 'Cliente', 'Fecha', 'Hora', 'Tipo', 'Local', 'Estado', ''].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontSize: 10, fontWeight: 700, color: t.textDim,
                        textTransform: 'uppercase', letterSpacing: '0.6px',
                        borderBottom: `1px solid ${t.border}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px', gap: 10 }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: 14, background: t.surface,
                            border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Scissors size={22} color={t.textDim} />
                          </div>
                          <span style={{ color: t.textMuted, fontSize: 13 }}>Sin turnos para mostrar</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((trn, idx) => (
                    <tr
                      key={trn.id}
                      className="tr-row"
                      style={{ borderTop: `1px solid ${t.border}`, background: idx % 2 === 0 ? 'transparent' : `${t.surface}60` }}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: t.accent }}>#{trn.id}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: t.text }}>{trn.cliente}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: t.textMuted }}>{trn.fecha}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 12, color: t.text, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                          <Clock size={11} color={t.textMuted} /> {trn.hora}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: t.textMuted }}>{trn.tipo}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={10} /> {trn.local}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}><StatusPill estado={trn.estado} /></td>
                      <td style={{ padding: '13px 16px' }}>
                        <button
                          className="eye-btn btn-g"
                          onClick={() => { setSelectedTurno(trn); setShowDetail(true); }}
                          style={{
                            padding: '6px 8px', borderRadius: 8, background: 'none', border: 'none',
                            color: t.textMuted, cursor: 'pointer', display: 'flex',
                          }}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── MODAL: Nuevo Turno ─── */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: t.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Turnos</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text }}>Nuevo Turno</h2>
            </div>
            <TurnoForm data={newTurno} setData={setNewTurno} />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-g" onClick={() => setShowAddModal(false)} style={{
                flex: 1, padding: '11px', background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 10, color: t.textMuted, cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
              }}>Cancelar</button>
              <button className="btn-p" onClick={addTurno} style={{
                flex: 2, padding: '11px', background: t.accent, border: 'none',
                borderRadius: 10, color: '#fff', cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                <CheckCircle size={14} /> Guardar Turno
              </button>
            </div>
          </Modal>
        )}

        {/* ─── MODAL: Horarios ─── */}
        {showScheduleModal && (
          <Modal onClose={() => setShowScheduleModal(false)} maxWidth={600}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: t.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Configuración</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text }}>Horarios de atención</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(schedules).map(day => (
                <div key={day} className="day-block">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: schedules[day].length ? 10 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{day}</span>
                      {schedules[day].length === 0 && (
                        <span style={{ fontSize: 11, color: t.textDim, fontStyle: 'italic' }}>Sin atención</span>
                      )}
                    </div>
                    <button
                      onClick={() => addSchedule(day)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: t.accent, fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontFamily: 'Sora, sans-serif',
                      }}
                    >
                      <Plus size={13} /> Agregar
                    </button>
                  </div>

                  {schedules[day].map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <input type="time" value={s.start} onChange={e => updateSchedule(day, idx, 'start', e.target.value)}
                        style={{ ...inputStyle, flex: 1, padding: '9px 12px' }} />
                      <span style={{ fontSize: 11, color: t.textMuted, flexShrink: 0 }}>hasta</span>
                      <input type="time" value={s.end} onChange={e => updateSchedule(day, idx, 'end', e.target.value)}
                        style={{ ...inputStyle, flex: 1, padding: '9px 12px' }} />
                      <button onClick={() => removeSchedule(day, idx)} style={{
                        padding: '7px', borderRadius: 8, background: `${t.danger}12`,
                        border: `1px solid ${t.danger}25`, color: t.danger, cursor: 'pointer', flexShrink: 0,
                      }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button className="btn-p" onClick={() => setShowScheduleModal(false)} style={{
              width: '100%', marginTop: 18, padding: '12px', background: t.accent, border: 'none',
              borderRadius: 10, color: '#fff', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
              <CheckCircle size={14} /> Guardar Horarios
            </button>
          </Modal>
        )}

        {/* ─── MODAL: Detalle ─── */}
        {showDetail && selectedTurno && (
          <Modal onClose={() => setShowDetail(false)}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, color: t.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                Turno #{selectedTurno.id}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text }}>Detalle del Turno</h2>
            </div>

            {/* Info */}
            <div style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '14px 16px', marginBottom: 18,
            }}>
              {[
                ['Cliente', selectedTurno.cliente, t.text],
                ['Fecha',   selectedTurno.fecha,   t.textMuted],
                ['Hora',    selectedTurno.hora,     t.textMuted],
                ['Tipo',    selectedTurno.tipo,     t.textMuted],
                ['Local',   selectedTurno.local,    t.textMuted],
              ].map(([k, v, color]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: `1px solid ${t.border}`,
                }}>
                  <span style={{ fontSize: 12, color: t.textMuted }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                <span style={{ fontSize: 12, color: t.textMuted }}>Estado</span>
                <StatusPill estado={selectedTurno.estado} />
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedTurno.estado === 'Pendiente' && (
                <button className="act-btn" onClick={() => updateStatus(selectedTurno.id, 'En atención')}
                  style={{ background: `${t.info}20`, border: `1px solid ${t.info}35`, color: t.info }}>
                  <Clock size={14} /> Iniciar atención
                </button>
              )}
              {selectedTurno.estado === 'En atención' && (
                <button className="act-btn" onClick={() => updateStatus(selectedTurno.id, 'Finalizado')}
                  style={{ background: `${t.accent}20`, border: `1px solid ${t.accent}35`, color: t.accent }}>
                  <CheckCircle size={14} /> Finalizar atención
                </button>
              )}
              {['Pendiente', 'En atención'].includes(selectedTurno.estado) && (
                <>
                  <button className="act-btn" onClick={() => { setEditTurno({ ...selectedTurno }); setShowEditModal(true); }}
                    style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textMuted }}>
                    <Edit size={14} /> Editar turno
                  </button>
                  <button className="act-btn" onClick={() => updateStatus(selectedTurno.id, 'Cancelado')}
                    style={{ background: `${t.gold}12`, border: `1px solid ${t.gold}30`, color: t.gold }}>
                    <X size={14} /> Cancelar turno
                  </button>
                </>
              )}
              <button className="act-btn" onClick={() => deleteTurno(selectedTurno.id)}
                style={{ background: `${t.danger}12`, border: `1px solid ${t.danger}25`, color: t.danger }}>
                <Trash2 size={14} /> Eliminar turno
              </button>
            </div>
          </Modal>
        )}

        {/* ─── MODAL: Editar ─── */}
        {showEditModal && editTurno && (
          <Modal onClose={() => setShowEditModal(false)}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: t.purple, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Edición</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text }}>Editar Turno</h2>
            </div>
            <TurnoForm data={editTurno} setData={setEditTurno} />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-g" onClick={() => setShowEditModal(false)} style={{
                flex: 1, padding: '11px', background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 10, color: t.textMuted, cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
              }}>Cancelar</button>
              <button className="btn-p" onClick={saveEdit} style={{
                flex: 2, padding: '11px', background: '#2563eb', border: 'none',
                borderRadius: 10, color: '#fff', cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                <CheckCircle size={14} /> Guardar Cambios
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}