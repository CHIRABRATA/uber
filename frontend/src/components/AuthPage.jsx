import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ROLE_THEMES = {
  user: {
    accent: '#00D4AA',
    glow: 'rgba(0, 212, 170, 0.25)',
    title: 'Rider account',
    subtitle: 'Book rides with a user profile',
    copy: 'Sign in to access your ride history, saved places, and book your next trip.',
  },
  captain: {
    accent: '#FF6B35',
    glow: 'rgba(255, 107, 53, 0.25)',
    title: 'Captain profile',
    subtitle: 'Drive and earn on your schedule',
    copy: 'Manage your vehicle, track your earnings, and hit the road to accept requests.',
  },
};

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'rider',
  vehicleType: 'car',
  capacity: '4',
};

// --- SVG Icons (Lucide-like) ---
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconMail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const IconLock = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const IconCar = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-6 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0"/></svg>);
const IconUsers = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconArrowRight = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);

export default function AuthPage({ defaultRole = 'user', defaultMode = 'login' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get('role');
  const queryMode = searchParams.get('mode');

  const [role, setRole] = useState(queryRole === 'captain' ? 'captain' : defaultRole);
  const [mode, setMode] = useState(queryMode === 'signup' ? 'signup' : defaultMode);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setRole(queryRole === 'captain' ? 'captain' : defaultRole);
    setMode(queryMode === 'signup' ? 'signup' : defaultMode);
  }, [defaultMode, defaultRole, queryMode, queryRole]);

  useEffect(() => {
    setStatus({ type: '', message: '' });
    setForm((current) => ({
      ...current,
      role: role === 'user' ? 'rider' : current.role,
    }));
  }, [mode, role]);

  const theme = ROLE_THEMES[role] || ROLE_THEMES.user;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const endpointBase = role === 'captain' ? '/api/captains' : '/api/users';
    const endpoint = `${endpointBase}/${mode === 'signup' ? 'register' : 'login'}`;
    const payload =
      mode === 'login'
        ? {
            email: form.email,
            password: form.password,
          }
        : role === 'user'
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              vehicleType: form.vehicleType,
              capacity: Number(form.capacity),
            };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const rawBody = await response.text();
      let data = null;

      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        const firstError = data?.errors?.[0]?.msg;
        throw new Error(firstError || data?.message || rawBody || `Request failed with status ${response.status}`);
      }

      setStatus({
        type: 'success',
        message: data?.message || (mode === 'signup' ? 'Account created successfully.' : 'Logged in successfully.'),
      });

      if (mode === 'signup') {
        setMode('login');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell" style={{ '--accent': theme.accent, '--glow': theme.glow }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap');

        * { box-sizing: border-box; }

        .auth-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 28%),
            radial-gradient(circle at bottom right, var(--glow), transparent 34%),
            linear-gradient(135deg, #05050f, #090a16 55%, #05050f);
          color: #fff;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .auth-shell::before,
        .auth-shell::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .auth-shell::before {
          width: 420px;
          height: 420px;
          top: -120px;
          right: -140px;
          background: var(--glow);
          opacity: 0.8;
        }

        .auth-shell::after {
          width: 320px;
          height: 320px;
          left: -120px;
          bottom: -120px;
          background: rgba(255,255,255,0.06);
        }

        .auth-topbar {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          max-width: 1180px;
          margin: 0 auto 24px;
        }

        .auth-brand {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-brand strong {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          letter-spacing: 0.08em;
          line-height: 1;
        }

        .auth-brand span,
        .auth-kicker,
        .auth-footer,
        .hero-copy,
        .field-hint,
        .status-text {
          font-family: 'DM Sans', sans-serif;
        }

        .auth-brand span {
          color: rgba(255,255,255,0.58);
          font-size: 13px;
        }

        .home-link {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.03);
          color: #fff;
          padding: 12px 18px;
          border-radius: 999px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .auth-grid {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
          gap: 24px;
          align-items: stretch;
        }

        .hero-panel,
        .form-panel {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 32px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(18px);
          box-shadow: 0 20px 80px rgba(0,0,0,0.35);
        }

        .hero-panel {
          padding: 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 680px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 45%),
            radial-gradient(circle at top, var(--glow), transparent 55%),
            rgba(255,255,255,0.03);
        }

        .auth-kicker {
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.28em;
          font-size: 12px;
          margin-bottom: 18px;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 6vw, 92px);
          line-height: 0.9;
          margin: 0 0 20px;
          max-width: 8ch;
        }

        .hero-copy {
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          max-width: 34ch;
          font-size: 16px;
          margin-bottom: 28px;
        }

        .role-strip,
        .mode-strip {
          display: inline-flex;
          gap: 10px;
          padding: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 28px;
          width: fit-content;
        }

        .role-pill,
        .mode-pill {
          border: none;
          cursor: pointer;
          border-radius: 999px;
          transition: all 0.2s ease;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          background: transparent;
          color: rgba(255,255,255,0.7);
        }

        .role-pill {
          padding: 11px 16px;
        }

        .role-pill.active {
          background: var(--accent);
          color: #05050f;
        }

        .mode-pill {
          padding: 11px 18px;
          font-size: 13px;
          letter-spacing: 0.05em;
        }

        .mode-pill.active {
          background: rgba(255,255,255,0.95);
          color: #05050f;
        }

        .role-pill:not(.active):hover,
        .mode-pill:not(.active):hover,
        .home-link:hover {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.2);
        }

        .hero-card {
          border-radius: 24px;
          padding: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .hero-card-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .hero-metric {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .hero-metric strong {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          margin-bottom: 4px;
          color: var(--accent);
        }

        .hero-metric span {
          color: rgba(255,255,255,0.62);
          font-size: 13px;
          line-height: 1.5;
        }

        .form-panel {
          padding: 30px;
          position: relative;
          overflow: hidden;
        }

        .form-header {
          margin-bottom: 22px;
        }

        .form-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 68px);
          line-height: 0.95;
          margin: 6px 0 8px;
        }

        .form-header p,
        .auth-footer,
        .status-text,
        .field-hint {
          color: rgba(255,255,255,0.64);
        }

        .auth-form {
          display: grid;
          gap: 14px;
        }

        .input-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          display: grid;
          gap: 8px;
        }

        .field label {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.7);
        }

        .field input,
        .field select {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          color: #fff;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
        }

        .field input:focus,
        .field select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.03);
        }

        .field option { color: #05050f; }

        .field-hint {
          font-size: 12px;
          line-height: 1.4;
        }

        .status-box { min-height: 22px; }

        .status-text {
          font-size: 14px;
          line-height: 1.5;
        }

        .status-text.success { color: #98f5d3; }
        .status-text.error { color: #ffb0a1; }

        .submit-btn {
          border: none;
          border-radius: 18px;
          padding: 15px 18px;
          background: var(--accent);
          color: #05050f;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 18px 32px rgba(0,0,0,0.28);
        }

        .submit-btn:hover { transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.75; cursor: progress; }

        .auth-footer {
          margin-top: 18px;
          font-size: 14px;
          line-height: 1.7;
          text-align: center;
        }

        .auth-footer button {
          border: none;
          background: none;
          color: #fff;
          font: inherit;
          padding: 0;
          margin-left: 6px;
          cursor: pointer;
          text-decoration: underline;
        }

        @media (max-width: 960px) {
          .auth-grid {
            grid-template-columns: 1fr;
          }

          .hero-panel {
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .auth-shell { padding: 18px; }
          .auth-topbar { flex-direction: column; align-items: flex-start; }
          .form-panel,
          .hero-panel { padding: 22px; border-radius: 24px; }
          .input-grid,
          .hero-card-row { grid-template-columns: 1fr; }
          .role-strip,
          .mode-strip { width: 100%; justify-content: space-between; }
          .role-pill,
          .mode-pill { flex: 1; text-align: center; }
        }
      `}</style>

      <div className="auth-topbar">
        <div className="auth-brand">
          <strong>UBER</strong>
          <span>Express login and signup for riders and drivers</span>
        </div>
        <button className="home-link" type="button" onClick={() => navigate('/')}>Back to home</button>
      </div>

      <div className="auth-grid">
        <aside className="hero-panel">
          <div>
            <div className="auth-kicker">{theme.subtitle}</div>
            <h2 className="hero-title">{theme.title}</h2>
            <p className="hero-copy">{theme.copy}</p>

            <div className="role-strip" aria-label="Account type selector">
              <button
                type="button"
                className={`role-pill${role === 'user' ? ' active' : ''}`}
                onClick={() => setRole('user')}
              >
                User
              </button>
              <button
                type="button"
                className={`role-pill${role === 'captain' ? ' active' : ''}`}
                onClick={() => setRole('captain')}
              >
                Rider / Driver
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-row">
              <div className="hero-metric">
                <strong>JWT</strong>
                <span>Returns a token and sets the cookie used by the Express auth middleware.</span>
              </div>
              <div className="hero-metric">
                <strong>API</strong>
                <span>Posts to /api/users and /api/captains with the right body shape.</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="form-panel">
          <div className="form-header">
            <div className="auth-kicker">{mode === 'login' ? 'Welcome back' : 'Create your account'}</div>
            <h1>{mode === 'login' ? 'Sign in' : 'Sign up'}</h1>
            <p className="hero-copy" style={{ marginBottom: 0 }}>
              Use the same screen for both login and signup, then flip between user and driver auth flows.
            </p>
          </div>

          <div className="mode-strip" aria-label="Login or signup selector">
            <button
              type="button"
              className={`mode-pill${mode === 'login' ? ' active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`mode-pill${mode === 'signup' ? ' active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={role === 'user' ? 'John Doe' : 'Atlas Driver'}
                  required
                />
              </div>
            )}

            <div className="input-grid">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && role === 'user' && (
              <div className="field">
                <label htmlFor="role">Account role</label>
                <select id="role" name="role" value={form.role} onChange={handleChange}>
                  <option value="rider">Rider</option>
                  <option value="driver">Driver</option>
                </select>
                <div className="field-hint">The backend accepts only rider or driver for user registration.</div>
              </div>
            )}

            {mode === 'signup' && role === 'captain' && (
              <div className="input-grid">
                <div className="field">
                  <label htmlFor="vehicleType">Vehicle type</label>
                  <select id="vehicleType" name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="4"
                    required
                  />
                </div>
              </div>
            )}

            <div className="status-box">
              {status.message ? <div className={`status-text ${status.type}`}>{status.message}</div> : null}
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Switch to signup' : 'Switch to login'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}