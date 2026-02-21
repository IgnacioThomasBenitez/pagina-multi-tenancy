import React, { useState } from 'react';
import {
  Plus, Trash2, Upload, Image, Save, X, Clock,
  UserCheck, Settings, FileText, Award, AlertTriangle,
  Edit, Tag,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

/* ─── Paleta unificada ─── */
const t = {
  bg: '#0a0d12', surface: '#111720', card: '#161d28',
  border: '#1e2d3d', borderLight: '#243447',
  accent: '#10b981', accentMuted: '#064e3b',
  text: '#e2e8f0', textMuted: '#64748b', textDim: '#334155',
  danger: '#ef4444', gold: '#f59e0b', purple: '#8b5cf6', info: '#38bdf8',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .pf-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }

  /* Pro cards */
  .pro-card {
    background: ${t.card}; border: 1px solid ${t.border};
    border-radius: 16px; padding: 16px; cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }
  .pro-card:hover { transform: translateY(-2px); border-color: ${t.borderLight}; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .pro-card.active { border-color: ${t.accent}; box-shadow: 0 0 0 1px ${t.accent}30, 0 8px 24px rgba(16,185,129,0.12); }
  .pro-card .del-btn { opacity: 0; transition: opacity 0.15s; }
  .pro-card:hover .del-btn { opacity: 1; }

  /* Inputs */
  .pf-input, .pf-select, .pf-textarea {
    width: 100%; background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 10px; padding: 11px 14px;
    color: ${t.text}; font-family: 'Sora', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.15s, background 0.15s;
  }
  .pf-input::placeholder, .pf-textarea::placeholder { color: ${t.textMuted}; }
  .pf-input:focus, .pf-select:focus, .pf-textarea:focus { border-color: ${t.accent}; background: ${t.accent}08; }
  .pf-select { cursor: pointer; appearance: none; }
  .pf-select option { background: ${t.card}; }
  .pf-textarea { resize: none; }

  /* Buttons */
  .btn-p { transition: all 0.15s ease; cursor: pointer; border: none; }
  .btn-p:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-p:active { transform: translateY(0); }
  .btn-g { transition: all 0.15s ease; cursor: pointer; }
  .btn-g:hover { border-color: ${t.borderLight} !important; background: ${t.border}40 !important; }

  /* Upload zone */
  .upload-zone {
    border: 2px dashed ${t.border}; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
    padding: 24px;
  }
  .upload-zone:hover { border-color: ${t.accent}; background: ${t.accent}08; }

  /* Stat cards */
  .stat-c { transition: transform 0.2s ease; }
  .stat-c:hover { transform: translateY(-2px); }

  /* Modal */
  .modal-bd { animation: bdIn 0.18s ease; }
  @keyframes bdIn { from{opacity:0}to{opacity:1} }
  .modal-box { animation: mbIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes mbIn { from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)} }

  /* Detail panel fade */
  .detail-in { animation: dtIn 0.2s ease; }
  @keyframes dtIn { from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)} }
`;

/* ─── Status pill ─── */
const STATE_COLORS = {
  'Activo':     { color: t.accent, bg: `${t.accent}18`, border: `${t.accent}35` },
  'Inactivo':   { color: t.textMuted, bg: `${t.textMuted}12`, border: `${t.textMuted}25` },
  'Vacaciones': { color: t.gold, bg: `${t.gold}15`, border: `${t.gold}30` },
};

function StatePill({ state }) {
  const cfg = STATE_COLORS[state] || STATE_COLORS['Inactivo'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color }} />
      {state}
    </span>
  );
}

/* ─── Label ─── */
const Label = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 7 }}>
    {children}
  </div>
);

/* ─── StatCard ─── */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-c" style={{
      background: t.card, border: `1px solid ${t.border}`,
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
    </div>
  );
}

/* ─── Confirm Modal ─── */
function ConfirmModal({ isOpen, professional, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="modal-bd" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 16,
    }}>
      <div className="modal-box" style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 20, padding: 32, maxWidth: 380, width: '100%',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `${t.danger}15`, border: `1px solid ${t.danger}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <AlertTriangle size={24} color={t.danger} />
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, textAlign: 'center', marginBottom: 10 }}>
          ¿Eliminar profesional?
        </h3>
        <p style={{ fontSize: 13, color: t.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
          Se eliminará a <strong style={{ color: t.text }}>{professional?.name || 'este profesional'}</strong>. Esta acción no se puede deshacer.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} className="btn-g" style={{
            flex: 1, padding: '12px', background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 10, color: t.textMuted, fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
          }}>Cancelar</button>
          <button onClick={onConfirm} className="btn-p" style={{
            flex: 1, padding: '12px', background: `${t.danger}20`, border: `1px solid ${t.danger}40`,
            borderRadius: 10, color: t.danger, fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPONENTE PRINCIPAL ─── */
export default function Professionals() {
  const [professionals, setProfessionals] = useState([
    { id: 1, photo: null, name: 'Juan Pérez',    specialty: 'Barbero Senior', state: 'Activo',    services: '', schedule: '' },
    { id: 2, photo: null, name: 'María García',  specialty: 'Estilista',      state: 'Activo',    services: '', schedule: '' },
    { id: 3, photo: null, name: 'Laura Díaz',    specialty: 'Colorista',      state: 'Vacaciones',services: '', schedule: '' },
  ]);

  const [selected,     setSelected]     = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, professional: null });

  const addProfessional = () => {
    const np = {
      id: Date.now(), photo: null,
      name: `Profesional ${professionals.length + 1}`,
      specialty: '', state: 'Activo', services: '', schedule: '',
    };
    setProfessionals([...professionals, np]);
    setSelected(np);
  };

  const removeProfessional = () => {
    const id = confirmModal.professional?.id;
    if (professionals.length > 1 && id) {
      setProfessionals(professionals.filter(p => p.id !== id));
      if (selected?.id === id) setSelected(null);
    }
    setConfirmModal({ isOpen: false, professional: null });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (!selected) return;
    const updated = { ...selected, [name]: value };
    setSelected(updated);
    setProfessionals(professionals.map(p => p.id === selected.id ? updated : p));
  };

  const handlePhoto = (file, profId = null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const id = profId ?? selected?.id;
      const updatedList = professionals.map(p => p.id === id ? { ...p, photo: reader.result } : p);
      setProfessionals(updatedList);
      if (selected?.id === id) setSelected({ ...selected, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    if (!selected) return;
    const updated = { ...selected, photo: null };
    setSelected(updated);
    setProfessionals(professionals.map(p => p.id === selected.id ? updated : p));
  };

  const handleSave = () => {
    if (!selected) return;
    if (!selected.name.trim()) { alert('El nombre es requerido'); return; }
    console.log('Guardando:', professionals);
    alert('✅ Configuración guardada');
  };

  const stats = [
    { label: 'Total',      value: professionals.length,                                         color: t.info,   Icon: UserCheck },
    { label: 'Activos',    value: professionals.filter(p => p.state === 'Activo').length,        color: t.accent, Icon: Award     },
    { label: 'Con foto',   value: professionals.filter(p => p.photo).length,                    color: t.purple, Icon: Image     },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="pf-root" style={{ display: 'flex', height: '100vh', background: t.bg }}>
        <Sidebar />

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* Header */}
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
                fontSize: 10, color: t.accent, fontWeight: 700, letterSpacing: '0.8px',
                textTransform: 'uppercase', marginBottom: 8,
              }}>
                <Settings size={10} /> Configuración
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 3 }}>
                Profesionales
              </h1>
              <p style={{ fontSize: 13, color: t.textMuted }}>Administrá y personalizá el equipo de tu negocio</p>
            </div>

            <button
              className="btn-p"
              onClick={addProfessional}
              style={{
                padding: '10px 20px', background: t.accent, border: 'none',
                borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13,
                fontFamily: 'Sora, sans-serif',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Plus size={15} /> Nuevo Profesional
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
            {stats.map(({ label, value, color, Icon }) => (
              <StatCard key={label} icon={Icon} label={label} value={value} color={color} />
            ))}
          </div>

          {/* Main panel */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 16,
          }}>
            {/* ─── Lista ─── */}
            <div style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: 18, padding: '22px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserCheck size={15} color={t.accent} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Lista de profesionales</span>
                </div>
                <span style={{ fontSize: 11, color: t.textDim }}>{professionals.length} en total</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 560, overflowY: 'auto' }}>
                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    className={`pro-card ${selected?.id === prof.id ? 'active' : ''}`}
                    onClick={() => setSelected(prof)}
                  >
                    {/* Delete btn */}
                    <button
                      className="del-btn btn-p"
                      onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, professional: prof }); }}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 28, height: 28, borderRadius: 8,
                        background: `${t.danger}18`, border: `1px solid ${t.danger}30`,
                        color: t.danger, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {/* Avatar / Foto */}
                      <div style={{ flexShrink: 0 }}>
                        {prof.photo ? (
                          <label onClick={e => e.stopPropagation()} style={{ cursor: 'pointer', display: 'block' }}>
                            <img src={prof.photo} alt={prof.name} style={{
                              width: 52, height: 52, borderRadius: 12, objectFit: 'cover',
                              border: `2px solid ${t.border}`,
                            }} />
                            <input type="file" accept="image/*" style={{ display: 'none' }}
                              onChange={e => handlePhoto(e.target.files[0], prof.id)} />
                          </label>
                        ) : (
                          <label onClick={e => e.stopPropagation()} style={{ cursor: 'pointer', display: 'block' }}>
                            <div style={{
                              width: 52, height: 52, borderRadius: 12,
                              background: t.surface, border: `2px dashed ${t.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Image size={18} color={t.textDim} />
                            </div>
                            <input type="file" accept="image/*" style={{ display: 'none' }}
                              onChange={e => handlePhoto(e.target.files[0], prof.id)} />
                          </label>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prof.name || 'Sin nombre'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <Tag size={10} color={t.textMuted} />
                          <span style={{ fontSize: 11, color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prof.specialty || 'Sin especialidad'}
                          </span>
                        </div>
                        <StatePill state={prof.state} />
                      </div>

                      {selected?.id === prof.id && (
                        <div style={{ color: t.accent, flexShrink: 0 }}>
                          <Edit size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {professionals.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', gap: 10 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, background: t.surface,
                      border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <UserCheck size={22} color={t.textDim} />
                    </div>
                    <span style={{ fontSize: 13, color: t.textMuted }}>No hay profesionales</span>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Panel de edición ─── */}
            <div style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: 18, padding: '22px 22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <FileText size={15} color={t.accent} />
                <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Detalles del profesional</span>
              </div>

              {!selected ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: 300, gap: 12,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: t.surface,
                    border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Edit size={20} color={t.textDim} />
                  </div>
                  <p style={{ fontSize: 13, color: t.textMuted, textAlign: 'center' }}>
                    Seleccioná un profesional<br />para editar sus detalles
                  </p>
                </div>
              ) : (
                <div className="detail-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Info banner */}
                  <div style={{
                    background: `${t.accent}10`, border: `1px solid ${t.accent}25`,
                    borderRadius: 10, padding: '10px 14px',
                    fontSize: 12, color: t.accent, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Edit size={12} />
                    <span>Editando: <strong>{selected.name}</strong></span>
                  </div>

                  {/* Foto */}
                  <div>
                    <Label>Foto</Label>
                    {selected.photo ? (
                      <div style={{ position: 'relative' }}>
                        <label style={{ cursor: 'pointer', display: 'block' }}>
                          <img src={selected.photo} alt="Preview" style={{
                            width: '100%', height: 150, objectFit: 'cover',
                            borderRadius: 12, border: `1px solid ${t.border}`,
                          }} />
                          <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => handlePhoto(e.target.files[0])} />
                        </label>
                        <button onClick={removePhoto} style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 28, height: 28, borderRadius: 8,
                          background: `${t.danger}20`, border: `1px solid ${t.danger}35`,
                          color: t.danger, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-zone" style={{ height: 100 }}>
                        <Upload size={22} color={t.textMuted} style={{ marginBottom: 6 }} />
                        <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>Subir imagen</span>
                        <span style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>PNG, JPG · máx 5MB</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => handlePhoto(e.target.files[0])} />
                      </label>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <Label>Nombre</Label>
                    <input name="name" value={selected.name} onChange={handleInput}
                      placeholder="Nombre del profesional" className="pf-input" />
                  </div>

                  {/* Especialidad */}
                  <div>
                    <Label>Especialidad</Label>
                    <input name="specialty" value={selected.specialty} onChange={handleInput}
                      placeholder="Ej: Barbero, Estilista, Colorista" className="pf-input" />
                  </div>

                  {/* Estado */}
                  <div>
                    <Label>Estado</Label>
                    <div style={{ position: 'relative' }}>
                      <select name="state" value={selected.state} onChange={handleInput} className="pf-select"
                        style={{ paddingRight: 32 }}>
                        <option>Activo</option>
                        <option>Inactivo</option>
                        <option>Vacaciones</option>
                      </select>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div>
                    <Label>Servicios que realiza</Label>
                    <textarea name="services" value={selected.services} onChange={handleInput} rows={2}
                      placeholder="Ej: Corte, Peinado, Coloración..." className="pf-textarea" />
                  </div>

                  {/* Horarios */}
                  <div>
                    <Label>Horarios</Label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={13} color={t.textMuted} style={{ position: 'absolute', left: 12, top: 13, pointerEvents: 'none' }} />
                      <textarea name="schedule" value={selected.schedule} onChange={handleInput} rows={2}
                        placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                        className="pf-textarea" style={{ paddingLeft: 34 }} />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                    <button onClick={() => setSelected(null)} className="btn-g" style={{
                      flex: 1, padding: '12px', background: t.surface,
                      border: `1px solid ${t.border}`, borderRadius: 10,
                      color: t.textMuted, fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <X size={14} /> Cancelar
                    </button>
                    <button onClick={handleSave} className="btn-p" style={{
                      flex: 2, padding: '12px', background: t.accent, border: 'none',
                      borderRadius: 10, color: '#fff', fontFamily: 'Sora, sans-serif',
                      fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Save size={14} /> Guardar cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tip */}
          <div style={{
            marginTop: 18, background: `${t.info}08`, border: `1px solid ${t.info}20`,
            borderLeft: `3px solid ${t.info}`, borderRadius: '0 10px 10px 0',
            padding: '12px 16px',
          }}>
            <p style={{ fontSize: 12, color: t.info }}>
              <strong>💡 Tip:</strong> Hacé clic en la foto de una card para cambiarla directamente. Asigná servicios y horarios para una mejor organización.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        professional={confirmModal.professional}
        onConfirm={removeProfessional}
        onCancel={() => setConfirmModal({ isOpen: false, professional: null })}
      />
    </>
  );
}