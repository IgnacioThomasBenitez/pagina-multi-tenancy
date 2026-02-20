import React, { useState, useEffect } from "react";
import {
  X, Calendar, Clock, Scissors, Star, ChevronRight,
  Sparkles, Phone, User, CheckCircle, Tag,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

import corteImg      from "../../assets/services/corte.png";
import manicureImg   from "../../assets/services/manicure.png";
import facialImg     from "../../assets/services/facial.png";
import masajeImg     from "../../assets/services/masaje.png";
import depilacionImg from "../../assets/services/depilacion.png";
import pedicureImg   from "../../assets/services/pedicure.png";

/* ─── Paleta unificada ─── */
const theme = {
  bg: '#0a0d12',
  surface: '#111720',
  card: '#161d28',
  border: '#1e2d3d',
  borderLight: '#243447',
  accent: '#10b981',
  accentMuted: '#064e3b',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#334155',
  danger: '#ef4444',
  purple: '#8b5cf6',
  info: '#38bdf8',
  gold: '#f59e0b',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .trn-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }

  /* Pulse */
  .live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: ${theme.accent};
    display: inline-block; flex-shrink: 0;
    animation: livePulse 2s infinite;
  }
  @keyframes livePulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.35; transform:scale(0.6); }
  }

  /* Service cards */
  .svc-card {
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer; text-align: left;
    background: ${theme.card};
    border: 1px solid ${theme.border};
    border-radius: 18px;
    overflow: hidden;
    display: flex; flex-direction: column;
  }
  .svc-card:hover {
    transform: translateY(-4px);
    border-color: var(--glow-color, ${theme.accent});
    box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--glow-color, ${theme.accent})44;
  }
  .svc-card:hover .svc-img { transform: scale(1.08); }
  .svc-card:hover .svc-glow { opacity: 1; }
  .svc-card:hover .svc-arrow { opacity: 1; transform: translateX(0); }
  .svc-img { transition: transform 0.35s ease; }
  .svc-glow { transition: opacity 0.25s ease; opacity: 0; }
  .svc-arrow { transition: opacity 0.25s ease, transform 0.25s ease; opacity: 0; transform: translateX(-6px); }

  /* Inputs */
  .trn-input {
    width: 100%;
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 12px 14px 12px 40px;
    color: ${theme.text};
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .trn-input::placeholder { color: ${theme.textMuted}; }
  .trn-input:focus { border-color: ${theme.accent}; background: ${theme.accent}08; }
  .trn-input::-webkit-calendar-picker-indicator { filter: invert(0.4); }

  /* Modal */
  .trn-backdrop { animation: bIn 0.18s ease; }
  @keyframes bIn { from{opacity:0} to{opacity:1} }
  .trn-modal { animation: mIn 0.28s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes mIn { from{opacity:0;transform:scale(0.92) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* Toast */
  .trn-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: ${theme.accentMuted};
    border: 1px solid ${theme.accent}50;
    border-radius: 12px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 10px;
    color: ${theme.accent};
    font-weight: 600; font-size: 14px;
    z-index: 200;
    animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    font-family: 'Sora', sans-serif;
  }
  @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes toastOut { to{opacity:0;transform:translateY(6px)} }

  .btn-confirm { transition: all 0.15s ease; }
  .btn-confirm:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-confirm:active { transform: translateY(0); }
`;

/* ─── Servicios ─── */
const SERVICES = [
  { id: 1, nombre: "Corte de Cabello",   precio: 500, img: corteImg,      glow: "#3b82f6", tag: "Pelo",   duration: "45 min" },
  { id: 2, nombre: "Manicure",           precio: 350, img: manicureImg,   glow: "#ec4899", tag: "Uñas",   duration: "60 min" },
  { id: 3, nombre: "Tratamiento Facial", precio: 800, img: facialImg,     glow: "#a855f7", tag: "Piel",   duration: "90 min" },
  { id: 4, nombre: "Masaje Relajante",   precio: 400, img: masajeImg,     glow: "#22c55e", tag: "Cuerpo", duration: "60 min" },
  { id: 5, nombre: "Depilación",         precio: 600, img: depilacionImg, glow: "#f59e0b", tag: "Cuerpo", duration: "30 min" },
  { id: 6, nombre: "Pedicure",           precio: 300, img: pedicureImg,   glow: "#ef4444", tag: "Uñas",   duration: "50 min" },
];

const fmt = (n) => `$${Number(n).toLocaleString("es-AR")}`;

/* ─── Input con icono ─── */
function Field({ icon: Icon, ...props }) {
  return (
    <div style={{ position: "relative" }}>
      <Icon size={14} color={theme.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      <input className="trn-input" {...props} />
    </div>
  );
}

export default function Turnos() {
  const [selected, setSelected]   = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [time, setTime]           = useState(new Date());
  const [form, setForm]           = useState({ cliente: "", telefono: "", fecha: "", hora: "" });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openModal = (service) => {
    setSelected(service);
    setForm({ cliente: "", telefono: "", fecha: "", hora: "" });
    setShowModal(true);
  };

  const confirm = () => {
    console.log("Turno:", { servicio: selected, ...form });
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const dateStr = time.toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long" });
  const timeStr = time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  /* ─── Input style ─── */
  const inputStyle = {
    width: "100%",
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "12px 14px 12px 40px",
    color: theme.text,
    fontFamily: "Sora, sans-serif",
    fontSize: 14,
    outline: "none",
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="trn-root" style={{ display: "flex", height: "100vh", background: theme.bg }}>
        <Sidebar />

        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* ─── Header ─── */}
            <div style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              padding: "24px 28px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: `${theme.accent}15`, border: `1px solid ${theme.accent}30`,
                  borderRadius: 20, padding: "3px 12px",
                  fontSize: 10, color: theme.accent, fontWeight: 700,
                  letterSpacing: "0.8px", textTransform: "uppercase",
                  marginBottom: 10,
                }}>
                  <Sparkles size={10} /> Sacar turnos
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: "-0.5px", marginBottom: 4 }}>
                  Servicios Disponibles
                </h1>
                <p style={{ fontSize: 13, color: theme.textMuted }}>
                  Seleccioná un servicio para agendar tu turno
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: theme.textMuted, display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end", marginBottom: 6 }}>
                  <Calendar size={12} />
                  <span style={{ textTransform: "capitalize" }}>{dateStr}</span>
                </div>
                <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: theme.text, display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                  <span className="live-dot" />
                  {timeStr}
                </div>
              </div>
            </div>

            {/* ─── Stats rápidas ─── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Servicios", value: SERVICES.length, color: theme.info },
                { label: "Desde", value: fmt(Math.min(...SERVICES.map(s => s.precio))), color: theme.accent },
                { label: "Turnos hoy", value: "8", color: theme.purple },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  background: theme.card, border: `1px solid ${theme.border}`,
                  borderRadius: 14, padding: "16px 20px",
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <div style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* ─── Separador ─── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Scissors size={13} color={theme.accent} />
              <span style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
                Nuestros servicios
              </span>
              <div style={{ flex: 1, height: 1, background: theme.border }} />
              <span style={{ fontSize: 11, color: theme.textDim }}>{SERVICES.length} disponibles</span>
            </div>

            {/* ─── Grid ─── */}
            <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {SERVICES.map((svc) => (
                <button
                  key={svc.id}
                  className="svc-card"
                  onClick={() => openModal(svc)}
                  style={{ "--glow-color": svc.glow }}
                >
                  {/* Imagen */}
                  <div style={{
                    height: 140, position: "relative", overflow: "hidden",
                    background: `linear-gradient(135deg, ${svc.glow}33, ${svc.glow}11)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderBottom: `1px solid ${theme.border}`,
                  }}>
                    <div
                      className="svc-glow"
                      style={{
                        position: "absolute", inset: 0,
                        background: `radial-gradient(circle at center, ${svc.glow}50 0%, transparent 70%)`,
                      }}
                    />
                    <img
                      src={svc.img}
                      alt={svc.nombre}
                      className="svc-img"
                      style={{ width: 80, height: 80, objectFit: "contain", filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.5))", position: "relative", zIndex: 1 }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "18px 18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        background: `${svc.glow}18`, border: `1px solid ${svc.glow}35`,
                        borderRadius: 5, padding: "1px 7px",
                        fontSize: 9, fontWeight: 700, color: svc.glow,
                        textTransform: "uppercase", letterSpacing: "0.6px",
                      }}>
                        {svc.tag}
                      </div>
                      <div style={{ fontSize: 11, color: theme.textMuted, display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={10} /> {svc.duration}
                      </div>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>
                      {svc.nombre}
                    </h3>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginTop: "auto", paddingTop: 14,
                      borderTop: `1px solid ${theme.border}`,
                    }}>
                      <div>
                        <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: theme.accent }}>
                          {fmt(svc.precio)}
                        </span>
                        <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 4 }}>/ sesión</span>
                      </div>
                      <div
                        className="svc-arrow"
                        style={{
                          width: 30, height: 30, borderRadius: "50%",
                          background: `${svc.glow}15`, border: `1px solid ${svc.glow}35`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: svc.glow,
                        }}
                      >
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </section>
          </div>
        </main>

        {/* ─── Modal ─── */}
        {showModal && (
          <div
            className="trn-backdrop"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 50, padding: 16,
            }}
          >
            <div
              className="trn-modal"
              style={{
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 22, padding: 32, width: "100%", maxWidth: 420,
                position: "relative",
              }}
            >
              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 30, height: 30, borderRadius: 8,
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  color: theme.textMuted, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: theme.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                  Nuevo turno
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>Agendar Servicio</h3>
              </div>

              {/* Servicio seleccionado */}
              {selected && (
                <div style={{
                  background: theme.surface, border: `1px solid ${selected.glow}30`,
                  borderRadius: 12, padding: "14px 16px", marginBottom: 20,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Servicio</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{selected.nombre}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} /> {selected.duration}
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: theme.accent }}>
                    {fmt(selected.precio)}
                  </div>
                </div>
              )}

              {/* Formulario */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                <div style={{ position: "relative" }}>
                  <User size={14} color={theme.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    className="trn-input"
                    name="cliente" value={form.cliente}
                    onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <Phone size={14} color={theme.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    className="trn-input"
                    name="telefono" value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="Teléfono"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ position: "relative" }}>
                    <Calendar size={14} color={theme.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      className="trn-input"
                      type="date" name="fecha" value={form.fecha}
                      onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    />
                  </div>
                  <div style={{ position: "relative" }}>
                    <Clock size={14} color={theme.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      className="trn-input"
                      type="time" name="hora" value={form.hora}
                      onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Confirmar */}
              <button
                className="btn-confirm"
                onClick={confirm}
                style={{
                  width: "100%", padding: "14px",
                  background: theme.accent, border: "none", borderRadius: 12,
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Star size={15} />
                Confirmar Turno
              </button>
            </div>
          </div>
        )}

        {/* ─── Toast ─── */}
        {showToast && (
          <div className="trn-toast">
            <CheckCircle size={17} />
            Turno agendado con éxito
          </div>
        )}
      </div>
    </>
  );
}