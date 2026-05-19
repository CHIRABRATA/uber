import { useEffect, useState } from 'react';

const ROLE_THEMES = {
  user: {
    accent: '#00D4AA',
    accentRgb: '0,212,170',
    glow: 'rgba(0,212,170,0.2)',
    label: 'PASSENGER',
    headline: ['BOOK', 'YOUR', 'RIDE.'],
    copy: 'Access your ride history, saved places, and get your next trip sorted in seconds.',
    stats: [['700+', 'Cities'], ['4M+', 'Rides Daily'], ['4.9★', 'Avg Rating']],
  },
  captain: {
    accent: '#FF6B35',
    accentRgb: '255,107,53',
    glow: 'rgba(255,107,53,0.2)',
    label: 'CAPTAIN',
    headline: ['DRIVE.', 'EARN.', 'REPEAT.'],
    copy: 'Manage your vehicle, track earnings, and hit the road on your own schedule.',
    stats: [['₹35K', 'Avg Monthly'], ['3M+', 'Captains'], ['98%', 'On Time']],
  },
};

const initialForm = { name: '', email: '', password: '', vehicleType: 'car', capacity: '4', role: 'rider' };

const IconUser    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconLock    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconCar     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3v-4l2-5h14l2 5v4h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const IconUsers   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconArrow   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export default function AuthPage({ defaultRole = 'user', defaultMode = 'login' }) {
  const [role, setRole]           = useState(defaultRole);
  const [mode, setMode]           = useState(defaultMode);
  const [form, setForm]           = useState(initialForm);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState({ type: '', message: '' });
  const [mounted, setMounted]     = useState(false);
  const [headlineIdx, setHeadlineIdx] = useState(0);

  const theme = ROLE_THEMES[role];

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => { setStatus({ type: '', message: '' }); }, [mode, role]);
  useEffect(() => {
    setHeadlineIdx(0);
    const iv = setInterval(() => setHeadlineIdx(i => (i + 1) % theme.headline.length), 2000);
    return () => clearInterval(iv);
  }, [role, theme.headline.length]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    const base = role === 'captain' ? '/api/captains' : '/api/users';
    const endpoint = `${base}/${mode === 'signup' ? 'register' : 'login'}`;
    const payload = mode === 'login'
      ? { email: form.email, password: form.password }
      : role === 'user'
        ? { name: form.name, email: form.email, password: form.password, role: form.role }
        : { name: form.name, email: form.email, password: form.password, vehicleType: form.vehicleType, capacity: Number(form.capacity) };
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
      const raw = await res.text();
      let data = null;
      try { data = JSON.parse(raw); } catch {}
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || data?.message || raw || `Error ${res.status}`);
      setStatus({ type: 'success', message: data?.message || (mode === 'signup' ? 'Account created!' : 'Logged in!') });
      if (mode === 'signup') setMode('login');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body { background: #030308; }

    .ap-root {
      min-height: 100vh;
      background: #030308;
      color: #fff;
      display: flex;
      flex-direction: column;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    .ap-bg-lines {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .ap-bg-orb {
      position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
      filter: blur(120px);
    }
    .ap-bg-orb-1 {
      width: 800px; height: 800px;
      top: -260px; right: -200px;
      animation: orbFloat1 16s ease-in-out infinite alternate;
    }
    .ap-bg-orb-2 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(100,50,200,0.14) 0%, transparent 70%);
      bottom: -200px; left: -150px;
      animation: orbFloat2 20s ease-in-out infinite alternate;
    }
    @keyframes orbFloat1 {
      0%   { transform: translate(0,0) scale(1); }
      100% { transform: translate(-30px, 25px) scale(1.06); }
    }
    @keyframes orbFloat2 {
      0%   { transform: translate(0,0) scale(1); }
      100% { transform: translate(25px,-20px) scale(0.94); }
    }

    /* NAV */
    .ap-nav {
      position: relative; z-index: 20;
      display: flex; align-items: center; justify-content: space-between;
      padding: 22px 5vw;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: rgba(3,3,8,0.6);
      backdrop-filter: blur(20px);
    }
    .ap-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 34px;
      letter-spacing: 0.08em;
      color: #fff;
    }
    .ap-logo-accent { transition: color 0.6s ease; }
    .ap-nav-back {
      font-family: 'Syne', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      color: rgba(255,255,255,0.55);
      padding: 10px 22px;
      border-radius: 99px;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .ap-nav-back:hover {
      background: rgba(255,255,255,0.09);
      color: #fff;
      border-color: rgba(255,255,255,0.22);
    }

    /* BODY GRID */
    .ap-body {
      position: relative; z-index: 10;
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 1240px;
      margin: 0 auto;
      width: 100%;
      padding: 52px 5vw 64px;
      align-items: center;
      gap: 48px;
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1);
    }
    .ap-body.in { opacity: 1; transform: translateY(0); }

    /* LEFT PANEL */
    .ap-left {
      display: flex; flex-direction: column;
      padding-right: 24px;
    }

    .ap-role-toggle {
      display: inline-flex;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 99px;
      padding: 5px;
      width: fit-content;
      margin-bottom: 40px;
      position: relative;
    }
    .ap-role-bg {
      position: absolute;
      top: 5px; bottom: 5px;
      border-radius: 99px;
      transition: left 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.6s ease;
      z-index: 1;
    }
    .ap-role-btn {
      position: relative; z-index: 2;
      background: transparent; border: none;
      font-family: 'Syne', sans-serif;
      font-size: 12px; font-weight: 800;
      letter-spacing: 0.12em; text-transform: uppercase;
      padding: 10px 24px;
      border-radius: 99px;
      cursor: pointer;
      transition: color 0.3s;
      color: rgba(255,255,255,0.38);
    }
    .ap-role-btn.on { color: #030308; }
    .ap-role-btn:not(.on):hover { color: rgba(255,255,255,0.85); }

    .ap-kicker {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.3em; text-transform: uppercase;
      margin-bottom: 22px;
      display: flex; align-items: center; gap: 12px;
      transition: color 0.6s ease;
    }
    .ap-kicker-bar {
      width: 36px; height: 2px;
      border-radius: 2px;
      transition: background 0.6s ease;
    }

    .ap-headline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(76px, 9.5vw, 124px);
      line-height: 0.87;
      letter-spacing: 0.015em;
      margin-bottom: 30px;
    }
    .ap-headline-line {
      display: block;
      color: rgba(255,255,255,0.22);
      transition: color 0.5s ease;
    }
    .ap-headline-line.current { color: #fff; }
    .ap-headline-line.active-accent { transition: color 0.5s ease; }

    .ap-copy {
      font-size: 15px;
      line-height: 1.85;
      max-width: 400px;
      margin-bottom: 44px;
      font-weight: 300;
      font-style: italic;
      color: rgba(255,255,255,0.45);
    }

    .ap-stats {
      display: flex; gap: 36px;
      padding-top: 36px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }
    .ap-stat-val {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 38px; line-height: 1;
      transition: color 0.6s ease;
    }
    .ap-stat-lbl {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: rgba(255,255,255,0.28);
      margin-top: 5px;
    }

    /* RIGHT / FORM CARD */
    .ap-right { display: flex; flex-direction: column; }

    .ap-card {
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 32px 32px;
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      box-shadow:
        0 40px 80px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.1),
        inset 0 0 0 1px rgba(255,255,255,0.03);
      position: relative;
      overflow: hidden;
    }
    .ap-card-shine {
      position: absolute;
      top: 0; left: -80%;
      width: 45%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
      transform: skewX(-12deg);
      animation: cardShine 10s 2s infinite;
      pointer-events: none; z-index: 0;
    }
    @keyframes cardShine {
      0%   { left: -80%; opacity: 0; }
      8%   { opacity: 1; }
      22%  { left: 170%; opacity: 0; }
      100% { left: 170%; opacity: 0; }
    }
    .ap-card-deco {
      position: absolute;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 260px; line-height: 1;
      color: rgba(255,255,255,0.015);
      right: -10px; bottom: -40px;
      pointer-events: none; user-select: none;
      letter-spacing: -0.06em;
      z-index: 0;
    }
    .ap-card > * { position: relative; z-index: 1; }

    /* Mode tabs */
    .ap-mode-tabs {
      display: flex;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 24px;
    }
    .ap-mode-tab {
      background: none; border: none;
      font-family: 'Syne', sans-serif;
      font-size: 11px; font-weight: 800;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: rgba(255,255,255,0.28);
      padding: 0 0 12px;
      margin-right: 24px;
      cursor: pointer;
      position: relative;
      transition: color 0.28s;
    }
    .ap-mode-tab.on { color: #fff; }
    .ap-mode-tab.on::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0;
      height: 2px; border-radius: 2px;
      transition: background 0.6s ease;
    }
    .ap-mode-tab:not(.on):hover { color: rgba(255,255,255,0.6); }

    .ap-card-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(36px, 5vw, 48px);
      line-height: 1;
      letter-spacing: 0.02em;
      margin-bottom: 20px;
      white-space: pre-line;
    }

    /* Form fields */
    .ap-form  { display: flex; flex-direction: column; gap: 12px; }
    .ap-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ap-field { display: flex; flex-direction: column; gap: 6px; }

    .ap-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: rgba(255,255,255,0.32);
      padding-left: 2px;
    }
    .ap-input-wrap { position: relative; display: flex; align-items: center; }
    .ap-input-icon {
      position: absolute; left: 14px;
      color: rgba(255,255,255,0.22);
      pointer-events: none;
      transition: color 0.28s;
      display: flex; align-items: center;
    }
    .ap-input {
      width: 100%;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: #fff;
      padding: 12px 14px 12px 40px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
      -webkit-appearance: none;
      appearance: none;
    }
    .ap-input::placeholder { color: rgba(255,255,255,0.18); }
    .ap-input:focus {
      background: rgba(0,0,0,0.48);
      box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
    }

    /* Status */
    .ap-status {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 500;
      padding: 12px 16px;
      border-radius: 12px;
      animation: fadeSlideIn 0.3s ease both;
    }
    @keyframes fadeSlideIn {
      from { opacity:0; transform:translateY(-6px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .ap-status.success { background: rgba(0,212,170,0.1); color: #00D4AA; border: 1px solid rgba(0,212,170,0.22); }
    .ap-status.error   { background: rgba(255,80,80,0.1);  color: #ff7575; border: 1px solid rgba(255,80,80,0.22); }

    /* Submit button */
    .ap-submit {
      display: flex; align-items: center; justify-content: center; gap: 12px;
      width: 100%; padding: 17px 24px;
      border: none; border-radius: 14px;
      color: #030308;
      font-family: 'Syne', sans-serif;
      font-size: 14px; font-weight: 800;
      letter-spacing: 0.12em; text-transform: uppercase;
      cursor: pointer;
      transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, opacity 0.2s;
      margin-top: 8px;
      position: relative; overflow: hidden;
    }
    .ap-submit::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%);
      opacity: 0;
      transition: opacity 0.28s;
    }
    .ap-submit:hover:not(:disabled) { transform: translateY(-2px); }
    .ap-submit:hover:not(:disabled)::before { opacity: 1; }
    .ap-submit:active:not(:disabled) { transform: translateY(1px); }
    .ap-submit:disabled { opacity: 0.58; cursor: not-allowed; }
    .ap-submit-arrow { transition: transform 0.28s; }
    .ap-submit:hover:not(:disabled) .ap-submit-arrow { transform: translateX(5px); }

    .ap-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(0,0,0,0.22);
      border-top-color: #030308;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Card footer */
    .ap-card-footer {
      margin-top: 22px;
      text-align: center;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: rgba(255,255,255,0.32);
    }
    .ap-card-footer button {
      background: none; border: none;
      font-family: 'Syne', sans-serif;
      font-size: 13px; font-weight: 700;
      letter-spacing: 0.05em;
      margin-left: 6px; cursor: pointer;
      transition: filter 0.25s;
    }
    .ap-card-footer button:hover { filter: brightness(1.3); }

    /* Responsive */
    @media (max-width: 880px) {
      .ap-body { grid-template-columns: 1fr; padding: 36px 5vw 56px; gap: 36px; }
      .ap-left { padding-right: 0; }
      .ap-headline { font-size: clamp(60px, 16vw, 96px); }
      .ap-stats { gap: 28px; }
    }
    @media (max-width: 500px) {
      .ap-card { padding: 30px 22px 28px; border-radius: 22px; }
      .ap-row  { grid-template-columns: 1fr; }
      .ap-card-title { font-size: 38px; }
    }
  `;

  return (
    <div
      className="ap-root"
      style={{
        '--accent':    theme.accent,
        '--accentRgb': theme.accentRgb,
        '--glow':      theme.glow,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Background layers */}
      <div className="ap-bg-lines" />
      <div
        className="ap-bg-orb ap-bg-orb-1"
        style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 68%)` }}
      />
      <div className="ap-bg-orb ap-bg-orb-2" />

      {/* Navbar */}
      <nav className="ap-nav">
        <div className="ap-logo">
          UB<span className="ap-logo-accent" style={{ color: theme.accent }}>E</span>R
        </div>
        <button className="ap-nav-back" type="button" onClick={() => window.history.back()}>
          ← Home
        </button>
      </nav>

      {/* Main grid */}
      <main className={`ap-body${mounted ? ' in' : ''}`}>

        {/* ── LEFT ── */}
        <div className="ap-left">

          {/* Role toggle pill */}
          <div className="ap-role-toggle">
            <div
              className="ap-role-bg"
              style={{
                background: theme.accent,
                left:  role === 'user' ? '5px' : 'calc(50% + 2.5px)',
                width: 'calc(50% - 7.5px)',
              }}
            />
            {[['user', '🛞 Passenger'], ['captain', '🚖 Captain']].map(([r, label]) => (
              <button
                key={r} type="button"
                className={`ap-role-btn${role === r ? ' on' : ''}`}
                onClick={() => setRole(r)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Kicker */}
          <div className="ap-kicker" style={{ color: theme.accent }}>
            <div className="ap-kicker-bar" style={{ background: theme.accent }} />
            {theme.label} PORTAL
          </div>

          {/* Animated headline */}
          <h1 className="ap-headline">
            {theme.headline.map((line, i) => (
              <span
                key={`${role}-${line}`}
                className={`ap-headline-line${i === headlineIdx ? ' current active-accent' : ''}`}
                style={i === headlineIdx ? { color: theme.accent } : {}}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="ap-copy">{theme.copy}</p>

          {/* Stats */}
          <div className="ap-stats">
            {theme.stats.map(([val, lbl], i) => (
              <div key={i}>
                <div className="ap-stat-val" style={{ color: theme.accent }}>{val}</div>
                <div className="ap-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="ap-right">
          <div className="ap-card">
            <div className="ap-card-shine" />
            <div className="ap-card-deco">{role === 'user' ? '01' : '02'}</div>

            {/* Mode tabs */}
            <div className="ap-mode-tabs">
              {[['login', 'Sign In'], ['signup', 'Register']].map(([m, label]) => (
                <button
                  key={m} type="button"
                  className={`ap-mode-tab${mode === m ? ' on' : ''}`}
                  style={mode === m ? {} : {}}
                  onClick={() => setMode(m)}
                >
                  {label}
                  {mode === m && (
                    <span
                      style={{
                        position: 'absolute', bottom: -1, left: 0, right: 0,
                        height: 2, borderRadius: 2,
                        background: theme.accent,
                        display: 'block',
                        transition: 'background 0.6s',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="ap-card-title">
              {mode === 'login' ? 'Welcome\nBack' : 'Create\nAccount'}
            </div>

            <form className="ap-form" onSubmit={handleSubmit}>
              {/* Name */}
              {mode === 'signup' && (
                <div className="ap-field">
                  <label className="ap-label">Full Name</label>
                  <div className="ap-input-wrap">
                    <div className="ap-input-icon"><IconUser /></div>
                    <input
                      name="name" type="text" className="ap-input"
                      style={{ '--focus-color': theme.accent }}
                      placeholder={role === 'user' ? 'e.g. Arjun Sharma' : 'e.g. Rahul Driver'}
                      value={form.name} onChange={handleChange} required
                      onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${theme.accentRgb},0.14)`; }}
                      onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="ap-field">
                <label className="ap-label">Email Address</label>
                <div className="ap-input-wrap">
                  <div className="ap-input-icon"><IconMail /></div>
                  <input
                    name="email" type="email" className="ap-input"
                    placeholder="name@example.com"
                    value={form.email} onChange={handleChange} required
                    onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${theme.accentRgb},0.14)`; }}
                    onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="ap-field">
                <label className="ap-label">Password</label>
                <div className="ap-input-wrap">
                  <div className="ap-input-icon"><IconLock /></div>
                  <input
                    name="password" type="password" className="ap-input"
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange} minLength="6" required
                    onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${theme.accentRgb},0.14)`; }}
                    onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                  />
                </div>
              </div>

              {/* User: role select */}
              {mode === 'signup' && role === 'user' && (
                <div className="ap-field">
                  <label className="ap-label">Account Role</label>
                  <div className="ap-input-wrap">
                    <div className="ap-input-icon"><IconUsers /></div>
                    <select name="role" className="ap-input" value={form.role} onChange={handleChange}
                      onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${theme.accentRgb},0.14)`; }}
                      onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                    >
                      <option value="rider">Rider</option>
                      <option value="driver">Driver</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Captain fields */}
              {mode === 'signup' && role === 'captain' && (
                <div className="ap-row">
                  <div className="ap-field">
                    <label className="ap-label">Vehicle Type</label>
                    <div className="ap-input-wrap">
                      <div className="ap-input-icon"><IconCar /></div>
                      <select name="vehicleType" className="ap-input" value={form.vehicleType} onChange={handleChange}
                        onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${theme.accentRgb},0.14)`; }}
                        onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                      >
                        <option value="car">Car</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="bicycle">Bicycle</option>
                      </select>
                    </div>
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Capacity</label>
                    <div className="ap-input-wrap">
                      <div className="ap-input-icon"><IconUsers /></div>
                      <input name="capacity" type="number" min="1" className="ap-input"
                        placeholder="4"
                        value={form.capacity} onChange={handleChange} required
                        onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px rgba(${theme.accentRgb},0.14)`; }}
                        onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Status message */}
              {status.message && (
                <div className={`ap-status ${status.type}`}>{status.message}</div>
              )}

              {/* Submit */}
              <button
                type="submit" className="ap-submit" disabled={loading}
                style={{
                  background: theme.accent,
                  boxShadow: `0 8px 28px rgba(${theme.accentRgb},0.35), inset 0 -2px 0 rgba(0,0,0,0.14)`,
                }}
              >
                {loading ? (
                  <><div className="ap-spinner" /> Processing…</>
                ) : (
                  <>
                    {mode === 'login' ? 'Continue' : 'Create Account'}
                    <span className="ap-submit-arrow"><IconArrow /></span>
                  </>
                )}
              </button>
            </form>

            <div className="ap-card-footer">
              {mode === 'login' ? "Don't have an account?" : 'Already registered?'}
              <button
                type="button"
                style={{ color: theme.accent }}
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Sign up →' : 'Log in →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}