// ============================================================
//  🔥 FIREBASE CONFIG — descomentar cuando el back esté listo
//  Firebase Console → Project Settings → Your apps → Web app
// ============================================================
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey:            "TU_API_KEY",
//   authDomain:        "TU_PROJECT.firebaseapp.com",
//   projectId:         "TU_PROJECT_ID",
//   storageBucket:     "TU_PROJECT.appspot.com",
//   messagingSenderId: "TU_MESSAGING_SENDER_ID",
//   appId:             "TU_APP_ID",
// };

// const app  = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// ============================================================

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Globe, Store, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Paleta unificada ─── */
const t = {
  bg: '#0a0d12', surface: '#111720', card: '#161d28',
  border: '#1e2d3d', borderLight: '#243447',
  accent: '#10b981', accentMuted: '#064e3b',
  text: '#e2e8f0', textMuted: '#64748b', textDim: '#334155',
  danger: '#ef4444', purple: '#8b5cf6', info: '#38bdf8',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .auth-root * { font-family: 'Sora', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace !important; }

  .auth-bg {
    position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
  }
  .auth-bg-orb {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
    animation: orbFloat 8s ease-in-out infinite;
  }
  @keyframes orbFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  .auth-card {
    position: relative; z-index: 1;
    background: ${t.card};
    border: 1px solid ${t.border};
    border-radius: 22px;
    padding: 36px 32px;
    width: 100%; max-width: 420px;
    animation: cardIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes cardIn {
    from { opacity:0; transform: translateY(16px) scale(0.97); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  .auth-input {
    width: 100%;
    background: ${t.surface};
    border: 1px solid ${t.border};
    border-radius: 11px;
    padding: 13px 14px 13px 42px;
    color: ${t.text};
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .auth-input::placeholder { color: ${t.textMuted}; }
  .auth-input:focus { border-color: ${t.accent}; background: ${t.accent}08; }
  .auth-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-main {
    transition: all 0.15s ease;
    cursor: pointer;
    border: none;
  }
  .btn-main:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,0.25); }
  .btn-main:active:not(:disabled) { transform: translateY(0); }
  .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-tab { transition: all 0.2s ease; cursor: pointer; border: none; }
  .btn-btype { transition: all 0.18s ease; cursor: pointer; border: none; }
  .btn-btype:hover { transform: translateY(-2px); }

  .view-enter { animation: vIn 0.22s ease both; }
  @keyframes vIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .domain-preview {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: ${t.textMuted};
    background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 7px; padding: 5px 10px; margin-top: 6px;
    display: flex; align-items: center; gap: 4px;
  }

  .auth-sep {
    display: flex; align-items: center; gap: 12px; margin: 16px 0;
  }
  .auth-sep::before, .auth-sep::after {
    content: ''; flex: 1; height: 1px; background: ${t.border};
  }

  .error-box {
    background: ${t.danger}12;
    border: 1px solid ${t.danger}40;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12px;
    color: ${t.danger};
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
`;

// ── Mensajes de error de Firebase en español
// (descomentar junto con la integración real)
// const FIREBASE_ERRORS = {
//   'auth/invalid-email':          'El email no es válido.',
//   'auth/user-not-found':         'No existe una cuenta con ese email.',
//   'auth/wrong-password':         'Contraseña incorrecta.',
//   'auth/email-already-in-use':   'Ese email ya está registrado.',
//   'auth/weak-password':          'La contraseña debe tener al menos 6 caracteres.',
//   'auth/too-many-requests':      'Demasiados intentos. Esperá unos minutos.',
//   'auth/network-request-failed': 'Error de red. Revisá tu conexión.',
//   'auth/invalid-credential':     'Email o contraseña incorrectos.',
// };
// const friendlyError = (code) => FIREBASE_ERRORS[code] || 'Ocurrió un error. Intentá de nuevo.';

const BUSINESS_TYPES = [
  { id: 'barberia',    name: 'Barbería',    emoji: '💈' },
  { id: 'kiosco',     name: 'Kiosco',      emoji: '🏪' },
  { id: 'ropa',       name: 'Ropa',        emoji: '👗' },
  { id: 'tecnologia', name: 'Tecnología',  emoji: '💻' },
  { id: 'restaurante',name: 'Restaurante', emoji: '🍔' },
  { id: 'otro',       name: 'Otro',        emoji: '✨' },
];

function AuthInput({ icon: Icon, rightIcon, onRightClick, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={16} color={t.textMuted} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input className="auth-input" {...props} />
      {rightIcon && (
        <button type="button" onClick={onRightClick} style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted,
          display: 'flex', alignItems: 'center',
        }}>
          {rightIcon}
        </button>
      )}
    </div>
  );
}

const Label = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 8, letterSpacing: '0.2px' }}>
    {children}
  </div>
);

export default function TenantAuthSystem() {
  const navigate = useNavigate();
  const [view, setView]                 = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const [registerData, setRegisterData] = useState({ email: '', password: '', businessType: '', domain: '' });
  const [loginData, setLoginData]       = useState({ email: '', password: '', domain: '' });

  const setReg = (k, v) => { setRegisterData(prev => ({ ...prev, [k]: v })); setError(''); };
  const setLog = (k, v) => { setLoginData(prev => ({ ...prev, [k]: v })); setError(''); };

  // ── LOGIN ──────────────────────────────────────────────────
  // ✅ MOCK — para desarrollo front, redirige directo sin Firebase
  const handleLogin = (e) => {
    e?.preventDefault();
    navigate('/administrar');
  };
  // 🔥 REAL — descomentar cuando se conecte Firebase:
  // const handleLogin = async (e) => {
  //   e?.preventDefault();
  //   setError('');
  //   setLoading(true);
  //   try {
  //     await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
  //     navigate('/administrar');
  //   } catch (err) {
  //     setError(friendlyError(err.code));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ── REGISTRO ───────────────────────────────────────────────
  // ✅ MOCK — para desarrollo front, valida campos y redirige
  const handleRegister = (e) => {
    e?.preventDefault();
    if (!registerData.businessType) { setError('Seleccioná el tipo de negocio.'); return; }
    if (!registerData.domain)       { setError('Ingresá un dominio para tu negocio.'); return; }
    navigate('/administrar');
  };
  // 🔥 REAL — descomentar cuando se conecte Firebase:
  // const handleRegister = async (e) => {
  //   e?.preventDefault();
  //   if (!registerData.businessType) { setError('Seleccioná el tipo de negocio.'); return; }
  //   if (!registerData.domain)       { setError('Ingresá un dominio para tu negocio.'); return; }
  //   setError('');
  //   setLoading(true);
  //   try {
  //     await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
  //     navigate('/administrar');
  //   } catch (err) {
  //     setError(friendlyError(err.code));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <style>{STYLES}</style>

      <div className="auth-bg">
        <div className="auth-bg-orb" style={{ width: 400, height: 400, background: t.accent, top: '-100px', left: '-100px', animationDelay: '0s' }} />
        <div className="auth-bg-orb" style={{ width: 300, height: 300, background: t.purple, bottom: '-80px', right: '-60px', animationDelay: '4s' }} />
        <div className="auth-bg-orb" style={{ width: 200, height: 200, background: t.info, top: '60%', left: '40%', animationDelay: '2s', opacity: 0.07 }} />
      </div>

      <div className="auth-root" style={{
        minHeight: '100vh', background: t.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${t.accent}, #0891b2)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12, boxShadow: `0 8px 32px ${t.accent}40`,
            }}>
              <Store size={24} color="#fff" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: '-0.5px' }}>
              Sistema de Gestión
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>
              Administrá tu negocio desde cualquier lugar
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4,
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: 4, marginBottom: 18,
          }}>
            {[
              { id: 'login',    label: 'Iniciar sesión' },
              { id: 'register', label: 'Crear cuenta'   },
            ].map(({ id, label }) => (
              <button
                key={id}
                className="btn-tab"
                onClick={() => { setView(id); setError(''); }}
                style={{
                  flex: 1, padding: '10px',
                  background: view === id ? t.accent : 'transparent',
                  border: 'none', borderRadius: 10,
                  color: view === id ? '#fff' : t.textMuted,
                  fontWeight: view === id ? 700 : 500,
                  fontSize: 13, fontFamily: 'Sora, sans-serif',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="auth-card">

            {/* ─── LOGIN ─── */}
            {view === 'login' && (
              <div className="view-enter">
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 4 }}>
                    Bienvenido de vuelta
                  </h2>
                  <p style={{ fontSize: 13, color: t.textMuted }}>Ingresá a tu negocio digital</p>
                </div>

                {error && <div className="error-box">⚠️ {error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <Label>Email</Label>
                    <AuthInput
                      icon={Mail} type="email" placeholder="tu@email.com"
                      value={loginData.email} disabled={loading}
                      onChange={e => setLog('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contraseña</Label>
                    <AuthInput
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginData.password} disabled={loading}
                      onChange={e => setLog('password', e.target.value)}
                      rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onRightClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                  <div>
                    <Label>Dominio del negocio</Label>
                    <AuthInput
                      icon={Globe} type="text" placeholder="minegocio"
                      value={loginData.domain} disabled={loading}
                      onChange={e => setLog('domain', e.target.value)}
                    />
                    {loginData.domain && (
                      <div className="domain-preview">
                        <Globe size={10} />
                        <span>{loginData.domain}.sistema.ar</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="btn-main"
                  onClick={handleLogin}
                  disabled={loading}
                  style={{
                    width: '100%', marginTop: 22, padding: '14px',
                    background: t.accent, borderRadius: 12,
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    fontFamily: 'Sora, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {loading ? '⏳ Ingresando...' : <> Iniciar sesión <ArrowRight size={15} /> </>}
                </button>

                <div className="auth-sep">
                  <span style={{ fontSize: 11, color: t.textDim }}>acceso directo</span>
                </div>

                <button
                  onClick={() => navigate('/administrar')}
                  style={{
                    width: '100%', padding: '12px',
                    background: t.surface, border: `1px solid ${t.border}`,
                    borderRadius: 11, color: t.textMuted, cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = t.borderLight)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
                >
                  🏠 Ir al inicio sin sesión
                </button>
              </div>
            )}

            {/* ─── REGISTRO ─── */}
            {view === 'register' && (
              <div className="view-enter">
                <div style={{ marginBottom: 22 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 4 }}>
                    Comenzá tu negocio digital
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      background: `${t.accent}15`, border: `1px solid ${t.accent}30`,
                      borderRadius: 20, padding: '2px 10px',
                      fontSize: 11, color: t.accent, fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <Sparkles size={10} /> Gratis · Sin tarjeta de crédito
                    </div>
                  </div>
                </div>

                {error && <div className="error-box">⚠️ {error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <Label>Email</Label>
                    <AuthInput
                      icon={Mail} type="email" placeholder="tu@email.com"
                      value={registerData.email} disabled={loading}
                      onChange={e => setReg('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contraseña</Label>
                    <AuthInput
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.password} disabled={loading}
                      onChange={e => setReg('password', e.target.value)}
                      rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onRightClick={() => setShowPassword(!showPassword)}
                    />
                  </div>

                  <div>
                    <Label>Tipo de negocio</Label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {BUSINESS_TYPES.map(type => {
                        const selected = registerData.businessType === type.id;
                        return (
                          <button
                            key={type.id}
                            className="btn-btype"
                            type="button"
                            disabled={loading}
                            onClick={() => setReg('businessType', type.id)}
                            style={{
                              padding: '12px 8px',
                              background: selected ? `${t.accent}15` : t.surface,
                              border: `1px solid ${selected ? t.accent : t.border}`,
                              borderRadius: 11, cursor: 'pointer',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                            }}
                          >
                            <span style={{ fontSize: 22 }}>{type.emoji}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: selected ? t.accent : t.textMuted, fontFamily: 'Sora, sans-serif' }}>
                              {type.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Tu dominio único</Label>
                    <AuthInput
                      icon={Globe} type="text" placeholder="minegocio"
                      value={registerData.domain} disabled={loading}
                      onChange={e => setReg('domain', e.target.value)}
                    />
                    {registerData.domain && (
                      <div className="domain-preview">
                        <CheckCircle size={10} color={t.accent} />
                        <span><span style={{ color: t.accent }}>{registerData.domain}</span>.sistema.ar</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="btn-main"
                  onClick={handleRegister}
                  disabled={loading}
                  style={{
                    width: '100%', marginTop: 22, padding: '14px',
                    background: t.accent, borderRadius: 12,
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    fontFamily: 'Sora, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {loading ? '⏳ Creando cuenta...' : <> Crear mi negocio <ArrowRight size={15} /> </>}
                </button>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: t.textDim }}>
            Al continuar aceptás los términos de servicio y la política de privacidad
          </div>
        </div>
      </div>
    </>
  );
}