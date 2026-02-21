import { useState } from "react";
import { CreditCard, QrCode, Banknote, Copy, Check } from "lucide-react";
import Sidebar from "../components/Sidebar";

/* Paleta (idéntica) */
const t = {
  bg: '#0a0d12', surface: '#111720', card: '#161d28',
  border: '#1e2d3d', borderLight: '#243447',
  accent: '#10b981',
  text: '#e2e8f0', textMuted: '#64748b',
};

const methods = [
  {
    id: "mp-main",
    name: "Mercado Pago",
    icon: QrCode,
    type: "qr",
    alias: "mi.negocio.mp",
    qr: "/public/QR.webp",
  },
  {
    id: "uala",
    name: "Ualá",
    icon: QrCode,
    type: "qr",
    alias: "mi.negocio.uala",
    qr: "/QR.webp",
  },
  {
    id: "nx",
    name: "Naranja X",
    icon: QrCode,
    type: "qr",
    alias: "mi.negocio.nx",
    qr: "/QR.webp",
  },
  {
    id: "transfer",
    name: "Transferencia",
    icon: CreditCard,
    type: "bank",
    alias: "negocio.transferencia",
    cbu: "0000003100012345678901",
  },
  {
    id: "cash",
    name: "Efectivo",
    icon: Banknote,
    type: "cash",
  },
];

export default function PaymentMethods() {
  const [selected, setSelected] = useState(methods[0]);
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: t.bg }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 28 }}>

        {/* Header */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          padding: "20px 26px",
          marginBottom: 20,
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text }}>
            Métodos de Pago
          </h1>
          <p style={{ fontSize: 13, color: t.textMuted }}>
            Seleccioná el método para cobrar al cliente
          </p>
        </div>

        {/* Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>

          {/* Lista */}
          <div style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 18,
            padding: 20,
            display: "grid",
            gap: 12,
          }}>
            {methods.map((m) => {
              const Icon = m.icon;
              const active = selected.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelected(m)}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    cursor: "pointer",
                    border: `1px solid ${active ? t.accent : t.border}`,
                    background: active ? `${t.accent}12` : t.surface,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: `${t.accent}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon size={18} color={t.accent} />
                  </div>

                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>
                      {m.type === "qr" && "Cobro con QR"}
                      {m.type === "bank" && "Transferencia bancaria"}
                      {m.type === "cash" && "Pago en efectivo"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalle */}
          <div style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 18,
            padding: 24,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 14 }}>
              {selected.name}
            </h3>

            {selected.type === "qr" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <img
                  src={selected.qr}
                  alt="QR"
                  style={{
                    width: 220,
                    background: "#fff",
                    padding: 10,
                    borderRadius: 14,
                  }}
                />
                <button
                  onClick={() => copy(selected.alias)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${t.border}`,
                    background: t.surface,
                    color: t.text,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  Alias: {selected.alias}
                </button>
              </div>
            )}

            {selected.type === "bank" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Info label="Alias" value={selected.alias} onCopy={copy} />
                <Info label="CBU" value={selected.cbu} onCopy={copy} />
              </div>
            )}

            {selected.type === "cash" && (
              <div style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                padding: 18,
                fontSize: 13,
                color: t.textMuted,
              }}>
                El cliente abona en efectivo al finalizar el servicio.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable */
function Info({ label, value, onCopy }) {
  return (
    <div style={{
      background: '#111720',
      border: '1px solid #1e2d3d',
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#e2e8f0' }}>{value}</div>
      </div>
      <button onClick={() => onCopy(value)} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <Copy size={14} color="#10b981" />
      </button>
    </div>
  );
}