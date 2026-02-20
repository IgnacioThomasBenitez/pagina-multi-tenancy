// ==============================
// IMPORTS
// ==============================
import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Search, Edit, Trash2, AlertTriangle, X,
  Check, TrendingUp, DollarSign, ArrowUpRight, BarChart3,
  ChevronUp, ChevronDown, AlertCircle, Tag, Layers,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

/* ─── Paleta (igual que Sales para consistencia) ─── */
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
  dangerSoft: '#450a0a',
  info: '#38bdf8',
  purple: '#8b5cf6',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#334155',
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .inv-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
  .card-hover { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); border-color: ${theme.borderLight} !important; }
  .btn-p { transition: all 0.15s ease; }
  .btn-p:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-p:active:not(:disabled) { transform: translateY(0); }
  .btn-g { transition: all 0.15s ease; }
  .btn-g:hover { opacity: 0.8; }
  .badge-pulse { animation: bpulse 2s infinite; }
  @keyframes bpulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
  .row-in { animation: rowIn 0.2s ease both; }
  @keyframes rowIn { from { opacity:0; transform: translateX(-8px); } to { opacity:1; transform: translateX(0); } }
  .overlay-in { animation: ovi 0.2s ease; }
  @keyframes ovi { from{opacity:0} to{opacity:1} }
  .modal-in { animation: modi 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes modi { from{opacity:0;transform:scale(0.92) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  input[type=number]::-webkit-inner-spin-button { display:none; }
  select option { background: ${theme.card}; }
`;

const fmt = (n) => `$${Number(n).toLocaleString('es-AR')}`;

/* ─── StatCard ─── */
function StatCard({ icon: Icon, label, value, color = theme.accent, sub }) {
  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: theme.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{label}</div>
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: theme.textDim, borderTop: `1px solid ${theme.border}`, paddingTop: 10 }}>{sub}</div>
      )}
    </div>
  );
}

/* ─── StockBadge ─── */
function StockBadge({ stock, minStock }) {
  const isLow = stock <= minStock;
  const pct = Math.min(100, (stock / (minStock * 4)) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: theme.textMuted }}>Stock</span>
        <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: isLow ? theme.danger : theme.accent }}>
          {stock} <span style={{ color: theme.textDim }}>/ mín {minStock}</span>
        </span>
      </div>
      <div style={{ height: 3, background: theme.border, borderRadius: 2 }}>
        <div style={{
          height: '100%', borderRadius: 2, width: `${pct}%`,
          background: isLow ? theme.danger : theme.accent,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
export default function Inventory() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Shampoo Sedal', category: 'Cuidado Capilar', price: 2500, stock: 15, minStock: 5 },
    { id: 2, name: 'Tintura Loreal', category: 'Coloración', price: 4800, stock: 3, minStock: 5 },
    { id: 3, name: 'Crema Nivea', category: 'Cuidado Personal', price: 3200, stock: 8, minStock: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Varios', price: '', stock: '', minStock: '' });
  const [sortBy, setSortBy] = useState(null); // 'stock' | 'price' | null
  const [sortDir, setSortDir] = useState('asc');

  const categories = ['Todos', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const dir = sortDir === 'asc' ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * dir;
    });

  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const lowStockItems = products.filter((p) => p.stock <= p.minStock);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setForm({ name: '', category: 'Varios', price: '', stock: '', minStock: '' });
    setShowModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setForm({ ...product });
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!form.name || !form.price || !form.stock) return;
    const parsed = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      minStock: Number(form.minStock) || 5,
    };
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === parsed.id ? parsed : p)));
    } else {
      setProducts([...products, { ...parsed, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const adjustStock = (id, delta) => {
    setProducts(products.map((p) =>
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ));
  };

  /* ─── Estilos reutilizables ─── */
  const inputStyle = {
    width: '100%',
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: '11px 14px',
    color: theme.text,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'Sora, sans-serif',
    transition: 'border-color 0.15s',
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronUp size={12} color={theme.textDim} />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} color={theme.accent} />
      : <ChevronDown size={12} color={theme.accent} />;
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="inv-root" style={{ display: 'flex', height: '100vh', background: theme.bg }}>
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ─── Header ─── */}
          <div style={{
            padding: '24px 32px 20px',
            borderBottom: `1px solid ${theme.border}`,
            background: theme.surface,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: '-0.5px' }}>
                    Inventario
                  </h1>
                  {lowStockCount > 0 && (
                    <div className="badge-pulse" style={{
                      background: `${theme.danger}18`, border: `1px solid ${theme.danger}35`,
                      borderRadius: 20, padding: '3px 10px', fontSize: 11,
                      color: theme.danger, fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <AlertCircle size={11} />
                      {lowStockCount} bajo stock
                    </div>
                  )}
                </div>
                <p style={{ color: theme.textMuted, fontSize: 13 }}>
                  {products.length} productos · Gestión de stock y precios
                </p>
              </div>

              <button
                className="btn-p"
                onClick={openNewProduct}
                style={{
                  background: theme.accent, border: 'none', borderRadius: 10,
                  padding: '10px 20px', color: '#fff', fontWeight: 700,
                  fontSize: 13, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <Plus size={16} /> Nuevo Producto
              </button>
            </div>
          </div>

          {/* ─── Body ─── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <StatCard icon={Package} label="Total Productos" value={products.length} color={theme.info} />
              <StatCard icon={DollarSign} label="Valor del Inventario" value={fmt(totalValue)} color={theme.accent} />
              <StatCard icon={AlertTriangle} label="Stock Crítico" value={lowStockCount} color={theme.danger} sub={lowStockItems.map(p => p.name).join(', ') || 'Sin alertas'} />
              <StatCard icon={Layers} label="Categorías" value={categories.length - 1} color={theme.purple} />
            </div>

            {/* Alerta stock bajo */}
            {lowStockItems.length > 0 && (
              <div style={{
                background: `${theme.danger}0d`, border: `1px solid ${theme.danger}28`,
                borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <AlertTriangle size={15} color={theme.danger} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: theme.danger }}>
                  <strong>Reponer urgente: </strong>
                  {lowStockItems.map((p) => `${p.name} (${p.stock} un.)`).join(' · ')}
                </span>
              </div>
            )}

            {/* Búsqueda y filtros */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} color={theme.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto..."
                  style={{ ...inputStyle, paddingLeft: 40 }}
                  onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                  onBlur={(e) => (e.target.style.borderColor = theme.border)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ ...inputStyle, width: 'auto', paddingRight: 32, cursor: 'pointer' }}
              >
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>

              {/* Sort buttons */}
              <button
                onClick={() => toggleSort('stock')}
                style={{
                  padding: '0 16px',
                  background: sortBy === 'stock' ? `${theme.accent}18` : theme.surface,
                  border: `1px solid ${sortBy === 'stock' ? theme.accent : theme.border}`,
                  borderRadius: 10, color: sortBy === 'stock' ? theme.accent : theme.textMuted,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Sora, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                Stock <SortIcon field="stock" />
              </button>
              <button
                onClick={() => toggleSort('price')}
                style={{
                  padding: '0 16px',
                  background: sortBy === 'price' ? `${theme.accent}18` : theme.surface,
                  border: `1px solid ${sortBy === 'price' ? theme.accent : theme.border}`,
                  borderRadius: 10, color: sortBy === 'price' ? theme.accent : theme.textMuted,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Sora, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                Precio <SortIcon field="price" />
              </button>
            </div>

            {/* Grid de productos */}
            {filteredProducts.length === 0 ? (
              <div style={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: theme.card, border: `1px solid ${theme.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Package size={26} color={theme.textDim} />
                </div>
                <p style={{ color: theme.textMuted, fontSize: 14 }}>No se encontraron productos</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <div
                      key={p.id}
                      className="card-hover row-in"
                      style={{
                        background: theme.card,
                        border: `1px solid ${isLow ? theme.danger + '45' : theme.border}`,
                        borderRadius: 16,
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                      }}
                    >
                      {/* Top */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>{p.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textMuted, fontSize: 11 }}>
                            <Tag size={10} />
                            {p.category}
                          </div>
                        </div>
                        {isLow && (
                          <div style={{
                            background: `${theme.danger}18`, border: `1px solid ${theme.danger}30`,
                            borderRadius: 6, padding: '2px 7px', fontSize: 10,
                            fontWeight: 700, color: theme.danger,
                            textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0,
                          }}>
                            Crítico
                          </div>
                        )}
                      </div>

                      {/* Stock bar */}
                      <StockBadge stock={p.stock} minStock={p.minStock} />

                      {/* Precio */}
                      <div>
                        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Precio unitario
                        </div>
                        <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>
                          {fmt(p.price)}
                        </div>
                        <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>
                          Valor en stock: <span className="mono">{fmt(p.price * p.stock)}</span>
                        </div>
                      </div>

                      {/* Control de stock rápido */}
                      <div style={{
                        background: theme.surface, borderRadius: 10,
                        padding: '10px 12px', border: `1px solid ${theme.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: 12, color: theme.textMuted }}>Ajuste rápido</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            className="btn-g"
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock === 0}
                            style={{
                              width: 28, height: 28, borderRadius: 7,
                              background: theme.border, border: 'none', cursor: p.stock === 0 ? 'not-allowed' : 'pointer',
                              color: p.stock === 0 ? theme.textDim : theme.text,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 16, lineHeight: 1 }}>−</span>
                          </button>
                          <span className="mono" style={{ minWidth: 32, textAlign: 'center', fontSize: 14, fontWeight: 600, color: theme.text }}>
                            {p.stock}
                          </span>
                          <button
                            className="btn-g"
                            onClick={() => adjustStock(p.id, 1)}
                            style={{
                              width: 28, height: 28, borderRadius: 7,
                              background: theme.accentMuted, border: 'none', cursor: 'pointer',
                              color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                          </button>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn-p"
                          onClick={() => openEditProduct(p)}
                          style={{
                            flex: 1, padding: '9px', background: `${theme.purple}20`,
                            border: `1px solid ${theme.purple}35`, borderRadius: 10,
                            color: theme.purple, fontWeight: 600, fontSize: 13,
                            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}
                        >
                          <Edit size={13} /> Editar
                        </button>
                        <button
                          className="btn-p"
                          onClick={() => deleteProduct(p.id)}
                          style={{
                            padding: '9px 14px',
                            background: `${theme.danger}15`,
                            border: `1px solid ${theme.danger}25`, borderRadius: 10,
                            color: theme.danger, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ─── Modal Agregar/Editar ─── */}
        {showModal && (
          <div
            className="overlay-in"
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(6px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
            }}
          >
            <div
              className="modal-in"
              style={{
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 20, padding: 32, width: '100%', maxWidth: 420,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>
                    {editingProduct ? `ID #${editingProduct.id}` : 'Completá los datos del producto'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: theme.border, border: 'none', borderRadius: 8,
                    padding: 6, cursor: 'pointer', color: theme.textMuted,
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Nombre */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Nombre
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: Shampoo Sedal"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                    onBlur={(e) => (e.target.style.borderColor = theme.border)}
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Categoría
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {['Varios', 'Cuidado Capilar', 'Coloración', 'Cuidado Personal', 'Alimentos', 'Bebidas', 'Limpieza'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Precio y Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { key: 'price', label: 'Precio ($)', placeholder: '0' },
                    { key: 'stock', label: 'Stock', placeholder: '0' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {label}
                      </label>
                      <input
                        type="number"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                        onBlur={(e) => (e.target.style.borderColor = theme.border)}
                      />
                    </div>
                  ))}
                </div>

                {/* Stock mínimo */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                    placeholder="5"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                    onBlur={(e) => (e.target.style.borderColor = theme.border)}
                  />
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1, padding: '12px', background: theme.surface,
                      border: `1px solid ${theme.border}`, borderRadius: 10,
                      color: theme.textMuted, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                      fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => (e.target.style.borderColor = theme.borderLight)}
                    onMouseLeave={(e) => (e.target.style.borderColor = theme.border)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-p"
                    onClick={saveProduct}
                    style={{
                      flex: 2, padding: '12px',
                      background: editingProduct ? '#2563eb' : theme.accent,
                      border: 'none', borderRadius: 10,
                      color: '#fff', cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                      fontSize: 14, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <Check size={15} />
                    {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}