import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShoppingCart, UtensilsCrossed, User, CheckCircle, Send } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

/* ─── Paleta unificada ─── */
const t = {
  bg: '#0a0d12', surface: '#111720', card: '#161d28',
  border: '#1e2d3d', borderLight: '#243447',
  accent: '#10b981', accentMuted: '#064e3b',
  text: '#e2e8f0', textMuted: '#64748b', textDim: '#334155',
  danger: '#ef4444', gold: '#f59e0b', purple: '#8b5cf6', info: '#38bdf8',
};

const STATUS_CFG = {
  OCUPADO: { color: '#f97316', bg: '#f9731615', border: '#f9731630', label: 'Ocupado'  },
  ESPERA:  { color: t.gold,   bg: `${t.gold}15`, border: `${t.gold}30`, label: 'Espera'   },
  LIBRE:   { color: t.accent, bg: `${t.accent}15`, border: `${t.accent}30`, label: 'Libre'    },
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .tm-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }

  /* Mesa cards */
  .mesa-card {
    background: ${t.card}; border: 1px solid ${t.border};
    border-radius: 16px; cursor: pointer; overflow: hidden; position: relative;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .mesa-card:hover { transform: translateY(-3px); border-color: ${t.borderLight}; box-shadow: 0 12px 28px rgba(0,0,0,0.4); }
  .mesa-card .del-btn { opacity: 0; transition: opacity 0.15s; }
  .mesa-card:hover .del-btn { opacity: 1; }

  /* Menu items */
  .menu-item {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px;
    padding: 12px; cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
  }
  .menu-item:hover { border-color: ${t.accent}; background: ${t.accent}06; transform: translateY(-1px); }

  /* Order item rows */
  .order-item {
    background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 12px; padding: 12px 14px;
    transition: border-color 0.15s;
  }
  .order-item:hover { border-color: ${t.borderLight}; }

  /* Inputs */
  .tm-input {
    width: 100%; background: ${t.bg}; border: 1px solid ${t.border};
    border-radius: 9px; padding: 10px 13px; color: ${t.text};
    font-family: 'Sora', sans-serif; font-size: 13px; outline: none;
    transition: border-color 0.15s;
  }
  .tm-input::placeholder { color: ${t.textMuted}; }
  .tm-input:focus { border-color: ${t.accent}; }
  .tm-select {
    width: 100%; background: ${t.bg}; border: 1px solid ${t.border};
    border-radius: 9px; padding: 10px 13px; color: ${t.text};
    font-family: 'Sora', sans-serif; font-size: 13px; outline: none;
    cursor: pointer; appearance: none; transition: border-color 0.15s;
  }
  .tm-select:focus { border-color: ${t.accent}; }
  .tm-select option { background: ${t.card}; }

  /* Qty buttons */
  .qty-btn {
    width: 26px; height: 26px; border-radius: 7px; border: none; cursor: pointer;
    background: ${t.border}; color: ${t.text}; font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .qty-btn:hover { background: ${t.borderLight}; }

  /* Buttons */
  .btn-p { transition: all 0.15s ease; cursor: pointer; border: none; }
  .btn-p:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-p:active { transform: translateY(0); }
  .btn-p:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-g { transition: all 0.15s ease; cursor: pointer; }
  .btn-g:hover { border-color: ${t.borderLight} !important; }

  /* Modal */
  .modal-bd { animation: bdIn 0.18s ease; }
  @keyframes bdIn { from{opacity:0}to{opacity:1} }
  .modal-box { animation: mdIn 0.28s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes mdIn { from{opacity:0;transform:scale(0.93) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)} }

  /* Category pills */
  .cat-pill { transition: all 0.15s ease; cursor: pointer; border: none; }
  .cat-pill:hover { border-color: ${t.borderLight} !important; }

  /* Stat mini */
  .stat-mini { transition: transform 0.2s ease; }
  .stat-mini:hover { transform: translateY(-2px); }
`;

/* ─── Helpers ─── */
const Label = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 7 }}>
    {children}
  </div>
);

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.LIBRE;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

const ATTENDANTS = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Lucía'];
const MENU_ITEMS = [
  { id: 1, name: 'Hamburguesa completa', price: 4500, category: 'Hamburguesas' },
  { id: 2, name: 'Hamburguesa simple',   price: 3500, category: 'Hamburguesas' },
  { id: 3, name: 'Pizza Napolitana',     price: 6000, category: 'Pizzas'       },
  { id: 4, name: 'Pizza Muzzarella',     price: 5500, category: 'Pizzas'       },
  { id: 5, name: 'Coca Cola',            price: 2000, category: 'Bebidas'      },
  { id: 6, name: 'Cerveza',              price: 3000, category: 'Bebidas'      },
  { id: 7, name: 'Agua',                 price: 1500, category: 'Bebidas'      },
];
const CATEGORIES = ['Todas', 'Hamburguesas', 'Pizzas', 'Bebidas'];
const fmt = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;

export default function RestaurantTableManager() {
  const [tables,             setTables]             = useState([]);
  const [selectedTable,      setSelectedTable]      = useState(null);
  const [showOrderModal,     setShowOrderModal]     = useState(false);
  const [showAddTableModal,  setShowAddTableModal]  = useState(false);
  const [newTableName,       setNewTableName]       = useState('');
  const [newTableAttendant,  setNewTableAttendant]  = useState('');
  const [selectedCategory,   setSelectedCategory]  = useState('Todas');

  /* ─── Init ─── */
  useEffect(() => {
    const stored = localStorage.getItem('restaurantTables');
    if (stored) {
      setTables(JSON.parse(stored));
    } else {
      const initial = [
        { id: 1, name: 'Mesa 1', status: 'OCUPADO', orders: [
          { id: 1, name: 'Hamburguesa completa', category: 'Hamburguesas', price: 4500, quantity: 1, notes: '' },
          { id: 2, name: 'Coca Cola', category: 'Bebidas', price: 2000, quantity: 1, notes: '' },
        ], attendedBy: 'Juan', date: new Date().toLocaleString() },
        { id: 2, name: 'Mesa 2', status: 'ESPERA',  orders: [], attendedBy: 'María', date: new Date().toLocaleString() },
        { id: 3, name: 'Mesa 3', status: 'LIBRE',   orders: [], attendedBy: '-',     date: '-' },
        { id: 4, name: 'Mesa 4', status: 'LIBRE',   orders: [], attendedBy: '-',     date: '-' },
      ];
      setTables(initial);
      localStorage.setItem('restaurantTables', JSON.stringify(initial));
    }
  }, []);

  const saveTables = (updated) => {
    setTables(updated);
    localStorage.setItem('restaurantTables', JSON.stringify(updated));
  };

  const openTable = (table) => { setSelectedTable({ ...table }); setShowOrderModal(true); };
  const closeModal = () => { setShowOrderModal(false); };

  /* ─── Order actions ─── */
  const addOrderItem = (item) => {
    const exists = selectedTable.orders.find(o => o.name === item.name);
    if (exists) {
      setSelectedTable({ ...selectedTable, orders: selectedTable.orders.map(o => o.name === item.name ? { ...o, quantity: o.quantity + 1 } : o) });
    } else {
      setSelectedTable({ ...selectedTable, orders: [...selectedTable.orders, { ...item, id: Date.now(), quantity: 1, notes: '' }] });
    }
  };

  const removeOrderItem = (id) => setSelectedTable({ ...selectedTable, orders: selectedTable.orders.filter(o => o.id !== id) });

  const updateQty = (id, delta) => {
    setSelectedTable({
      ...selectedTable,
      orders: selectedTable.orders
        .map(o => o.id === id ? { ...o, quantity: o.quantity + delta } : o)
        .filter(o => o.quantity > 0),
    });
  };

  const updateNotes = (id, notes) =>
    setSelectedTable({ ...selectedTable, orders: selectedTable.orders.map(o => o.id === id ? { ...o, notes } : o) });

  const total = () => selectedTable?.orders.reduce((s, o) => s + o.price * o.quantity, 0) ?? 0;

  const changeStatus = (status) => {
    const updated = { ...selectedTable, status };
    setSelectedTable(updated);
    saveTables(tables.map(t => t.id === updated.id ? updated : t));
  };

  const sendOrder = () => {
    if (!selectedTable.orders.length) return;
    const now = new Date().toLocaleString();
    const updatedTable = { ...selectedTable, status: 'OCUPADO', date: now, attendedBy: selectedTable.attendedBy === '-' ? 'Mesero' : selectedTable.attendedBy };
    saveTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));

    const kitchenOrder = {
      id: Date.now(), tableId: updatedTable.id, table: updatedTable.name, status: 'entrante',
      items: updatedTable.orders.map(o => ({ name: o.name, quantity: o.quantity, notes: o.notes })),
      notes: updatedTable.orders.filter(o => o.notes).map(o => `${o.name}: ${o.notes}`).join(', '),
      time: 0, guests: updatedTable.orders.reduce((s, o) => s + o.quantity, 0), sentAt: now,
    };
    const existing = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
    localStorage.setItem('kitchenOrders', JSON.stringify([...existing, kitchenOrder]));
    alert('✅ ¡Pedido enviado a cocina!');
    closeModal();
  };

  const closeTable = () => {
    if (!window.confirm('¿Cerrar esta mesa y cobrar?')) return;
    const t2 = { ...selectedTable, status: 'LIBRE', orders: [], attendedBy: '-', date: '-' };
    saveTables(tables.map(t => t.id === t2.id ? t2 : t));
    const existing = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
    localStorage.setItem('kitchenOrders', JSON.stringify(existing.filter(o => o.tableId !== selectedTable.id)));
    closeModal();
  };

  const deleteTable = (id) => {
    if (window.confirm('¿Eliminar esta mesa?')) saveTables(tables.filter(t => t.id !== id));
  };

  const addNewTable = () => {
    if (!newTableName.trim()) return;
    const nt = { id: Date.now(), name: newTableName, status: 'LIBRE', orders: [], attendedBy: newTableAttendant || '-', date: '-' };
    saveTables([...tables, nt]);
    setNewTableName(''); setNewTableAttendant(''); setShowAddTableModal(false);
  };

  const filteredMenu = selectedCategory === 'Todas' ? MENU_ITEMS : MENU_ITEMS.filter(m => m.category === selectedCategory);

  return (
    <>
      <style>{STYLES}</style>

      <div className="tm-root" style={{ display: 'flex', height: '100vh', background: t.bg }}>
        <Sidebar />

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 30px' }}>

          {/* Header */}
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
                <UtensilsCrossed size={10} /> Restaurante
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.5px', marginBottom: 3 }}>Mesas</h1>
              <p style={{ fontSize: 13, color: t.textMuted }}>Gestión de mesas en tiempo real · {tables.length} en total</p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Status pills summary */}
              {[
                { key: 'OCUPADO', count: tables.filter(t2 => t2.status === 'OCUPADO').length },
                { key: 'ESPERA',  count: tables.filter(t2 => t2.status === 'ESPERA').length  },
                { key: 'LIBRE',   count: tables.filter(t2 => t2.status === 'LIBRE').length   },
              ].map(({ key, count }) => {
                const cfg = STATUS_CFG[key];
                return (
                  <div key={key} className="stat-mini" style={{
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    borderRadius: 10, padding: '8px 14px', textAlign: 'center',
                  }}>
                    <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: cfg.color }}>{count}</div>
                    <div style={{ fontSize: 9, color: cfg.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.label}</div>
                  </div>
                );
              })}
              <button className="btn-p" onClick={() => setShowAddTableModal(true)} style={{
                padding: '10px 18px', background: t.accent, borderRadius: 10,
                color: '#fff', fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <Plus size={15} /> Nueva Mesa
              </button>
            </div>
          </div>

          {/* Grid de mesas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
            {tables.map(table => {
              const cfg = STATUS_CFG[table.status] || STATUS_CFG.LIBRE;
              const tTotal = table.orders.reduce((s, o) => s + o.price * o.quantity, 0);
              return (
                <div key={table.id} className="mesa-card" onClick={() => openTable(table)}>
                  {/* Status bar */}
                  <div style={{ height: 3, background: cfg.color }} />

                  {/* Delete */}
                  <button
                    className="del-btn btn-p"
                    onClick={e => { e.stopPropagation(); deleteTable(table.id); }}
                    style={{
                      position: 'absolute', top: 12, right: 10, zIndex: 2,
                      width: 26, height: 26, borderRadius: 7,
                      background: `${t.danger}18`, border: `1px solid ${t.danger}30`,
                      color: t.danger, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>

                  <div style={{ padding: '14px 14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: t.text, marginBottom: 2 }}>{table.name}</div>
                        <StatusPill status={table.status} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.textMuted }}>
                        <User size={11} />
                        <span>{table.attendedBy}</span>
                      </div>
                      {table.orders.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 8, borderTop: `1px solid ${t.border}` }}>
                          <span style={{ color: t.textMuted }}>{table.orders.length} producto{table.orders.length !== 1 ? 's' : ''}</span>
                          <span className="mono" style={{ fontWeight: 700, color: t.accent, fontSize: 13 }}>{fmt(tTotal)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── MODAL: Gestión de mesa ─── */}
        {showOrderModal && selectedTable && (
          <div className="modal-bd" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: 16,
          }}
            onClick={e => e.target === e.currentTarget && closeModal()}
          >
            <div className="modal-box" style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: 20, width: '100%', maxWidth: 900, maxHeight: '90vh',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              {/* Modal header */}
              <div style={{
                padding: '20px 24px', borderBottom: `1px solid ${t.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0,
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text }}>{selectedTable.name}</h3>
                    {selectedTable.attendedBy !== '-' && (
                      <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={10} /> {selectedTable.attendedBy}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['LIBRE', 'ESPERA', 'OCUPADO'].map(s => {
                      const cfg = STATUS_CFG[s];
                      const active = selectedTable.status === s;
                      return (
                        <button key={s} className="cat-pill" onClick={() => changeStatus(s)} style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: active ? cfg.bg : t.surface,
                          border: `1px solid ${active ? cfg.border : t.border}`,
                          color: active ? cfg.color : t.textMuted,
                          cursor: 'pointer',
                        }}>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button onClick={closeModal} style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: t.surface, border: `1px solid ${t.border}`,
                  color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={15} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>

                {/* ─── Pedidos ─── */}
                <div style={{ padding: '20px', borderRight: `1px solid ${t.border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>
                    Pedido actual
                  </div>

                  <div style={{ flex: 1 }}>
                    {selectedTable.orders.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 10 }}>
                        <ShoppingCart size={28} color={t.textDim} />
                        <span style={{ fontSize: 13, color: t.textMuted }}>Sin productos aún</span>
                        <span style={{ fontSize: 11, color: t.textDim }}>Agregá desde el menú →</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selectedTable.orders.map(item => (
                          <div key={item.id} className="order-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                <div style={{ fontSize: 11, color: t.textMuted }}>{item.category}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                                  <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.text, minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                                  <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                                </div>
                                <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.accent, minWidth: 56, textAlign: 'right' }}>
                                  {fmt(item.price * item.quantity)}
                                </span>
                                <button onClick={() => removeOrderItem(item.id)} style={{
                                  background: 'none', border: 'none', cursor: 'pointer', color: t.danger, padding: 2,
                                }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <input
                              type="text" value={item.notes || ''} onChange={e => updateNotes(item.id, e.target.value)}
                              placeholder="Notas (ej: sin cebolla, extra queso...)"
                              className="tm-input" style={{ fontSize: 12, padding: '7px 10px' }}
                            />
                            {item.notes && (
                              <div style={{ fontSize: 11, color: t.gold, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                📝 {item.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total + acciones */}
                  <div style={{ paddingTop: 16, borderTop: `1px solid ${t.border}`, marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Total</span>
                      <span className="mono" style={{ fontSize: 20, fontWeight: 800, color: t.accent }}>{fmt(total())}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button className="btn-p" onClick={sendOrder} disabled={!selectedTable.orders.length} style={{
                        width: '100%', padding: '12px', background: t.accent, borderRadius: 10,
                        color: '#fff', fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      }}>
                        <Send size={14} /> Enviar a cocina
                      </button>
                      <button className="btn-p" onClick={closeTable} disabled={!selectedTable.orders.length} style={{
                        width: '100%', padding: '12px',
                        background: `${t.danger}12`, border: `1px solid ${t.danger}25`, borderRadius: 10,
                        color: t.danger, fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      }}>
                        <CheckCircle size={14} /> Cerrar mesa y cobrar
                      </button>
                    </div>
                  </div>
                </div>

                {/* ─── Menú ─── */}
                <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>
                    Agregar productos
                  </div>

                  {/* Category tabs */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat} className="cat-pill" onClick={() => setSelectedCategory(cat)} style={{
                        padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: selectedCategory === cat ? `${t.accent}18` : t.surface,
                        border: `1px solid ${selectedCategory === cat ? t.accent : t.border}`,
                        color: selectedCategory === cat ? t.accent : t.textMuted,
                        cursor: 'pointer',
                      }}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {filteredMenu.map(item => (
                      <div key={item.id} className="menu-item" onClick={() => addOrderItem(item)}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 4 }}>{item.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{fmt(item.price)}</span>
                          <span style={{ fontSize: 10, color: t.textMuted }}>{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Nueva Mesa ─── */}
        {showAddTableModal && (
          <div className="modal-bd" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 60, padding: 16,
          }}
            onClick={e => e.target === e.currentTarget && setShowAddTableModal(false)}
          >
            <div className="modal-box" style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, position: 'relative',
            }}>
              <button onClick={() => setShowAddTableModal(false)} style={{
                position: 'absolute', top: 14, right: 14,
                width: 28, height: 28, borderRadius: 8,
                background: t.surface, border: `1px solid ${t.border}`,
                color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={13} />
              </button>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: t.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5 }}>Nueva mesa</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text }}>Agregar Mesa</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <Label>Nombre de la mesa</Label>
                  <input
                    autoFocus className="tm-input" type="text" placeholder="Ej: Mesa 5"
                    value={newTableName} onChange={e => setNewTableName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addNewTable()}
                  />
                </div>
                <div>
                  <Label>Atendido por (opcional)</Label>
                  <select className="tm-select" value={newTableAttendant} onChange={e => setNewTableAttendant(e.target.value)}>
                    <option value="">Seleccionar mesero...</option>
                    {ATTENDANTS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button className="btn-g" onClick={() => setShowAddTableModal(false)} style={{
                  flex: 1, padding: '11px', background: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 10, color: t.textMuted, fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
                }}>Cancelar</button>
                <button className="btn-p" onClick={addNewTable} disabled={!newTableName.trim()} style={{
                  flex: 2, padding: '11px', background: t.accent, borderRadius: 10,
                  color: '#fff', fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}>
                  <Plus size={14} /> Agregar Mesa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}