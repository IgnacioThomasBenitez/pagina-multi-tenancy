import React, { useState } from "react";
import {
  Plus, Trash2, Upload, Image, Save, X, DollarSign,
  Clock, UserCheck, Settings, FileText, AlertTriangle, Edit, Tag,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

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
  .sc-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }

  .svc-card {
    background: ${t.card}; border: 1px solid ${t.border};
    border-radius: 16px; overflow: hidden; cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }
  .svc-card:hover { transform: translateY(-2px); border-color: ${t.borderLight}; box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
  .svc-card.active { border-color: ${t.accent}; box-shadow: 0 0 0 1px ${t.accent}30, 0 8px 24px rgba(16,185,129,0.1); }
  .svc-card .del-btn { opacity: 0; transition: opacity 0.15s; }
  .svc-card:hover .del-btn { opacity: 1; }

  .pf-input, .pf-select { 
    width: 100%; background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 10px; padding: 11px 14px;
    color: ${t.text}; font-family: 'Sora', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.15s, background 0.15s;
  }
  .pf-input::placeholder { color: ${t.textMuted}; }
  .pf-input:focus, .pf-select:focus { border-color: ${t.accent}; background: ${t.accent}08; }
  .pf-input:disabled { opacity: 0.4; cursor: not-allowed; }
  .pf-select { cursor: pointer; appearance: none; }
  .pf-select option { background: ${t.card}; }
  input[type=number]::-webkit-inner-spin-button { display: none; }

  .btn-p { transition: all 0.15s ease; cursor: pointer; border: none; }
  .btn-p:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-p:active { transform: translateY(0); }
  .btn-p:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-g { transition: all 0.15s ease; cursor: pointer; }
  .btn-g:hover { border-color: ${t.borderLight} !important; }

  .upload-zone {
    border: 2px dashed ${t.border}; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color 0.2s, background 0.2s; padding: 20px;
  }
  .upload-zone:hover { border-color: ${t.accent}; background: ${t.accent}06; }
  .upload-zone.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

  /* Toggle switch */
  .toggle-track {
    width: 40px; height: 22px; border-radius: 11px; position: relative;
    transition: background 0.2s ease; cursor: pointer; flex-shrink: 0;
  }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%; background: #fff;
    transition: transform 0.2s ease; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  .stat-c { transition: transform 0.2s ease; }
  .stat-c:hover { transform: translateY(-2px); }

  .modal-bd { animation: bdIn 0.18s ease; }
  @keyframes bdIn { from{opacity:0}to{opacity:1} }
  .modal-box { animation: mbIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes mbIn { from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)} }
  .detail-in { animation: dtIn 0.2s ease; }
  @keyframes dtIn { from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)} }
`;

const EMPTY_FORM = { nombreAtencion: "", fotoReferencia: null, precio: "", profesionales: "", duracionMin: "", activo: true };

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

/* ─── Toggle ─── */
function Toggle({ checked, onChange, disabled }) {
  return (
    <div
      className="toggle-track"
      style={{ background: checked ? t.accent : t.border, opacity: disabled ? 0.4 : 1 }}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div className="toggle-thumb" style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }} />
    </div>
  );
}

/* ─── Confirm Modal ─── */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
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
        <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, textAlign: 'center', marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 13, color: t.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} className="btn-g" style={{
            flex: 1, padding: '12px', background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 10, color: t.textMuted, fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
          }}>Cancelar</button>
          <button onClick={onConfirm} className="btn-p" style={{
            flex: 1, padding: '12px', background: `${t.danger}18`, border: `1px solid ${t.danger}35`,
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

/* ─── Input con icono ─── */
function IconInput({ icon: Icon, right, disabled, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={14} color={t.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input className="pf-input" disabled={disabled} style={{ paddingLeft: 36, paddingRight: right ? 40 : 14 }} {...props} />
      {right && (
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: t.textMuted }}>{right}</span>
      )}
    </div>
  );
}

/* ─── COMPONENTE PRINCIPAL ─── */
export default function ServiceConfig() {
  const navigate = useNavigate();

  const [services, setServices] = useState([
    { id: 1, refPhoto: null, name: "Corte Clásico",    price: "2500" },
    { id: 2, refPhoto: null, name: "Corte + Barba",    price: "3800" },
    { id: 3, refPhoto: null, name: "Coloración",       price: "5500" },
  ]);

  const [formData, setFormData]           = useState(EMPTY_FORM);
  const [selectedService, setSelected]    = useState(null);
  const [confirmModal, setConfirmModal]   = useState({ isOpen: false, serviceId: null });

  /* ─── Helpers ─── */
  const avgPrice = () => {
    const prices = services.map(s => parseFloat(s.price) || 0).filter(p => p > 0);
    if (!prices.length) return '0';
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length).toLocaleString('es-AR');
  };

  const addService = () => {
    const ns = { id: Date.now(), refPhoto: null, name: `Servicio ${services.length + 1}`, price: "0" };
    setServices([...services, ns]);
    selectService(ns);
  };

  const selectService = (svc) => {
    setSelected(svc);
    setFormData({ nombreAtencion: svc.name, fotoReferencia: svc.refPhoto, precio: svc.price, profesionales: '', duracionMin: '', activo: true });
  };

  const removeService = () => {
    const id = confirmModal.serviceId;
    if (services.length > 1 && id) {
      setServices(prev => prev.filter(s => s.id !== id));
      if (selectedService?.id === id) { setSelected(null); setFormData(EMPTY_FORM); }
    }
    setConfirmModal({ isOpen: false, serviceId: null });
  };

  const syncService = (field, value) => {
    if (!selectedService) return;
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, [field]: value } : s));
    setSelected(prev => ({ ...prev, [field]: value }));
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: v }));
    if (name === 'nombreAtencion') syncService('name', value);
    if (name === 'precio')         syncService('price', value);
  };

  const handlePhoto = (file, svcId = null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const id = svcId ?? selectedService?.id;
      setServices(prev => prev.map(s => s.id === id ? { ...s, refPhoto: reader.result } : s));
      if (selectedService?.id === id) {
        setSelected(prev => ({ ...prev, refPhoto: reader.result }));
        setFormData(prev => ({ ...prev, fotoReferencia: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (svcId = null) => {
    const id = svcId ?? selectedService?.id;
    setServices(prev => prev.map(s => s.id === id ? { ...s, refPhoto: null } : s));
    if (selectedService?.id === id) {
      setSelected(prev => ({ ...prev, refPhoto: null }));
      setFormData(prev => ({ ...prev, fotoReferencia: null }));
    }
  };

  const handleSave = () => {
    if (!selectedService || !formData.nombreAtencion.trim()) return;
    console.log('Guardando:', { service: selectedService, formData });
    alert('✅ Configuración guardada exitosamente');
  };

  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;

  return (
    <>
      <style>{STYLES}</style>

      <div className="sc-root" style={{ display: 'flex', height: '100vh', background: t.bg }}>
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
                fontSize: 10, color: t.accent, fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8,
              }}>
                <Settings size={10} /> Configuración
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 3 }}>
                Servicios
              </h1>
              <p style={{ fontSize: 13, color: t.textMuted }}>Administrá y personalizá los servicios de tu negocio</p>
            </div>

            <button className="btn-p" onClick={addService} style={{
              padding: '10px 20px', background: t.accent, border: 'none',
              borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13,
              fontFamily: 'Sora, sans-serif',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Plus size={15} /> Nuevo Servicio
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
            <StatCard icon={Settings}  label="Total servicios"  value={services.length}   color={t.info}   />
            <StatCard icon={UserCheck} label="Activos"          value={services.length}   color={t.accent} />
            <StatCard icon={DollarSign} label="Precio promedio" value={`$${avgPrice()}`} color={t.gold}   />
          </div>

          {/* Main panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 16 }}>

            {/* ─── Lista de servicios ─── */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings size={14} color={t.accent} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Lista de servicios</span>
                </div>
                <span style={{ fontSize: 11, color: t.textDim }}>{services.length} en total</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxHeight: 580, overflowY: 'auto' }}>
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className={`svc-card ${selectedService?.id === svc.id ? 'active' : ''}`}
                    onClick={() => selectService(svc)}
                  >
                    {/* Delete */}
                    <button
                      className="del-btn btn-p"
                      onClick={e => { e.stopPropagation(); setConfirmModal({ isOpen: true, serviceId: svc.id }); }}
                      style={{
                        position: 'absolute', top: 8, right: 8, zIndex: 2,
                        width: 26, height: 26, borderRadius: 7,
                        background: `${t.danger}18`, border: `1px solid ${t.danger}30`,
                        color: t.danger, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>

                    {/* Foto */}
                    {svc.refPhoto ? (
                      <div style={{ position: 'relative' }}>
                        <label onClick={e => e.stopPropagation()} style={{ cursor: 'pointer', display: 'block' }}>
                          <img src={svc.refPhoto} alt={svc.name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                          <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => handlePhoto(e.target.files[0], svc.id)} />
                        </label>
                        <button
                          onClick={e => { e.stopPropagation(); removePhoto(svc.id); }}
                          style={{
                            position: 'absolute', bottom: 6, right: 6,
                            width: 22, height: 22, borderRadius: 6,
                            background: `${t.danger}20`, border: `1px solid ${t.danger}35`,
                            color: t.danger, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <label onClick={e => e.stopPropagation()} style={{ cursor: 'pointer', display: 'block' }}>
                        <div style={{
                          height: 90, background: t.surface, border: `2px dashed ${t.border}`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                        }}>
                          <Image size={18} color={t.textDim} />
                          <span style={{ fontSize: 10, color: t.textDim }}>Añadir foto</span>
                        </div>
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => handlePhoto(e.target.files[0], svc.id)} />
                      </label>
                    )}

                    {/* Info */}
                    <div style={{ padding: '12px 12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {svc.name || 'Sin nombre'}
                      </div>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: t.accent }}>
                        {fmt(svc.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {services.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', gap: 10 }}>
                  <Settings size={24} color={t.textDim} />
                  <span style={{ fontSize: 13, color: t.textMuted }}>No hay servicios configurados</span>
                </div>
              )}
            </div>

            {/* ─── Panel de edición ─── */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <FileText size={14} color={t.accent} />
                <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Detalles del servicio</span>
              </div>

              {!selectedService ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: t.surface,
                    border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Edit size={20} color={t.textDim} />
                  </div>
                  <p style={{ fontSize: 13, color: t.textMuted, textAlign: 'center' }}>
                    Seleccioná un servicio<br />para editar sus detalles
                  </p>
                </div>
              ) : (
                <div className="detail-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Banner */}
                  <div style={{
                    background: `${t.accent}10`, border: `1px solid ${t.accent}25`,
                    borderRadius: 10, padding: '9px 14px',
                    fontSize: 12, color: t.accent, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Edit size={12} />
                    Editando: <strong>{selectedService.name}</strong>
                  </div>

                  {/* Foto de referencia */}
                  <div>
                    <Label>Foto de referencia</Label>
                    {formData.fotoReferencia ? (
                      <div style={{ position: 'relative' }}>
                        <label style={{ cursor: 'pointer', display: 'block' }}>
                          <img src={formData.fotoReferencia} alt="Preview" style={{
                            width: '100%', height: 130, objectFit: 'cover',
                            borderRadius: 12, border: `1px solid ${t.border}`,
                          }} />
                          <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => handlePhoto(e.target.files[0])} />
                        </label>
                        <button onClick={() => removePhoto()} style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 26, height: 26, borderRadius: 7,
                          background: `${t.danger}20`, border: `1px solid ${t.danger}35`,
                          color: t.danger, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-zone" style={{ height: 90 }}>
                        <Upload size={20} color={t.textMuted} style={{ marginBottom: 5 }} />
                        <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>Subir imagen</span>
                        <span style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>PNG, JPG · máx 5MB</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => handlePhoto(e.target.files[0])} />
                      </label>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <Label>Nombre de atención</Label>
                    <input name="nombreAtencion" value={formData.nombreAtencion}
                      onChange={handleInput} placeholder="Ej: Corte de cabello premium"
                      className="pf-input" />
                  </div>

                  {/* Precio y Duración */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <Label>Precio</Label>
                      <IconInput icon={DollarSign} name="precio" type="number"
                        value={formData.precio} onChange={handleInput} placeholder="0" />
                    </div>
                    <div>
                      <Label>Duración mínima</Label>
                      <IconInput icon={Clock} name="duracionMin" type="number"
                        value={formData.duracionMin} onChange={handleInput} placeholder="30" right="min" />
                    </div>
                  </div>

                  {/* Profesionales */}
                  <div>
                    <Label>Profesionales asignados</Label>
                    <IconInput
                      icon={UserCheck} name="profesionales"
                      value={formData.profesionales}
                      readOnly
                      onClick={() => navigate('/configuracionprofesionales')}
                      placeholder="Tocar para seleccionar..."
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  {/* Estado toggle */}
                  <div style={{
                    background: t.surface, border: `1px solid ${t.border}`,
                    borderRadius: 11, padding: '12px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 2 }}>Estado del servicio</div>
                      <div style={{ fontSize: 11, color: t.textMuted }}>{formData.activo ? 'Activo — visible para clientes' : 'Inactivo — oculto'}</div>
                    </div>
                    <Toggle
                      checked={formData.activo}
                      onChange={val => setFormData(prev => ({ ...prev, activo: val }))}
                    />
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                    <button onClick={() => { setSelected(null); setFormData(EMPTY_FORM); }} className="btn-g" style={{
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
            padding: '11px 16px',
          }}>
            <p style={{ fontSize: 12, color: t.info }}>
              <strong>💡 Tip:</strong> Hacé clic en la imagen de una card para cambiarla directamente. Los cambios se guardan al presionar "Guardar cambios".
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="¿Eliminar servicio?"
        message="Esta acción no se puede deshacer. El servicio se eliminará permanentemente."
        onConfirm={removeService}
        onCancel={() => setConfirmModal({ isOpen: false, serviceId: null })}
      />
    </>
  );
}