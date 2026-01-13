// Dashboard principal
// Estilo admin oscuro con Tailwind + gráfico

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", ventas: 12 },
  { name: "Mar", ventas: 19 },
  { name: "Mié", ventas: 8 },
  { name: "Jue", ventas: 15 },
  { name: "Vie", ventas: 22 },
  { name: "Sáb", ventas: 30 },
  { name: "Dom", ventas: 25 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 text-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-black">

      {/* TÍTULO */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-slate-400">
          Gestioná toda tu tienda desde acá.
        </p>
      </header>

      {/* STATS */}
      <section className="grid gap-6 md:grid-cols-3 mb-10">
        <StatCard title="Productos" value="120" />
        <StatCard title="Pedidos Hoy" value="18" />
        <StatCard title="Clientes" value="57" />
      </section>

      {/* GRÁFICO */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">
          Ventas de la semana
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

/* ======================
   COMPONENTE DE STAT
====================== */
function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-lg">
      <span className="text-sm text-slate-400">{title}</span>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
