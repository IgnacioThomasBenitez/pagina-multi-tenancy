import React from 'react';
import {
  ShoppingCart, Package, TrendingUp, Users, DollarSign,
  Settings, Cog, ArrowUpRight, ArrowDownRight, ChevronRight,
  UtensilsCrossed, LayoutDashboard, Clock, Receipt,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/* ─── Paleta unificada ─── */
const theme = {
  bg: '#0a0d12',
  surface: '#111720',
  card: '#161d28',
  border: '#1e2d3d',
  borderLight: '#243447',
  accent: '#10b981',
  accentMuted: '#065f46',
  gold: '#f59e0b',
  danger: '#ef4444',
  info: '#38bdf8',
  purple: '#8b5cf6',
  orange: '#f97316',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#334155',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .inicio-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }

  .stat-card { transition: all 0.2s ease; }
  .stat-card:hover { transform: translateY(-2px); border-color: ${theme.borderLight} !important; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }

  .quick-btn { transition: all 0.2s ease; border: none; background: none; cursor: pointer; text-align: left; }
  .quick-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
  .quick-btn:hover .quick-icon { transform: scale(1.1); }
  .quick-icon { transition: transform 0.2s ease; }

  .activity-row { transition: background 0.15s ease; border-radius: 10px; }
  .activity-row:hover { background: ${theme.border}22; }

  .view-all { transition: color 0.15s ease; background: none; border: none; cursor: pointer; }
  .view-all:hover { color: ${theme.accent} !important; }

  .fade-in { animation: fi 0.4s ease both; }
  .fade-in-1 { animation: fi 0.4s ease 0.05s both; }
  .fade-in-2 { animation: fi 0.4s ease 0.1s both; }
  .fade-in-3 { animation: fi 0.4s ease 0.15s both; }
  @keyframes fi { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;

const fmt = (n) => `$${Number(n).toLocaleString('es-AR')}`;

/* ─── Stats ─── */
const stats = [
  { label: 'Ventas de Hoy', value: fmt(42850), icon: DollarSign, color: theme.accent, change: '+12.5%', up: true, sub: 'vs. ayer' },
  { label: 'Productos', value: '120', icon: Package, color: theme.info, change: '+3', up: true, sub: 'en inventario' },
  { label: 'Pedidos Hoy', value: '18', icon: ShoppingCart, color: theme.purple, change: '+5', up: true, sub: 'transacciones' },
  { label: 'Clientes', value: '57', icon: Users, color: theme.orange, change: '+8', up: true, sub: 'activos' },
];

/* ─── Accesos rápidos ─── */
const quickAccess = [
  { title: 'Registrar Venta', icon: ShoppingCart, path: '/ventas', desc: 'Nueva transacción', color: theme.accent },
  { title: 'Inventario', icon: Package, path: '/inventario', desc: 'Gestionar productos', color: theme.info },
  { title: 'Mesas', icon: UtensilsCrossed, path: '/mesas', desc: 'Ver disponibilidad', color: theme.purple },
  { title: 'Cocina', icon: UtensilsCrossed, path: '/cocina', desc: 'Pedidos pendientes', color: theme.orange },
  { title: 'Reportes', icon: TrendingUp, path: '/configuracionservicio', desc: 'Análisis y métricas', color: theme.gold },
  { title: 'Configuración', icon: Cog, path: '/configuracionprofecional', desc: 'Sistema', color: theme.textMuted },
];

/* ─── Actividad reciente ─── */
const recentActivity = [
  { id: 1, action: 'Nueva venta registrada', amount: '$1.250', time: '10:30 AM', type: 'venta' },
  { id: 2, action: 'Producto agregado al inventario', amount: '15 un.', time: '09:45 AM', type: 'inventario' },
  { id: 3, action: 'Mesa 5 cerrada', amount: '$850', time: '09:20 AM', type: 'mesa' },
  { id: 4, action: 'Pago recibido', amount: '$2.300', time: '08:55 AM', type: 'pago' },
];

const activityMeta = {
  venta:      { color: theme.accent,  label: 'Venta' },
  inventario: { color: theme.info,    label: 'Inventario' },
  mesa:       { color: theme.purple,  label: 'Mesa' },
  pago:       { color: theme.gold,    label: 'Pago' },
};

/* ─── StatCard ─── */
function StatCard({ label, value, icon: Icon, color, change, up, sub }) {
  return (
    <div className="stat-card" style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: 16, padding: '22px 22px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: `${color}18`, border: `1px solid ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3, fontSize: 11,
          fontWeight: 700, color: up ? theme.accent : theme.danger,
          background: up ? `${theme.accent}12` : `${theme.danger}12`,
          padding: '3px 8px', borderRadius: 20,
        }}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>

      <div>
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: theme.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 5 }}>{label}</div>
      </div>

      <div style={{ fontSize: 11, color: theme.textDim, borderTop: `1px solid ${theme.border}`, paddingTop: 10 }}>
        {sub}
      </div>
    </div>
  );
}

/* ─── INICIO ─── */
export default function Inicio() {
  const navigate = useNavigate();

  return (
    <>
      <style>{STYLES}</style>
      <div className="inicio-root" style={{ display: 'flex', height: '100vh', background: theme.bg, overflow: 'hidden' }}>
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ─── Header ─── */}
          <div style={{
            padding: '24px 32px 22px',
            borderBottom: `1px solid ${theme.border}`,
            background: theme.surface,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: '-0.5px', marginBottom: 4 }}>
                  Bienvenido de vuelta 👋
                </h1>
                <p style={{ fontSize: 13, color: theme.textMuted }}>
                  {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Indicador hora */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 10, padding: '8px 14px',
              }}>
                <Clock size={13} color={theme.textMuted} />
                <span className="mono" style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>
                  {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent }} />
              </div>
            </div>
          </div>

          {/* ─── Body ─── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Stats */}
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            {/* Quick access + Activity */}
            <div className="fade-in-1" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

              {/* Accesos rápidos */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Accesos Rápidos</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {quickAccess.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        className="quick-btn"
                        onClick={() => navigate(item.path)}
                        style={{
                          background: theme.card,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 16,
                          padding: '20px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                        }}
                      >
                        <div
                          className="quick-icon"
                          style={{
                            width: 42, height: 42, borderRadius: 11,
                            background: `${item.color}18`, border: `1px solid ${item.color}28`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Icon size={18} color={item.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 3 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: 11, color: theme.textMuted }}>
                            {item.desc}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: item.color }}>
                          Ir <ChevronRight size={11} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actividad reciente */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Actividad Reciente</h2>
                  <button
                    className="view-all"
                    onClick={() => navigate('/resumenes')}
                    style={{ fontSize: 11, color: theme.textMuted, fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', gap: 3 }}
                  >
                    Ver todo <ChevronRight size={11} />
                  </button>
                </div>

                <div style={{
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: '6px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {recentActivity.map((activity, idx) => {
                    const meta = activityMeta[activity.type];
                    return (
                      <div
                        key={activity.id}
                        className="activity-row"
                        style={{
                          padding: '12px 12px',
                          borderBottom: idx < recentActivity.length - 1 ? `1px solid ${theme.border}` : 'none',
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                        }}
                      >
                        {/* Dot */}
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, flexShrink: 0, marginTop: 1,
                          background: `${meta.color}15`, border: `1px solid ${meta.color}25`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Receipt size={13} color={meta.color} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: theme.text, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
                            {activity.action}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{
                              fontSize: 10, fontWeight: 600,
                              color: meta.color,
                              background: `${meta.color}12`,
                              padding: '1px 7px',
                              borderRadius: 5,
                            }}>
                              {meta.label}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>
                                {activity.amount}
                              </span>
                              <span style={{ fontSize: 10, color: theme.textDim }}>
                                {activity.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── Banner inferior ─── */}
            <div className="fade-in-2" style={{
              background: `linear-gradient(135deg, ${theme.accentMuted}80, ${theme.card})`,
              border: `1px solid ${theme.accent}30`,
              borderRadius: 16,
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 3 }}>
                  Ver análisis completo del negocio
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>
                  Gráficos, tendencias y métricas detalladas en el Dashboard
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '10px 20px',
                  background: theme.accent,
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
              >
                <LayoutDashboard size={15} />
                Ir al Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}