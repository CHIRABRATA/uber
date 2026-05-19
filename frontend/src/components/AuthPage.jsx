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
          background: #05050f;
          color: #fff;
          padding: 32px 5vw;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Abstract glowing orbs in the background */
        .auth-shell::before,
        .auth-shell::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        .auth-shell::before {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -10vw;
          background: var(--glow);
          opacity: 0.7;
          animation: floatOrb 12s ease-in-out infinite alternate;
        }

        .auth-shell::after {
          width: 500px;
          height: 500px;
          bottom: -150px;
          left: -10vw;
          background: rgba(255,255,255,0.03);
          animation: floatOrb 15s ease-in-out infinite alternate-reverse;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.05); }
          100% { transform: translate(20px, -30px) scale(0.95); }
        }

        /* Grid Background Pattern */
        .bg-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
        }

        .auth-topbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 40px;
        }

        .auth-brand {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .auth-brand strong {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px;
          letter-spacing: 0.08em;
          line-height: 1;
          color: #fff;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
        }

        .auth-brand span {
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: none;
        }
        @media(min-width: 768px) { .auth-brand span { display: block; } }

        .home-link {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          padding: 10px 20px;
          border-radius: 99px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.08em;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .home-link:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .auth-grid {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(320px, 1fr) minmax(360px, 1.1fr);
          gap: 32px;
          align-items: center;
          flex: 1;
        }

        /* Glass Panels */
        .hero-panel,
        .form-panel {
          position: relative;
          border-radius: 32px;
          background: rgba(10, 10, 20, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
        }

        .hero-panel {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 600px;
          background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
        }

        /* Shine reflection on panel */
        .form-panel::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
          transform: skewX(-20deg);
          animation: shine 8s infinite;
          pointer-events: none;
        }

        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        .auth-kicker {
          color: var(--accent);
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          font-weight: 700;
          font-size: 11px;
          margin-bottom: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .auth-kicker::before {
          content: '';
          display: block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 12px var(--accent);
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 7vw, 100px);
          line-height: 0.88;
          margin: 0 0 24px;
          letter-spacing: 0.02em;
          color: #fff;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .hero-copy {
          color: rgba(255,255,255,0.65);
          font-family: 'DM Sans', sans-serif;
          line-height: 1.8;
          font-size: 16px;
          margin-bottom: 32px;
          max-width: 400px;
        }

        /* Animated segmented controls */
        .segmented-control {
          display: inline-flex;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 99px;
          padding: 6px;
          margin-bottom: 32px;
          position: relative;
        }

        .segment-btn {
          position: relative;
          z-index: 2;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          padding: 12px 24px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border-radius: 99px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .segment-btn.active {
          color: #000;
        }
        
        .segment-btn:not(.active):hover {
          color: rgba(255,255,255,0.9);
        }

        .segment-bg {
          position: absolute;
          top: 6px; bottom: 6px;
          background: var(--accent);
          border-radius: 99px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }

        .form-panel {
          padding: 40px;
        }

        .form-header {
          margin-bottom: 36px;
        }

        .form-header h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 5vw, 64px);
          line-height: 1;
          margin: 0;
        }

        .auth-form {
          display: grid;
          gap: 20px;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media(min-width: 480px) {
          .input-grid.cols-2 { grid-template-columns: 1fr 1fr; }
        }

        .field {
          position: relative;
        }

        .field label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
          transition: color 0.3s;
        }

        .field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          color: rgba(255,255,255,0.3);
          transition: color 0.3s;
          pointer-events: none;
        }

        .field-input {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          color: #fff;
          padding: 16px 16px 16px 44px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
        }
        
        select.field-input {
          appearance: none;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .field-input:focus {
          background: rgba(0,0,0,0.4);
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.03);
        }

        .field-input:focus + .field-icon,
        .field-input:not(:placeholder-shown) + .field-icon {
          color: var(--accent);
        }

        .field-input:focus ~ label {
          color: var(--accent);
        }

        .status-box {
          min-height: 24px;
          margin-top: -4px;
        }

        .status-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 10px;
          display: inline-block;
          width: 100%;
        }

        .status-text.success { background: rgba(0, 212, 170, 0.1); color: #00D4AA; border: 1px solid rgba(0,212,170,0.2); }
        .status-text.error { background: rgba(255, 68, 68, 0.1); color: #ff6b6b; border: 1px solid rgba(255,68,68,0.2); }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 18px;
          background: var(--accent);
          color: #05050f;
          border: none;
          border-radius: 16px;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.1);
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.3), 0 0 20px var(--glow), inset 0 -2px 0 rgba(0,0,0,0.1);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        .submit-btn svg {
          transition: transform 0.3s;
        }
        .submit-btn:hover:not(:disabled) svg {
          transform: translateX(4px);
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }

        .auth-footer button {
          background: none;
          border: none;
          color: var(--accent);
          font-weight: 700;
          margin-left: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          transition: filter 0.3s;
        }
        .auth-footer button:hover {
          filter: brightness(1.2);
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .auth-grid { grid-template-columns: 1fr; }
          .hero-panel { min-height: auto; padding: 32px; }
          .hero-title { font-size: 48px; }
        }

        @media (max-width: 500px) {
          .auth-shell { padding: 20px; }
          .form-panel { padding: 24px; }
          .segment-btn { padding: 10px 16px; font-size: 13px; }
        }
      `}</style>
      
      <div className="bg-grid" />

      <header className="auth-topbar">
        <div className="auth-brand">
          <strong>UBER</strong>
          <span>Express Authenticaton</span>
        </div>
        <button className="home-link" onClick={() => navigate('/')}>Back Home</button>
      </header>

      <main className="auth-grid">
        {/* Left Hero Panel */}
        <section className="hero-panel">
          <div className="auth-kicker">{theme.subtitle}</div>
          <h1 className="hero-title">{theme.title}</h1>
          <p className="hero-copy">{theme.copy}</p>

          <div className="segmented-control" role="group" aria-label="Account Role">
            <div className="segment-bg" style={{ 
              left: role === 'user' ? '6px' : 'calc(50% + 3px)', 
              width: 'calc(50% - 9px)' 
            }} />
            <button 
              type="button" 
              className={`segment-btn ${role === 'user' ? 'active' : ''}`}
              style={{ width: '50%' }}
              onClick={() => setRole('user')}
            >
              Passenger
            </button>
            <button 
              type="button" 
              className={`segment-btn ${role === 'captain' ? 'active' : ''}`}
              style={{ width: '50%' }}
              onClick={() => setRole('captain')}
            >
              Captain
            </button>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="form-panel">
          <header className="form-header">
            <div className="segmented-control" style={{ marginBottom: '24px', transform: 'scale(0.9)', transformOrigin: 'left center' }}>
              <div className="segment-bg" style={{ 
                left: mode === 'login' ? '6px' : 'calc(50% + 3px)', 
                width: 'calc(50% - 9px)' 
              }} />
              <button 
                type="button" 
                className={`segment-btn ${mode === 'login' ? 'active' : ''}`}
                style={{ width: '50%' }}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                type="button" 
                className={`segment-btn ${mode === 'signup' ? 'active' : ''}`}
                style={{ width: '50%' }}
                onClick={() => setMode('signup')}
              >
                Register
              </button>
            </div>
            <h2>{mode === 'login' ? 'Welcome Back' : 'Get Started'}</h2>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <div className="field-input-wrap">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="field-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={role === 'user' ? 'e.g. John Doe' : 'e.g. Alex Driver'}
                    required
                  />
                  <div className="field-icon"><IconUser /></div>
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <div className="field-input-wrap">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="field-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
                <div className="field-icon"><IconMail /></div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field-input-wrap">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="field-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Required 6+ characters"
                  minLength="6"
                  required
                />
                <div className="field-icon"><IconLock /></div>
              </div>
            </div>

            {mode === 'signup' && role === 'user' && (
              <div className="field">
                <label htmlFor="role">Account Role</label>
                <div className="field-input-wrap">
                  <select id="role" name="role" className="field-input" value={form.role} onChange={handleChange}>
                    <option value="rider">Rider</option>
                    <option value="driver">Driver</option>
                  </select>
                  <div className="field-icon"><IconUsers /></div>
                </div>
              </div>
            )}

            {mode === 'signup' && role === 'captain' && (
              <div className="input-grid cols-2">
                <div className="field">
                  <label htmlFor="vehicleType">Vehicle</label>
                  <div className="field-input-wrap">
                    <select id="vehicleType" name="vehicleType" className="field-input" value={form.vehicleType} onChange={handleChange}>
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="bicycle">Bicycle</option>
                    </select>
                    <div className="field-icon"><IconCar /></div>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="capacity">Capacity</label>
                  <div className="field-input-wrap">
                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      className="field-input"
                      value={form.capacity}
                      onChange={handleChange}
                      placeholder="e.g. 4"
                      required
                    />
                    <div className="field-icon"><IconUsers /></div>
                  </div>
                </div>
              </div>
            )}

            <div className="status-box">
              {status.message && (
                <div className={`status-text ${status.type}`}>{status.message}</div>
              )}
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? 'Processing...' : mode === 'login' ? 'Continue' : 'Create Account'}
              {!loading && <IconArrowRight />}
            </button>
          </form>

          <footer className="auth-footer">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}