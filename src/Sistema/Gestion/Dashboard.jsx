import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart,
  Cell,
} from 'recharts';
import {
  Package, ShoppingBag, Users, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar,
} from 'lucide-react';

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
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#334155',
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .dash-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
  .stat-hover { transition: all 0.2s ease; }
  .stat-hover:hover { border-color: ${theme.borderLight} !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .tab-btn { transition: all 0.15s ease; }
  .tab-btn.active { background: ${theme.accent}18 !important; border-color: ${theme.accent}40 !important; color: ${theme.accent} !important; }
  .fade-in { animation: fadeIn 0.4s ease both; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
`;

/* ─── Datos ─── */
const weeklyData = [
  { name: 'Lun', ventas: 12, ingresos: 31200 },
  { name: 'Mar', ventas: 19, ingresos: 49400 },
  { name: 'Mié', ventas: 8,  ingresos: 20800 },
  { name: 'Jue', ventas: 15, ingresos: 39000 },
  { name: 'Vie', ventas: 22, ingresos: 57200 },
  { name: 'Sáb', ventas: 30, ingresos: 78000 },
  { name: 'Dom', ventas: 25, ingresos: 65000 },
];

const monthlyData = [
  { name: 'Ene', ventas: 145, ingresos: 377000 },
  { name: 'Feb', ventas: 162, ingresos: 421200 },
  { name: 'Mar', ventas: 138, ingresos: 358800 },
  { name: 'Abr', ventas: 190, ingresos: 494000 },
  { name: 'May', ventas: 175, ingresos: 455000 },
  { name: 'Jun', ventas: 210, ingresos: 546000 },
];

const recentSales = [
  { customer: 'María García', product: 'Shampoo Premium', amount: 2600, time: 'Hace 5 min', up: true },
  { customer: 'Carlos López', product: 'Tinte Profesional', amount: 3800, time: 'Hace 23 min', up: true },
  { customer: 'Ana Martínez', product: 'Tratamiento Capilar', amount: 4500, time: 'Hace 1 h', up: false },
  { customer: 'Juan Pérez', product: 'Decolorante', amount: 3200, time: 'Hace 2 h', up: true },
];

const fmt = (n) => `$${Number(n).toLocaleString('es-AR')}`;

/* ─── Tooltip personalizado ─── */
function CustomTooltip({ active, payload, label, mode }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.borderLight}`,
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 6 }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
          <span style={{ color: theme.textMuted }}>{entry.name === 'ventas' ? 'Ventas' : 'Ingresos'}:</span>
          <span style={{ fontWeight: 700, color: theme.text, fontFamily: 'JetBrains Mono' }}>
            {entry.name === 'ventas' ? entry.value : fmt(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── StatCard ─── */
function StatCard({ icon: Icon, label, value, sub, color, trend, trendUp }) {
  return (
    <div className="stat-hover" style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: 16, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: `${color}18`, border: `1px solid ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600,
            color: trendUp ? theme.accent : theme.danger,
            background: trendUp ? `${theme.accent}12` : `${theme.danger}12`,
            padding: '3px 8px', borderRadius: 20,
          }}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: theme.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 5 }}>{label}</div>
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: theme.textDim, borderTop: `1px solid ${theme.border}`, paddingTop: 10 }}>{sub}</div>
      )}
    </div>
  );
}

/* ─── DASHBOARD ─── */
export default function Dashboard() {
  const [period, setPeriod] = useState('semana'); // 'semana' | 'mes'
  const [chartMode, setChartMode] = useState('ventas'); // 'ventas' | 'ingresos'
  const data = period === 'semana' ? weeklyData : monthlyData;
  const maxVal = Math.max(...data.map(d => d[chartMode]));

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="dash-root" style={{ display: 'flex', height: '100vh', background: theme.bg, overflow: 'hidden' }}>
        <Sidebar />

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* ─── Header ─── */}
          <div style={{
            padding: '28px 32px 22px',
            borderBottom: `1px solid ${theme.border}`,
            background: theme.surface,
            position: 'sticky', top: 0, zIndex: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: '-0.5px', marginBottom: 4 }}>
                  Panel de Control
                </h1>
                <p style={{ fontSize: 13, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={13} />
                  {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div style={{
                background: `${theme.accent}15`, border: `1px solid ${theme.accent}30`,
                borderRadius: 10, padding: '8px 14px',
                fontSize: 12, color: theme.accent, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.accent }} />
                Sistema activo
              </div>
            </div>
          </div>

          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ─── Stats ─── */}
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <StatCard icon={DollarSign} label="Ingresos Hoy" value={fmt(340600)} color={theme.accent} trend="+14%" trendUp={true} sub="vs. ayer: $298.500" />
              <StatCard icon={ShoppingBag} label="Ventas Hoy" value="131" color={theme.info} trend="+8%" trendUp={true} sub="Promedio: $2.600 por venta" />
              <StatCard icon={Package} label="Productos" value="120" color={theme.gold} sub="3 con stock crítico" />
              <StatCard icon={Users} label="Clientes" value="57" color={theme.purple} trend="-2%" trendUp={false} sub="4 nuevos esta semana" />
            </div>

            {/* ─── Gráfico principal ─── */}
            <div className="fade-in" style={{
              background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: 20, padding: '24px 28px',
              animationDelay: '0.1s',
            }}>
              {/* Chart header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
                    {chartMode === 'ventas' ? 'Cantidad de ventas' : 'Ingresos generados'}
                  </h2>
                  <div className="mono" style={{ fontSize: 28, fontWeight: 800, color: theme.accent }}>
                    {chartMode === 'ventas'
                      ? data.reduce((s, d) => s + d.ventas, 0)
                      : fmt(data.reduce((s, d) => s + d.ingresos, 0))
                    }
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>
                    Total — {period === 'semana' ? 'esta semana' : 'últimos 6 meses'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
                  {/* Período */}
                  <div style={{ display: 'flex', gap: 6, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 4 }}>
                    {['semana', 'mes'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        style={{
                          padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                          background: period === p ? theme.accent : 'transparent',
                          color: period === p ? '#fff' : theme.textMuted,
                          fontSize: 12, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                          transition: 'all 0.15s',
                          textTransform: 'capitalize',
                        }}
                      >
                        {p === 'semana' ? 'Semana' : '6 meses'}
                      </button>
                    ))}
                  </div>
                  {/* Métrica */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { key: 'ventas', label: 'Ventas', color: theme.accent },
                      { key: 'ingresos', label: 'Ingresos', color: theme.purple },
                    ].map(({ key, label, color }) => (
                      <button
                        key={key}
                        onClick={() => setChartMode(key)}
                        style={{
                          padding: '5px 12px', borderRadius: 7, cursor: 'pointer',
                          background: chartMode === key ? `${color}18` : 'transparent',
                          border: `1px solid ${chartMode === key ? color + '50' : theme.border}`,
                          color: chartMode === key ? color : theme.textMuted,
                          fontSize: 11, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                          display: 'flex', alignItems: 'center', gap: 5,
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: chartMode === key ? color : theme.textDim }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} barSize={period === 'semana' ? 36 : 28} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartMode === 'ventas' ? theme.accent : theme.purple} stopOpacity={1} />
                        <stop offset="100%" stopColor={chartMode === 'ventas' ? theme.accentMuted : '#4c1d95'} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke={theme.textMuted}
                      tick={{ fill: theme.textMuted, fontSize: 12, fontFamily: 'Sora' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={theme.textMuted}
                      tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={chartMode === 'ingresos' ? (v) => `$${(v / 1000).toFixed(0)}k` : undefined}
                      width={chartMode === 'ingresos' ? 52 : 32}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: `${theme.borderLight}50`, radius: 6 }} />
                    <Bar dataKey={chartMode} radius={[8, 8, 0, 0]} fill="url(#barGrad)">
                      {data.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry[chartMode] === maxVal ? (chartMode === 'ventas' ? theme.accent : theme.purple) : 'url(#barGrad)'}
                          opacity={entry[chartMode] === maxVal ? 1 : 0.7}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Leyenda inferior */}
              <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>Día pico</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
                    {data.find(d => d[chartMode] === maxVal)?.name}
                    <span className="mono" style={{ fontSize: 13, color: theme.accent, marginLeft: 8 }}>
                      {chartMode === 'ventas' ? maxVal : fmt(maxVal)}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>Promedio diario</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
                    {chartMode === 'ventas'
                      ? Math.round(data.reduce((s, d) => s + d.ventas, 0) / data.length)
                      : fmt(Math.round(data.reduce((s, d) => s + d.ingresos, 0) / data.length))
                    }
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>Tendencia</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ArrowUpRight size={15} /> +18% vs período anterior
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Bottom row: Mini tendencia + Ventas recientes ─── */}
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16, animationDelay: '0.2s' }}>

              {/* Mini área chart */}
              <div style={{
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 18, padding: '22px 22px 16px',
              }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Tendencia de ingresos</div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: theme.gold }}>
                    {fmt(monthlyData.reduce((s, d) => s + d.ingresos, 0))}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Últimos 6 meses</div>
                </div>

                <div style={{ height: 100 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.gold} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={theme.gold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tick={{ fill: theme.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="ingresos" stroke={theme.gold} strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ventas recientes */}
              <div style={{
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 18, padding: '22px 22px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Ventas recientes</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Hoy</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recentSales.map((sale, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      paddingBottom: i < recentSales.length - 1 ? 12 : 0,
                      borderBottom: i < recentSales.length - 1 ? `1px solid ${theme.border}` : 'none',
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `${theme.accent}18`, border: `1px solid ${theme.accent}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: theme.accent,
                      }}>
                        {sale.customer.charAt(0)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 1 }}>
                          {sale.customer}
                        </div>
                        <div style={{ fontSize: 11, color: theme.textMuted, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            background: `${theme.purple}15`, color: theme.purple,
                            padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500,
                          }}>
                            {sale.product}
                          </span>
                          · {sale.time}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: theme.accent }}>
                          {fmt(sale.amount)}
                        </div>
                        <div style={{ fontSize: 10, color: sale.up ? theme.accent : theme.danger, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                          {sale.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {sale.up ? 'Pagado' : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}