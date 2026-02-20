import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertCircle,
  Search,
  DollarSign,
  History,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  Tag,
  BarChart3,
  Clock,
  ChevronRight,
  Receipt,
  Banknote,
  CreditCard,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";

/* ─── Paleta de colores profesional ─── */
const theme = {
  bg: "#0a0d12",
  surface: "#111720",
  card: "#161d28",
  border: "#1e2d3d",
  borderLight: "#243447",
  accent: "#10b981",       // esmeralda
  accentSoft: "#064e3b",
  accentMuted: "#065f46",
  gold: "#f59e0b",
  goldSoft: "#451a03",
  danger: "#ef4444",
  dangerSoft: "#450a0a",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#334155",
  purple: "#8b5cf6",
  purpleSoft: "#2e1065",
};

/* ─── Estilos globales inline (inyectados una vez) ─── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
  .sales-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  .card-hover { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
  .card-hover:hover { transform: translateY(-2px); border-color: ${theme.accent}55 !important; box-shadow: 0 8px 32px rgba(16,185,129,0.08); }
  .btn-primary { transition: all 0.15s ease; }
  .btn-primary:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-ghost { transition: all 0.15s ease; }
  .btn-ghost:hover { background: ${theme.border} !important; }
  .cart-item { animation: slideIn 0.2s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
  .badge-pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  .stat-card { transition: all 0.2s ease; }
  .stat-card:hover { border-color: ${theme.borderLight} !important; }
  input[type=number]::-webkit-inner-spin-button { display: none; }
  select option { background: ${theme.card}; }
  .tab-active { position: relative; }
  .tab-active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: ${theme.accent}; border-radius: 1px; }
  .overlay-enter { animation: overlayIn 0.2s ease; }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-enter { animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
`;

/* ─── Helpers ─── */
const fmt = (n) => `$${Number(n).toLocaleString("es-AR")}`;
const today = () => new Date().toISOString().split("T")[0];
const nowTime = () =>
  new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

/* ─── Componente StatCard ─── */
function StatCard({ icon: Icon, label, value, sub, color = theme.accent, trend }) {
  return (
    <div
      className="stat-card"
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color={color} />
        </div>
        {trend !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: theme.accent, fontSize: 12, fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: theme.text, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{label}</div>
      </div>
      {sub && <div style={{ fontSize: 11, color: theme.textDim, borderTop: `1px solid ${theme.border}`, paddingTop: 10 }}>{sub}</div>}
    </div>
  );
}

/* ─── Componente PaymentButton ─── */
function PayMethod({ icon: Icon, label, value, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? `${theme.accent}18` : theme.surface,
        border: `1px solid ${selected ? theme.accent : theme.border}`,
        borderRadius: 12,
        padding: "10px 12px",
        color: selected ? theme.accent : theme.textMuted,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
        transition: "all 0.15s ease",
        width: "100%",
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

/* ─── Componente Principal ─── */
const Sales = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("shared-products");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Shampoo Premium", category: "Cuidado Capilar", price: 2600, stock: 49, minStock: 10 },
          { id: 2, name: "Acondicionador", category: "Cuidado Capilar", price: 2400, stock: 35, minStock: 10 },
          { id: 3, name: "Tratamiento Capilar", category: "Cuidado Capilar", price: 4500, stock: 20, minStock: 5 },
          { id: 4, name: "Tinte Profesional", category: "Coloración", price: 3800, stock: 15, minStock: 8 },
          { id: 5, name: "Decolorante", category: "Coloración", price: 3200, stock: 8, minStock: 10 },
          { id: 6, name: "Crema de Manos", category: "Cuidado Personal", price: 1500, stock: 60, minStock: 15 },
        ];
  });

  const [salesHistory, setSalesHistory] = useState(() => {
    const saved = localStorage.getItem("shared-sales");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, date: "2026-01-09", time: "10:30", items: 2, total: 3675, customer: "María García", payment: "tarjeta" },
          { id: 2, date: "2026-01-09", time: "14:15", items: 1, total: 2600, customer: "Cliente General", payment: "efectivo" },
        ];
  });

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeTab, setActiveTab] = useState("productos"); // 'productos' | 'historial'
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", stock: "", minStock: "" });
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => { localStorage.setItem("shared-products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("shared-sales", JSON.stringify(salesHistory)); }, [salesHistory]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "shared-products" && e.newValue) setProducts(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const categories = ["Todos", ...new Set(products.map((p) => p.category))];
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (product) => {
    if (product.stock === 0) return;
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      if (existing.qty < product.stock) {
        setCart(cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i)));
      }
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((i) => i.id !== id));

  const updateCartQty = (id, qty) => {
    if (qty === 0) { removeFromCart(id); return; }
    const prod = products.find((p) => p.id === id);
    if (qty > prod.stock) return;
    setCart(cart.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const todayTotal = salesHistory.filter((s) => s.date === "2026-01-09").reduce((s, sale) => s + sale.total, 0);
  const monthTotal = salesHistory.reduce((s, sale) => s + sale.total, 0);

  const processSale = () => {
    if (!cart.length) return;
    setProducts(products.map((p) => {
      const ci = cart.find((i) => i.id === p.id);
      return ci ? { ...p, stock: p.stock - ci.qty } : p;
    }));
    const sale = {
      id: salesHistory.length + 1,
      date: today(),
      time: nowTime(),
      items: cartCount,
      total: cartTotal,
      customer: customerName || "Cliente General",
      payment: paymentMethod,
      products: [...cart],
    };
    setSalesHistory([sale, ...salesHistory]);
    setCart([]);
    setCustomerName("");
    setPaymentMethod("efectivo");
    setShowCheckoutModal(false);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    setProducts([...products, {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category || "Varios",
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock) || 5,
    }]);
    setNewProduct({ name: "", category: "", price: "", stock: "", minStock: "" });
    setShowProductModal(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  /* ─── Estilos reutilizables ─── */
  const inputStyle = {
    width: "100%",
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    color: theme.text,
    fontSize: 14,
    outline: "none",
    fontFamily: "Sora, sans-serif",
    transition: "border-color 0.15s",
  };

  const paymentMethods = [
    { value: "efectivo", label: "Efectivo", icon: Banknote },
    { value: "tarjeta", label: "Tarjeta", icon: CreditCard },
    { value: "transferencia", label: "Transferencia", icon: Smartphone },
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="sales-root" style={{ display: "flex", height: "100vh", background: theme.bg }}>
        <Sidebar />

        {/* ─── Contenido Principal ─── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header */}
          <div style={{
            padding: "24px 32px 0",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.surface,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: "-0.5px" }}>
                    Punto de Ventas
                  </h1>
                  {lowStockProducts.length > 0 && (
                    <div className="badge-pulse" style={{
                      background: `${theme.danger}18`,
                      border: `1px solid ${theme.danger}40`,
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 11,
                      color: theme.danger,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}>
                      <AlertCircle size={11} />
                      {lowStockProducts.length} bajo stock
                    </div>
                  )}
                </div>
                <p style={{ color: theme.textMuted, fontSize: 13 }}>
                  {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <button
                className="btn-primary"
                onClick={() => setShowProductModal(true)}
                style={{
                  background: theme.accent,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "Sora, sans-serif",
                }}
              >
                <Plus size={16} />
                Nuevo Producto
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { id: "productos", label: "Productos", icon: Package },
                { id: "historial", label: "Historial", icon: History },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={activeTab === id ? "tab-active" : ""}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 16px",
                    color: activeTab === id ? theme.text : theme.textMuted,
                    fontSize: 13,
                    fontWeight: activeTab === id ? 700 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "Sora, sans-serif",
                    transition: "color 0.15s",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>

            {activeTab === "productos" && (
              <>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                  <StatCard icon={DollarSign} label="Ventas Hoy" value={fmt(todayTotal)} color={theme.accent} trend="+12%" />
                  <StatCard icon={TrendingUp} label="Total del Mes" value={fmt(monthTotal)} color={theme.purple} />
                  <StatCard icon={Package} label="Productos" value={products.length} color={theme.gold} sub={`${lowStockProducts.length} con stock bajo`} />
                  <StatCard icon={Receipt} label="Transacciones" value={salesHistory.length} color="#38bdf8" />
                </div>

                {/* Filtros */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Search size={16} color={theme.textMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 42 }}
                      onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                      onBlur={(e) => (e.target.style.borderColor = theme.border)}
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ ...inputStyle, width: "auto", paddingRight: 32, cursor: "pointer", color: theme.text }}
                  >
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <div style={{
                    background: `${theme.danger}10`,
                    border: `1px solid ${theme.danger}30`,
                    borderRadius: 12,
                    padding: "14px 18px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <AlertCircle size={16} color={theme.danger} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13, color: theme.danger }}>
                      <strong>Stock crítico: </strong>
                      {lowStockProducts.map((p) => p.name).join(", ")}
                    </div>
                  </div>
                )}

                {/* Grid de productos */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {filteredProducts.map((product) => {
                    const isLow = product.stock <= product.minStock;
                    const inCart = cart.find((i) => i.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className="card-hover"
                        style={{
                          background: theme.card,
                          border: `1px solid ${isLow ? theme.danger + "40" : theme.border}`,
                          borderRadius: 16,
                          padding: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        {/* Top row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                              {inCart && (
                                <div style={{
                                  width: 6, height: 6, borderRadius: "50%", background: theme.accent, flexShrink: 0
                                }} />
                              )}
                              <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{product.name}</h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, color: theme.textMuted, fontSize: 11 }}>
                              <Tag size={10} />
                              {product.category}
                            </div>
                          </div>
                          {isLow && (
                            <div style={{
                              background: `${theme.danger}18`,
                              border: `1px solid ${theme.danger}30`,
                              borderRadius: 6,
                              padding: "2px 7px",
                              fontSize: 10,
                              fontWeight: 700,
                              color: theme.danger,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}>
                              Bajo
                            </div>
                          )}
                        </div>

                        {/* Stock bar */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: theme.textMuted }}>Stock disponible</span>
                            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: isLow ? theme.danger : theme.accent }}>
                              {product.stock} un.
                            </span>
                          </div>
                          <div style={{ height: 3, background: theme.border, borderRadius: 2 }}>
                            <div style={{
                              height: "100%",
                              borderRadius: 2,
                              width: `${Math.min(100, (product.stock / (product.minStock * 3)) * 100)}%`,
                              background: isLow ? theme.danger : theme.accent,
                              transition: "width 0.3s ease",
                            }} />
                          </div>
                        </div>

                        {/* Precio */}
                        <div>
                          <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>Precio unitario</div>
                          <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: theme.accent }}>
                            {fmt(product.price)}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn-primary"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            style={{
                              flex: 1,
                              padding: "10px",
                              background: product.stock === 0 ? theme.border : theme.accent,
                              border: "none",
                              borderRadius: 10,
                              color: product.stock === 0 ? theme.textDim : "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: product.stock === 0 ? "not-allowed" : "pointer",
                              fontFamily: "Sora, sans-serif",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                            }}
                          >
                            {product.stock === 0 ? "Sin stock" : (<><Plus size={14} /> Agregar</>)}
                          </button>
                          <button
                            className="btn-ghost"
                            onClick={() => setEditingProduct(product)}
                            style={{
                              padding: "10px 12px",
                              background: theme.surface,
                              border: `1px solid ${theme.border}`,
                              borderRadius: 10,
                              color: theme.textMuted,
                              cursor: "pointer",
                            }}
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="btn-ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{
                              padding: "10px 12px",
                              background: theme.surface,
                              border: `1px solid ${theme.border}`,
                              borderRadius: 10,
                              color: theme.textMuted,
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === "historial" && (
              <div>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Registro de ventas</h2>
                  <div className="mono" style={{ fontSize: 12, color: theme.textMuted }}>{salesHistory.length} transacciones</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {salesHistory.map((sale, idx) => (
                    <div
                      key={sale.id}
                      style={{
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 14,
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        transition: "border-color 0.15s",
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${theme.accent}15`,
                        border: `1px solid ${theme.accent}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Receipt size={16} color={theme.accent} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 3 }}>
                          {sale.customer}
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 12, color: theme.textMuted }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Clock size={11} />{sale.date} {sale.time}
                          </span>
                          <span>{sale.items} {sale.items === 1 ? "producto" : "productos"}</span>
                          {sale.payment && (
                            <span style={{
                              background: `${theme.purple}18`,
                              color: theme.purple,
                              padding: "1px 7px",
                              borderRadius: 5,
                              fontWeight: 500,
                            }}>
                              {sale.payment}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: theme.accent }}>
                        {fmt(sale.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Panel Carrito ─── */}
        <div style={{
          width: 360,
          background: theme.surface,
          borderLeft: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Cart Header */}
          <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShoppingCart size={18} color={cart.length ? theme.accent : theme.textMuted} />
                <span style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>
                  {cart.length === 0 ? "Carrito" : `Carrito · ${cartCount}`}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  style={{
                    background: `${theme.danger}15`,
                    border: `1px solid ${theme.danger}25`,
                    borderRadius: 8,
                    padding: "4px 8px",
                    color: theme.danger,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  <Trash2 size={11} /> Vaciar
                </button>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {cart.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <ShoppingCart size={24} color={theme.textDim} />
                </div>
                <div style={{ fontSize: 13, color: theme.textMuted, textAlign: "center" }}>
                  Selecciona productos<br />para comenzar la venta
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item"
                    style={{
                      background: theme.card,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 2 }}>{item.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: theme.textMuted }}>{fmt(item.price)} c/u</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: theme.textDim, padding: 2 }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <button
                          onClick={() => updateCartQty(item.id, item.qty - 1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: theme.border,
                            border: "none",
                            cursor: "pointer",
                            color: theme.text,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="mono" style={{ width: 36, textAlign: "center", color: theme.text, fontWeight: 600, fontSize: 14 }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: item.qty >= item.stock ? theme.border : theme.accentMuted,
                            border: "none",
                            cursor: item.qty >= item.stock ? "not-allowed" : "pointer",
                            color: item.qty >= item.stock ? theme.textDim : theme.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: item.qty >= item.stock ? 0.5 : 1,
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: theme.accent }}>
                        {fmt(item.price * item.qty)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div style={{ padding: "16px 24px 24px", borderTop: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: theme.textMuted, fontSize: 14 }}>Total</span>
              <span className="mono" style={{ fontSize: 28, fontWeight: 800, color: cart.length ? theme.accent : theme.textDim }}>
                {fmt(cartTotal)}
              </span>
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowCheckoutModal(true)}
              disabled={cart.length === 0}
              style={{
                width: "100%",
                padding: "14px",
                background: cart.length === 0 ? theme.border : theme.accent,
                border: "none",
                borderRadius: 12,
                color: cart.length === 0 ? theme.textDim : "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                fontFamily: "Sora, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <DollarSign size={16} />
              Procesar Venta
            </button>
          </div>
        </div>

        {/* ─── Modales ─── */}

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <div
            className="overlay-enter"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 16,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              className="modal-enter"
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 32,
                width: "100%",
                maxWidth: 440,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>Finalizar Venta</h3>
                  <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{cartCount} {cartCount === 1 ? "producto" : "productos"}</p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  style={{ background: theme.border, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: theme.textMuted }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Cliente (opcional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nombre del cliente..."
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                    onBlur={(e) => (e.target.style.borderColor = theme.border)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Método de pago
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {paymentMethods.map(({ value, label, icon }) => (
                      <PayMethod
                        key={value}
                        icon={icon}
                        label={label}
                        value={value}
                        selected={paymentMethod === value}
                        onClick={() => setPaymentMethod(value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Resumen */}
                <div style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: 16,
                }}>
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: theme.textMuted }}>{item.name} × {item.qty}</span>
                      <span className="mono" style={{ color: theme.text }}>{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>+{cart.length - 3} más...</div>
                  )}
                  <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Total</span>
                    <span className="mono" style={{ fontSize: 22, fontWeight: 800, color: theme.accent }}>{fmt(cartTotal)}</span>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={processSale}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: theme.accent,
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Check size={16} /> Confirmar Venta
              </button>
            </div>
          </div>
        )}

        {/* Nuevo Producto Modal */}
        {showProductModal && (
          <div
            className="overlay-enter"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 16,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              className="modal-enter"
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 32,
                width: "100%",
                maxWidth: 420,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>Nuevo Producto</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  style={{ background: theme.border, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: theme.textMuted }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { key: "name", placeholder: "Nombre del producto" },
                  { key: "category", placeholder: "Categoría" },
                ].map(({ key, placeholder }) => (
                  <input
                    key={key}
                    type="text"
                    value={newProduct[key]}
                    onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                    onBlur={(e) => (e.target.style.borderColor = theme.border)}
                  />
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "price", placeholder: "Precio ($)" },
                    { key: "stock", placeholder: "Stock inicial" },
                  ].map(({ key, placeholder }) => (
                    <input
                      key={key}
                      type="number"
                      value={newProduct[key]}
                      onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
                      placeholder={placeholder}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                      onBlur={(e) => (e.target.style.borderColor = theme.border)}
                    />
                  ))}
                </div>

                <input
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                  placeholder="Stock mínimo"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                  onBlur={(e) => (e.target.style.borderColor = theme.border)}
                />

                <button
                  className="btn-primary"
                  onClick={handleAddProduct}
                  style={{
                    padding: "14px",
                    background: theme.accent,
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "Sora, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Plus size={16} /> Agregar Producto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editar Producto Modal */}
        {editingProduct && (
          <div
            className="overlay-enter"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 16,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              className="modal-enter"
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 32,
                width: "100%",
                maxWidth: 420,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>Editar Producto</h3>
                  <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>ID #{editingProduct.id}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  style={{ background: theme.border, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: theme.textMuted }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { key: "name", label: "Nombre" },
                  { key: "category", label: "Categoría" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
                    <input
                      type="text"
                      value={editingProduct[key]}
                      onChange={(e) => setEditingProduct({ ...editingProduct, [key]: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                      onBlur={(e) => (e.target.style.borderColor = theme.border)}
                    />
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "price", label: "Precio", parse: parseFloat },
                    { key: "stock", label: "Stock", parse: parseInt },
                  ].map(({ key, label, parse }) => (
                    <div key={key}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
                      <input
                        type="number"
                        value={editingProduct[key]}
                        onChange={(e) => setEditingProduct({ ...editingProduct, [key]: parse(e.target.value) })}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                        onBlur={(e) => (e.target.style.borderColor = theme.border)}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Stock Mínimo</label>
                  <input
                    type="number"
                    value={editingProduct.minStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStock: parseInt(e.target.value) })}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = theme.accent)}
                    onBlur={(e) => (e.target.style.borderColor = theme.border)}
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={handleEditProduct}
                  style={{
                    padding: "14px",
                    background: "#2563eb",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "Sora, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Check size={16} /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sales;