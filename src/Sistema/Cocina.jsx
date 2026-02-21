import React, { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle, X, ChefHat, AlertCircle, Flame, Utensils } from 'lucide-react';
import Sidebar from '../components/Sidebar';

/* ─── Paleta unificada ─── */
const t = {
  bg: '#0a0d12', surface: '#111720', card: '#161d28',
  border: '#1e2d3d', borderLight: '#243447',
  accent: '#10b981', accentMuted: '#064e3b',
  text: '#e2e8f0', textMuted: '#64748b', textDim: '#334155',
  danger: '#ef4444', gold: '#f59e0b', purple: '#8b5cf6', info: '#38bdf8',
};

const STATUS = {
  'entrante':  { color: t.accent, bg: `${t.accent}18`, border: `${t.accent}35`, label: 'Entrante',  pulse: false },
  'tardando':  { color: t.gold,   bg: `${t.gold}15`,   border: `${t.gold}30`,   label: 'Preparando', pulse: false },
  'muy-tarde': { color: t.danger, bg: `${t.danger}15`, border: `${t.danger}30`, label: 'Muy tarde', pulse: true  },
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .kitch-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }

  .order-card {
    background: ${t.card}; border: 1px solid ${t.border};
    border-radius: 18px; cursor: pointer; overflow: hidden;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    display: flex; flex-direction: column;
  }
  .order-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); border-color: ${t.borderLight}; }
  .order-card.active { border-color: ${t.accent}; box-shadow: 0 0 0 1px ${t.accent}30, 0 12px 32px rgba(16,185,129,0.12); }
  .order-card.status-muy-tarde { border-color: ${t.danger}40; }

  .stat-c { transition: transform 0.2s ease; }
  .stat-c:hover { transform: translateY(-2px); }

  .btn-p { transition: all 0.15s ease; cursor: pointer; border: none; }
  .btn-p:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.25); }
  .btn-p:active { transform: translateY(0); }

  /* Drawer */
  .drawer { 
    position: fixed; right: 0; top: 0; height: 100vh; width: 460px;
    background: ${t.surface}; border-left: 1px solid ${t.border};
    z-index: 50; overflow-y: auto;
    transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .drawer.open { transform: translateX(0); }

  .backdrop { 
    position: fixed; inset: 0; background: rgba(0,0,0,0.65);
    backdropFilter: blur(4px); z-index: 40;
    animation: bdIn 0.2s ease;
  }
  @keyframes bdIn { from{opacity:0}to{opacity:1} }

  /* Status dot pulse */
  .dot-pulse { animation: dp 1.5s infinite; }
  @keyframes dp { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

  /* Time urgency glow on card */
  .urgency-glow { box-shadow: 0 0 20px ${t.danger}25, 0 12px 32px rgba(0,0,0,0.4); }

  /* Notification badge */
  .notif-badge {
    position: absolute; top: -4px; right: -4px;
    width: 16px; height: 16px; border-radius: 50%;
    background: ${t.danger}; font-size: 9px; font-weight: 700; color: #fff;
    display: flex; align-items: center; justify-content: center;
    animation: dp 1.5s infinite;
  }

  /* Item rows */
  .item-row { transition: background 0.15s; }
  .item-row:hover { background: ${t.border}22 !important; }
`;

const formatTime = (min) => {
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)}h ${min % 60}min`;
};

/* ─── Stat Card ─── */
function StatCard({ label, value, color, Icon }) {
  return (
    <div className="stat-c" style={{
      background: t.card, border: `1px solid ${t.border}`, borderRadius: 14,
      padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{label}</div>
        <div className="mono" style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}18`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={color} />
      </div>
    </div>
  );
}

/* ─── Status pill ─── */
function StatusPill({ status }) {
  const cfg = STATUS[status] || STATUS['entrante'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700,
    }}>
      <span
        className={cfg.pulse ? 'dot-pulse' : ''}
        style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }}
      />
      {cfg.label}
    </span>
  );
}

/* ─── MAIN ─── */
const RestaurantOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [orders, setOrders]               = useState([]);
  const [finalizados, setFinalizados]     = useState(0);

  useEffect(() => {
    loadOrders();
    loadFinalizados();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const updated = prev.map(o => {
          const newTime = o.time + 1;
          let status = o.status;
          if (newTime > 20) status = 'muy-tarde';
          else if (newTime > 10) status = 'tardando';
          return { ...o, time: newTime, status };
        });
        if (updated.length) localStorage.setItem('kitchenOrders', JSON.stringify(updated));
        return updated;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const raw = localStorage.getItem('kitchenOrders');
    if (raw) setOrders(JSON.parse(raw));
  };

  const loadFinalizados = () => {
    const n = localStorage.getItem('finalizadosCount');
    if (n) setFinalizados(parseInt(n));
  };

  const openOrder = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const markAsReady = (orderId) => {
    const newCount = finalizados + 1;
    setFinalizados(newCount);
    localStorage.setItem('finalizadosCount', newCount.toString());
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('kitchenOrders', JSON.stringify(updated));
    closeDrawer();
  };

  const grouped = {
    entrante:   orders.filter(o => o.status === 'entrante'),
    tardando:   orders.filter(o => o.status === 'tardando'),
    'muy-tarde': orders.filter(o => o.status === 'muy-tarde'),
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="kitch-root" style={{ display: 'flex', height: '100vh', background: t.bg }}>
        <Sidebar />

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 30px' }}>

          {/* ─── Header ─── */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 18, padding: '20px 26px', marginBottom: 22,
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
                <ChefHat size={10} /> Cocina en vivo
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 3 }}>
                Sistema de Órdenes
              </h1>
              <p style={{ fontSize: 13, color: t.textMuted }}>
                Actualización automática desde Mesas · cada 2 seg
              </p>
            </div>

            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: `${t.accent}15`, border: `1px solid ${t.accent}30`,
                borderRadius: 10, padding: '8px 14px',
                fontSize: 12, color: t.accent, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
                En vivo
              </div>
            </div>
          </div>

          {/* ─── Stats ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
            <StatCard label="Finalizados"   value={finalizados}                    color={t.info}   Icon={CheckCircle} />
            <StatCard label="Entrantes"     value={grouped.entrante.length}        color={t.accent} Icon={Utensils}    />
            <StatCard label="Preparando"    value={grouped.tardando.length}        color={t.gold}   Icon={Clock}       />
            <StatCard label="Muy tarde"     value={grouped['muy-tarde'].length}    color={t.danger} Icon={Flame}       />
          </div>

          {/* ─── Estado visual por columna ─── */}
          <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 16, padding: '16px 20px', marginBottom: 22,
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          }}>
            {[
              { key: 'entrante',   label: 'Entrante',   color: t.accent, count: grouped.entrante.length    },
              { key: 'tardando',   label: 'Preparando', color: t.gold,   count: grouped.tardando.length   },
              { key: 'muy-tarde',  label: 'Muy tarde',  color: t.danger, count: grouped['muy-tarde'].length, pulse: true },
            ].map(({ key, label, color, count, pulse }) => (
              <div key={key} style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: '12px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    className={pulse && count > 0 ? 'dot-pulse' : ''}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{label}</span>
                </div>
                <span className="mono" style={{ fontSize: 20, fontWeight: 700, color }}>{count}</span>
              </div>
            ))}
          </div>

          {/* ─── Grid de órdenes ─── */}
          {orders.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: t.card, border: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ChefHat size={28} color={t.textDim} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.textMuted, marginBottom: 4 }}>No hay órdenes activas</div>
                <div style={{ fontSize: 13, color: t.textDim }}>Las nuevas órdenes aparecerán aquí desde Mesas</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {orders.map(order => {
                const cfg = STATUS[order.status] || STATUS['entrante'];
                const isActive = selectedOrder?.id === order.id && drawerOpen;
                const isUrgent = order.status === 'muy-tarde';
                return (
                  <div
                    key={order.id}
                    className={`order-card ${isActive ? 'active' : ''} ${isUrgent ? 'status-muy-tarde' : ''}`}
                    onClick={() => openOrder(order)}
                  >
                    {/* Color bar superior */}
                    <div style={{ height: 3, background: cfg.color, opacity: 0.7 }} />

                    <div style={{ padding: '16px 16px 14px' }}>
                      {/* Top row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: t.text, marginBottom: 2 }}>{order.table}</div>
                          <div className="mono" style={{ fontSize: 10, color: t.textDim }}>#{order.id}</div>
                        </div>
                        <StatusPill status={order.status} />
                      </div>

                      {/* Meta */}
                      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: t.textMuted }}>
                          <Clock size={12} />
                          <span className="mono" style={{ fontWeight: 600, color: order.status === 'muy-tarde' ? t.danger : order.status === 'tardando' ? t.gold : t.text }}>
                            {formatTime(order.time)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: t.textMuted }}>
                          <Users size={12} />
                          <span>{order.guests} items</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: order.notes ? 10 : 14 }}>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="item-row" style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: t.surface, borderRadius: 8, padding: '7px 10px',
                            border: `1px solid ${t.border}`,
                          }}>
                            <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{item.name}</span>
                            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: t.textMuted }}>x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div style={{ fontSize: 11, color: t.textDim, textAlign: 'center', paddingTop: 2 }}>
                            +{order.items.length - 3} más...
                          </div>
                        )}
                      </div>

                      {/* Nota */}
                      {order.notes && (
                        <div style={{
                          background: `${t.gold}10`, border: `1px solid ${t.gold}25`,
                          borderLeft: `2px solid ${t.gold}`, borderRadius: '0 8px 8px 0',
                          padding: '7px 10px', marginBottom: 12, fontSize: 11, color: t.gold,
                        }}>
                          📝 {order.notes}
                        </div>
                      )}

                      {/* Botón */}
                      <button
                        className="btn-p"
                        onClick={e => { e.stopPropagation(); markAsReady(order.id); }}
                        style={{
                          width: '100%', padding: '10px', background: t.accent, border: 'none',
                          borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 12,
                          fontFamily: 'Sora, sans-serif',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        <CheckCircle size={14} /> Finalizar pedido
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Backdrop ─── */}
        {drawerOpen && (
          <div className="backdrop" onClick={closeDrawer} />
        )}

        {/* ─── Drawer lateral ─── */}
        <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
          {selectedOrder && (() => {
            const cfg = STATUS[selectedOrder.status] || STATUS['entrante'];
            return (
              <div style={{ padding: '28px 26px' }}>
                {/* Close */}
                <button
                  onClick={closeDrawer}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    width: 32, height: 32, borderRadius: 9,
                    background: t.card, border: `1px solid ${t.border}`,
                    color: t.textMuted, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <X size={15} />
                </button>

                {/* Header */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                    Orden #{selectedOrder.id}
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 8 }}>
                    {selectedOrder.table}
                  </h2>
                  <StatusPill status={selectedOrder.status} />
                </div>

                {/* Meta cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
                  <div style={{
                    background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: `${t.info}18`, border: `1px solid ${t.info}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Clock size={14} color={t.info} />
                      </div>
                      <span style={{ fontSize: 11, color: t.textMuted }}>Tiempo</span>
                    </div>
                    <div className="mono" style={{
                      fontSize: 20, fontWeight: 700,
                      color: selectedOrder.status === 'muy-tarde' ? t.danger : selectedOrder.status === 'tardando' ? t.gold : t.text,
                    }}>
                      {formatTime(selectedOrder.time)}
                    </div>
                  </div>
                  <div style={{
                    background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: `${t.purple}18`, border: `1px solid ${t.purple}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Users size={14} color={t.purple} />
                      </div>
                      <span style={{ fontSize: 11, color: t.textMuted }}>Items</span>
                    </div>
                    <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: t.text }}>
                      {selectedOrder.guests}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
                    Items del pedido
                  </div>
                  <div style={{
                    background: t.card, border: `1px solid ${t.border}`,
                    borderRadius: 14, overflow: 'hidden',
                  }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '13px 16px',
                        borderBottom: idx < selectedOrder.items.length - 1 ? `1px solid ${t.border}` : 'none',
                      }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{item.name}</div>
                          {item.notes && (
                            <div style={{ fontSize: 11, color: t.gold, marginTop: 2 }}>📝 {item.notes}</div>
                          )}
                        </div>
                        <div className="mono" style={{
                          fontSize: 14, fontWeight: 700,
                          background: `${t.accent}15`, color: t.accent,
                          border: `1px solid ${t.accent}25`,
                          borderRadius: 8, padding: '3px 10px',
                        }}>
                          ×{item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas especiales */}
                {selectedOrder.notes && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
                      Notas especiales
                    </div>
                    <div style={{
                      background: `${t.gold}10`, border: `1px solid ${t.gold}25`,
                      borderLeft: `3px solid ${t.gold}`, borderRadius: '0 12px 12px 0',
                      padding: '14px 16px', fontSize: 13, color: t.gold, lineHeight: 1.5,
                    }}>
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}

                {/* Finalizar */}
                <button
                  className="btn-p"
                  onClick={() => markAsReady(selectedOrder.id)}
                  style={{
                    width: '100%', padding: '15px', background: t.accent, border: 'none',
                    borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15,
                    fontFamily: 'Sora, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <CheckCircle size={18} /> Finalizar pedido
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default RestaurantOrders;