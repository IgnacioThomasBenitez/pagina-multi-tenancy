import React, { useState } from 'react';
import {
  ShoppingCart, Package, BarChart3, Settings, LogOut,
  FileText, DollarSign, TrendingUp, Truck, ShoppingBag,
  Users, Clock, CreditCard, ChevronDown, ChevronRight,
  UtensilsCrossed, Upload, Store, LayoutDashboard,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─── Paleta unificada ─── */
const theme = {
  bg: '#0a0d12',
  surface: '#111720',
  card: '#161d28',
  border: '#1e2d3d',
  borderLight: '#243447',
  accent: '#10b981',
  accentSoft: '#064e3b',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#334155',
  danger: '#ef4444',
  purple: '#8b5cf6',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
  .sidebar-root * { font-family: 'Sora', sans-serif; }
  .sidebar-root ::-webkit-scrollbar { width: 3px; }
  .sidebar-root ::-webkit-scrollbar-track { background: transparent; }
  .sidebar-root ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
  .nav-item {
    transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
    position: relative;
    cursor: pointer;
    border: none;
    background: none;
  }
  .nav-item:hover { background: ${theme.border}22 !important; color: ${theme.text} !important; }
  .nav-item:hover .nav-icon { color: ${theme.text} !important; }
  .nav-item.active-item {
    background: ${theme.accent}15 !important;
    color: ${theme.accent} !important;
  }
  .nav-item.active-item .nav-icon { color: ${theme.accent} !important; }
  .active-bar {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: ${theme.accent};
    border-radius: 2px 0 0 2px;
  }
  .section-toggle {
    background: none; border: none; cursor: pointer;
    transition: color 0.15s;
  }
  .section-toggle:hover { color: ${theme.textMuted} !important; }
  .logo-btn {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .logo-btn:hover { transform: scale(1.05); }
  .logo-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.55);
    opacity: 0;
    transition: opacity 0.2s;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px;
  }
  .logo-btn:hover .logo-overlay { opacity: 1; }
  .logout-btn {
    transition: all 0.15s ease;
    border: none; background: none; cursor: pointer;
  }
  .logout-btn:hover { background: ${theme.danger}12 !important; color: ${theme.danger} !important; }
  .logout-btn:hover .logout-icon { color: ${theme.danger} !important; transform: translateX(-3px); }
  .logout-icon { transition: transform 0.2s ease, color 0.15s ease; }
  .section-items-enter { animation: sectIn 0.2s ease both; }
  @keyframes sectIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .modal-over { animation: ovIn 0.18s ease; }
  @keyframes ovIn { from{opacity:0} to{opacity:1} }
  .modal-box { animation: mbIn 0.22s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes mbIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
`;

const menuSections = [
  {
    id: 'inicio',
    title: 'Inicio',
    items: [
      { path: '/administrar', label: 'Administrar', icon: LayoutDashboard },
    ],
  },
  {
    id: 'informes',
    title: 'Informes',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
      { path: '/resumenes', label: 'Resúmenes', icon: FileText },
    ],
  },
  {
    id: 'finanzas',
    title: 'Finanzas',
    items: [
      { path: '/ventas', label: 'Registrar Ventas', icon: ShoppingCart },
      { path: '/contabilidad', label: 'Contabilidad', icon: DollarSign },
      { path: '/ingresos-egresos', label: 'Ingresos', icon: TrendingUp },
    ],
  },
  {
    id: 'stock',
    title: 'Stock',
    items: [
      { path: '/inventario', label: 'Inventario', icon: Package },
      { path: '/compras', label: 'Compras', icon: ShoppingBag },
    ],
  },
  {
    id: 'administracion',
    title: 'Administración',
    items: [
      { path: '/cocina', label: 'Cocina', icon: UtensilsCrossed },
      { path: '/mesas', label: 'Mesas', icon: UtensilsCrossed },
      { path: '/atencion', label: 'Atención', icon: Truck },
      { path: '/turnos', label: 'Turnos', icon: Clock },
      { path: '/metodos-pago', label: 'Métodos de Pago', icon: CreditCard },
      { path: '/configuracion', label: 'Info. Fiscal', icon: Settings },
    ],
  },
];

/* ─── Dot indicator de sección activa ─── */
function SectionDot({ color = theme.accent }) {
  return (
    <div style={{
      width: 5, height: 5, borderRadius: '50%',
      background: color, flexShrink: 0,
    }} />
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState({});
  const [logoImage, setLogoImage] = useState(() => {
    try { return localStorage.getItem('commerce_logo') || null; } catch { return null; }
  });
  const [showLogoModal, setShowLogoModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleSection = (id) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoImage(reader.result);
      try { localStorage.setItem('commerce_logo', reader.result); } catch {}
      setShowLogoModal(false);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoImage(null);
    try { localStorage.removeItem('commerce_logo'); } catch {}
    setShowLogoModal(false);
  };

  /* saber si alguna ruta de la sección está activa */
  const isSectionActive = (section) =>
    section.items.some((item) => isActive(item.path));

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="sidebar-root"
        style={{
          width: 240,
          background: theme.surface,
          borderRight: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* ─── Header / Logo ─── */}
        <div style={{
          padding: '20px 18px',
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Logo */}
            <div
              className="logo-btn"
              onClick={() => setShowLogoModal(true)}
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: logoImage ? 'transparent' : `linear-gradient(135deg, ${theme.accent}, #0891b2)`,
                border: `1px solid ${theme.borderLight}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}
            >
              {logoImage
                ? <img src={logoImage} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Store size={20} color="#fff" />
              }
              <div className="logo-overlay">
                <Upload size={13} color="#fff" />
              </div>
            </div>

            {/* Nombre */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Nombre del Comercio
              </div>
              <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 1 }}>
                Sistema de gestión
              </div>
            </div>
          </div>
        </div>

        {/* ─── Nav ─── */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {menuSections.map((section, si) => {
            const sectionActive = isSectionActive(section);
            const isCollapsed = collapsed[section.id];

            return (
              <div key={section.id} style={{ marginBottom: si < menuSections.length - 1 ? 4 : 0 }}>
                {/* Section header */}
                <button
                  className="section-toggle"
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    color: sectionActive ? theme.accent : theme.textMuted,
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.7px',
                    textTransform: 'uppercase',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {sectionActive && <SectionDot />}
                    {section.title}
                  </div>
                  {isCollapsed
                    ? <ChevronRight size={12} color={theme.textDim} />
                    : <ChevronDown size={12} color={theme.textDim} />
                  }
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="section-items-enter" style={{ marginTop: 2, marginBottom: 6 }}>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`nav-item ${active ? 'active-item' : ''}`}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 10px',
                            borderRadius: 9,
                            color: active ? theme.accent : theme.textMuted,
                            fontSize: 13,
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: active ? 600 : 400,
                            textAlign: 'left',
                          }}
                        >
                          <Icon
                            size={16}
                            className="nav-icon"
                            style={{ flexShrink: 0, color: active ? theme.accent : theme.textMuted }}
                          />
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                          {active && <div className="active-bar" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Divisor entre secciones */}
                {si < menuSections.length - 1 && (
                  <div style={{ height: 1, background: theme.border, margin: '4px 6px 8px' }} />
                )}
              </div>
            );
          })}
        </nav>

        {/* ─── Footer ─── */}
        <div style={{ padding: '10px', borderTop: `1px solid ${theme.border}` }}>
          <button
            className="logout-btn"
            onClick={() => {
              if (window.confirm('¿Cerrar sesión?')) navigate('/login');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              color: theme.textMuted,
              fontFamily: 'Sora, sans-serif',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <LogOut size={16} className="logout-icon" style={{ color: theme.textMuted }} />
            Cerrar Sesión
          </button>
        </div>

        {/* ─── Modal cambiar logo ─── */}
        {showLogoModal && (
          <div
            className="modal-over"
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: 16,
            }}
            onClick={(e) => e.target === e.currentTarget && setShowLogoModal(false)}
          >
            <div
              className="modal-box"
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: 28,
                width: '100%',
                maxWidth: 340,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Logo del comercio</h3>
                  <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>PNG, JPG o GIF · máx 2MB</p>
                </div>
                <button
                  onClick={() => setShowLogoModal(false)}
                  style={{ background: theme.border, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: theme.textMuted }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Preview */}
              {logoImage && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <img
                    src={logoImage}
                    alt="Preview"
                    style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', border: `2px solid ${theme.borderLight}` }}
                  />
                </div>
              )}

              {/* Upload zone */}
              <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{
                  border: `2px dashed ${theme.borderLight}`,
                  borderRadius: 12,
                  padding: '24px 16px',
                  textAlign: 'center',
                  transition: 'border-color 0.15s',
                  marginBottom: 12,
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.borderLight)}
                >
                  <Upload size={24} color={theme.textMuted} style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 13, color: theme.text, fontWeight: 600, marginBottom: 4 }}>
                    Subir imagen
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>
                    Hacé clic para seleccionar
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              </label>

              {/* Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {logoImage && (
                  <button
                    onClick={removeLogo}
                    style={{
                      padding: '10px', background: `${theme.danger}12`,
                      border: `1px solid ${theme.danger}25`, borderRadius: 10,
                      color: theme.danger, cursor: 'pointer',
                      fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
                      transition: 'all 0.15s',
                    }}
                  >
                    Eliminar logo
                  </button>
                )}
                <button
                  onClick={() => setShowLogoModal(false)}
                  style={{
                    padding: '10px', background: theme.surface,
                    border: `1px solid ${theme.border}`, borderRadius: 10,
                    color: theme.textMuted, cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif', fontSize: 13,
                    transition: 'all 0.15s',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}