import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const cars = [
  {
    name: "UberX",
    tag: "Everyday rides",
    price: "From ₹80",
    seats: 4,
    eta: "3 min",
    color: "#00D4AA",
    desc: "Affordable, everyday trips",
    svg: (
      <svg viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <ellipse cx="110" cy="80" rx="95" ry="8" fill="rgba(0,212,170,0.13)"/>
        <rect x="30" y="38" width="160" height="32" rx="12" fill="#1a1a2e"/>
        <path d="M55 38 Q65 12 110 12 Q155 12 165 38Z" fill="#16213e"/>
        <rect x="60" y="16" width="40" height="20" rx="5" fill="#0ff2" opacity="0.7"/>
        <rect x="108" y="16" width="40" height="20" rx="5" fill="#0ff2" opacity="0.7"/>
        <circle cx="65" cy="72" r="13" fill="#111" stroke="#00D4AA" strokeWidth="3"/>
        <circle cx="65" cy="72" r="6" fill="#333"/>
        <circle cx="155" cy="72" r="13" fill="#111" stroke="#00D4AA" strokeWidth="3"/>
        <circle cx="155" cy="72" r="6" fill="#333"/>
        <rect x="30" y="50" width="10" height="8" rx="2" fill="#00D4AA" opacity="0.8"/>
        <rect x="180" y="50" width="10" height="8" rx="2" fill="#ff4444" opacity="0.8"/>
        <line x1="30" y1="54" x2="10" y2="54" stroke="#ff9900" strokeWidth="2.5" strokeDasharray="5,3"/>
      </svg>
    ),
  },
  {
    name: "Uber Premier",
    tag: "Luxury comfort",
    price: "From ₹180",
    seats: 4,
    eta: "6 min",
    color: "#FFD700",
    desc: "Premium sedans, top-rated drivers",
    svg: (
      <svg viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <ellipse cx="110" cy="80" rx="95" ry="8" fill="rgba(255,215,0,0.13)"/>
        <rect x="20" y="40" width="180" height="30" rx="10" fill="#0d0d1a"/>
        <path d="M45 40 Q60 8 110 8 Q160 8 175 40Z" fill="#1a1a2e"/>
        <rect x="58" y="14" width="42" height="22" rx="5" fill="#0ff3" opacity="0.6"/>
        <rect x="110" y="14" width="42" height="22" rx="5" fill="#0ff3" opacity="0.6"/>
        <circle cx="58" cy="72" r="14" fill="#111" stroke="#FFD700" strokeWidth="3"/>
        <circle cx="58" cy="72" r="6" fill="#333"/>
        <circle cx="162" cy="72" r="14" fill="#111" stroke="#FFD700" strokeWidth="3"/>
        <circle cx="162" cy="72" r="6" fill="#333"/>
        <rect x="20" y="52" width="12" height="7" rx="2" fill="#FFD700" opacity="0.9"/>
        <rect x="188" y="52" width="12" height="7" rx="2" fill="#ff4444" opacity="0.8"/>
        <path d="M110 40 L110 8" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
      </svg>
    ),
  },
  {
    name: "Uber SUV",
    tag: "More space",
    price: "From ₹250",
    seats: 6,
    eta: "8 min",
    color: "#FF6B35",
    desc: "Spacious rides for groups",
    svg: (
      <svg viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <ellipse cx="110" cy="82" rx="98" ry="7" fill="rgba(255,107,53,0.13)"/>
        <rect x="15" y="35" width="190" height="38" rx="10" fill="#0a0a1a"/>
        <path d="M40 35 Q55 5 110 5 Q165 5 180 35Z" fill="#13132a"/>
        <rect x="52" y="10" width="44" height="22" rx="5" fill="#0ff2" opacity="0.5"/>
        <rect x="110" y="10" width="44" height="22" rx="5" fill="#0ff2" opacity="0.5"/>
        <circle cx="55" cy="75" r="14" fill="#111" stroke="#FF6B35" strokeWidth="3.5"/>
        <circle cx="55" cy="75" r="6" fill="#333"/>
        <circle cx="165" cy="75" r="14" fill="#111" stroke="#FF6B35" strokeWidth="3.5"/>
        <circle cx="165" cy="75" r="6" fill="#333"/>
        <rect x="15" y="48" width="14" height="9" rx="2" fill="#FF6B35" opacity="0.9"/>
        <rect x="191" y="48" width="14" height="9" rx="2" fill="#ff3333" opacity="0.8"/>
        <rect x="100" y="35" width="2" height="8" fill="#FF6B35" opacity="0.4"/>
      </svg>
    ),
  },
  {
    name: "Uber Auto",
    tag: "Budget rides",
    price: "From ₹30",
    seats: 3,
    eta: "2 min",
    color: "#A855F7",
    desc: "Quick & cheap rickshaw rides",
    svg: (
      <svg viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <ellipse cx="110" cy="80" rx="80" ry="7" fill="rgba(168,85,247,0.13)"/>
        <rect x="55" y="38" width="115" height="30" rx="10" fill="#0d0d1a"/>
        <path d="M70 38 Q80 10 145 10 Q165 10 170 38Z" fill="#1a1030"/>
        <rect x="80" y="14" width="75" height="21" rx="5" fill="#a855f733" opacity="0.8"/>
        <circle cx="75" cy="70" r="13" fill="#111" stroke="#A855F7" strokeWidth="3"/>
        <circle cx="75" cy="70" r="6" fill="#333"/>
        <circle cx="160" cy="70" r="13" fill="#111" stroke="#A855F7" strokeWidth="3"/>
        <circle cx="160" cy="70" r="6" fill="#333"/>
        <path d="M55 50 Q40 50 38 60 L38 70 Q55 70 55 60Z" fill="#1a1030"/>
        <circle cx="40" cy="68" r="11" fill="#111" stroke="#A855F7" strokeWidth="3"/>
        <circle cx="40" cy="68" r="5" fill="#333"/>
        <rect x="55" y="48" width="10" height="7" rx="2" fill="#A855F7" opacity="0.9"/>
      </svg>
    ),
  },
];

const WORDS = ["Go.", "Arrive.", "Explore.", "Ride.", "Move."];

export default function UberLanding() {
  const [introPhase, setIntroPhase] = useState(0); // 0=logo, 1=reveal, 2=done
  const [wordIdx, setWordIdx] = useState(0);
  const [activeCar, setActiveCar] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase(1), 1200);
    const t2 = setTimeout(() => setIntroPhase(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (introPhase < 2) return;
    const iv = setInterval(() => {
      setWordIdx(w => (w + 1) % WORDS.length);
    }, 1800);
    return () => clearInterval(iv);
  }, [introPhase]);

  useEffect(() => {
    const iv = setInterval(() => setActiveCar(c => (c + 1) % cars.length), 3200);
    return () => clearInterval(iv);
  }, []);

  const car = cars[activeCar];

  return (
    <div style={{
      fontFamily: "'Syne', 'Bebas Neue', sans-serif",
      background: "#05050f",
      minHeight: "100vh",
      overflow: introPhase < 2 ? "hidden" : "auto",
      color: "#fff",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .intro-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: #000;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.77,0,.18,1);
        }
        .intro-overlay.fade-out {
          opacity: 0;
          transform: scale(1.08);
          pointer-events: none;
        }
        .intro-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px,14vw,140px);
          letter-spacing: 0.04em;
          color: #fff;
          animation: logoIn 0.9s cubic-bezier(.22,1,.36,1) both;
        }
        .intro-bar {
          width: 0; height: 3px;
          background: linear-gradient(90deg, #00D4AA, #FFD700, #FF6B35, #A855F7);
          margin-top: 18px;
          border-radius: 2px;
          animation: barExpand 1.1s 0.5s cubic-bezier(.22,1,.36,1) forwards;
        }
        .intro-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px,2vw,18px);
          color: #888;
          margin-top: 14px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 0.7s 1.1s ease forwards;
        }

        @keyframes logoIn {
          from { opacity:0; transform: translateY(40px) scale(0.92); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes barExpand {
          from { width: 0; }
          to { width: min(340px, 70vw); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }

        .main-content {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .main-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 18px 5vw;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(5,5,15,0.85);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 0.04em;
          color: #fff;
        }
        .nav-links {
          display: flex; gap: 32px; align-items: center;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #aaa;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
          cursor: pointer;
          background: none; border: none;
        }
        .nav-link:hover { color: #fff; }
        .nav-btn {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 22px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: all 0.22s ease;
        }
        .nav-btn.login {
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.25);
        }
        .nav-btn.login:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .nav-btn.register {
          background: #fff;
          color: #000;
        }
        .nav-btn.register:hover {
          background: #e0e0e0;
          transform: scale(1.04);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 5vw 60px;
          position: relative;
          overflow: hidden;
        }
        .hero-left {
          flex: 1;
          z-index: 2;
          max-width: 580px;
        }
        .hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 10px;
          transition: color 0.5s ease;
        }
        .eyebrow-dot { width:6px; height:6px; border-radius:50%; background: var(--accent); }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 10vw, 130px);
          line-height: 0.92;
          margin-bottom: 28px;
          letter-spacing: 0.01em;
        }
        .word-cycle {
          display: inline-block;
          color: var(--accent);
          transition: color 0.5s ease;
          animation: wordFlip 0.4s ease both;
        }
        @keyframes wordFlip {
          0% { opacity:0; transform: translateY(18px) rotateX(-40deg); }
          100% { opacity:1; transform: translateY(0) rotateX(0); }
        }
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px, 2vw, 18px);
          color: #888;
          line-height: 1.7;
          margin-bottom: 40px;
          max-width: 420px;
          font-weight: 300;
        }
        .cta-row {
          display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
        }
        .cta-btn {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 16px 36px;
          border-radius: 60px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.07em;
          transition: all 0.25s ease;
          text-transform: uppercase;
        }
        .cta-primary {
          background: #fff;
          color: #000;
          box-shadow: 0 0 40px rgba(255,255,255,0.15);
        }
        .cta-primary:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 0 60px rgba(255,255,255,0.25);
        }
        .cta-secondary {
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.2);
        }
        .cta-secondary:hover {
          border-color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.05);
        }

        .hero-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          min-height: 420px;
        }

        .car-showcase {
          position: relative;
          width: 100%;
          max-width: 520px;
        }
        .car-glow {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
          opacity: 0.12;
          filter: blur(30px);
          transition: background 0.6s ease, opacity 0.6s;
          pointer-events: none;
        }
        .car-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px 30px 28px;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          transition: border-color 0.5s ease;
        }
        .car-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent) 0%, transparent 60%);
          opacity: 0.04;
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .car-card:hover::before { opacity: 0.08; }
        .car-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 5px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 20px;
          transition: color 0.5s, border-color 0.5s;
        }
        .car-svg-wrap {
          height: 100px;
          margin: 0 -10px 24px;
          animation: carSlide 0.6s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes carSlide {
          from { opacity:0; transform: translateX(30px); }
          to { opacity:1; transform: translateX(0); }
        }
        .car-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          color: #fff;
        }
        .car-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #666;
          margin-bottom: 20px;
        }
        .car-stats {
          display: flex; gap: 20px; margin-bottom: 24px;
        }
        .stat {
          display: flex; flex-direction: column; gap: 2px;
        }
        .stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: var(--accent);
          transition: color 0.5s;
        }
        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555;
        }
        .book-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--accent);
          color: #000;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .book-btn:hover { opacity:0.85; transform: scale(1.02); }

        .car-dots {
          display: flex; gap: 8px; justify-content: center; margin-top: 20px;
        }
        .car-dot {
          width: 28px; height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.15);
          cursor: pointer;
          transition: background 0.3s, width 0.3s;
          border: none;
        }
        .car-dot.active {
          background: var(--accent);
          width: 48px;
        }

        /* bg grid */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .bg-blob {
          position: fixed; border-radius: 50%; filter: blur(100px);
          pointer-events: none; z-index: 0;
        }
        .blob1 {
          width: 600px; height: 600px;
          background: var(--accent);
          opacity: 0.04;
          top: -150px; right: -100px;
          transition: background 0.7s ease;
        }
        .blob2 {
          width: 400px; height: 400px;
          background: #8844ff;
          opacity: 0.05;
          bottom: 100px; left: -100px;
        }

        .features {
          padding: 80px 5vw 100px;
          position: relative;
          z-index: 2;
        }
        .feat-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 6vw, 80px);
          text-align: center;
          margin-bottom: 60px;
          letter-spacing: 0.03em;
        }
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .feat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px 28px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .feat-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-4px);
        }
        .feat-icon {
          font-size: 32px; margin-bottom: 16px;
        }
        .feat-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .feat-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          font-weight: 300;
        }

        .bottom-cta {
          padding: 80px 5vw 100px;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .bottom-cta-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 8vw, 100px);
          line-height: 0.95;
          margin-bottom: 32px;
        }
        .bottom-cta-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: #666;
          margin-bottom: 40px;
          font-weight: 300;
        }

        .modal-bg {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal {
          background: #0e0e1e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 40px 36px;
          width: 360px;
          max-width: 90vw;
          animation: slideUp 0.35s cubic-bezier(.22,1,.36,1);
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(40px); }
          to { opacity:1; transform:translateY(0); }
        }
        .modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .modal-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #555;
          margin-bottom: 28px;
        }
        .modal-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #fff;
          margin-bottom: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .modal-input:focus { border-color: rgba(255,255,255,0.35); }
        .modal-submit {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #fff;
          color: #000;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s;
        }
        .modal-submit:hover { background: #e5e5e5; }
        .modal-close {
          position: absolute; top: 18px; right: 22px;
          background: none; border: none;
          color: #555; font-size: 22px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .modal-close:hover { color: #fff; }
        .modal-switch {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #555;
          text-align: center;
          margin-top: 18px;
        }
        .modal-switch span {
          color: #fff;
          cursor: pointer;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            padding: 100px 5vw 60px;
            text-align: center;
          }
          .hero-left { max-width: 100%; }
          .hero-eyebrow { justify-content: center; }
          .cta-row { justify-content: center; }
          .hero-right { width: 100%; }
          .car-showcase { max-width: 100%; }
          .nav-links { display: none; }
        }
      `}</style>

      {/* Intro overlay */}
      <div className={`intro-overlay${introPhase >= 2 ? " fade-out" : ""}`}>
        <div className="intro-logo">UBER</div>
        <div className="intro-bar" />
        <div className="intro-tagline">Your ride. Your rules.</div>
      </div>

      {/* BG */}
      <div className="bg-grid" />
      <div className="bg-blob blob1" style={{"--accent": car.color}} />
      <div className="bg-blob blob2" />

      {/* NAVBAR */}
      <nav>
        <div className="nav-logo">UBER</div>
        <div className="nav-links">
          <button className="nav-link">Ride</button>
          <button className="nav-link">Drive</button>
          <button className="nav-link">Business</button>
          <button className="nav-link">Safety</button>
        </div>
        <div style={{display:"flex", gap:10}}>
          <button className="nav-btn login" onClick={() => navigate('/auth?mode=login')}>Login</button>
          <button className="nav-btn register" onClick={() => navigate('/auth?mode=signup')}>Register</button>
        </div>
      </nav>

      {/* MAIN */}
      <div className={`main-content${introPhase >= 2 ? " visible" : ""}`}
           style={{"--accent": car.color}}>

        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Available in 700+ cities
            </div>
            <h1 className="hero-title">
              Request.<br />
              <span key={wordIdx} className="word-cycle">{WORDS[wordIdx]}</span>
            </h1>
            <p className="hero-sub">
              Get a ride in minutes. Or become a driver and earn on your schedule.
              Uber connects you to more possibilities.
            </p>
            <div className="cta-row">
              <button className="cta-btn cta-primary" onClick={() => navigate('/auth?mode=signup')}>
                Get Started
              </button>
              <button className="cta-btn cta-secondary" onClick={() => navigate('/auth?mode=login')}>
                Sign In
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="car-showcase">
              <div className="car-glow" style={{"--accent": car.color}} />
              <div className="car-card" style={{"--accent": car.color, borderColor: `${car.color}22`}}>
                <div className="car-badge">
                  <span style={{width:6,height:6,borderRadius:"50%",background:car.color,display:"inline-block"}} />
                  {car.tag}
                </div>
                <div className="car-svg-wrap" key={activeCar}>
                  {car.svg}
                </div>
                <div className="car-name">{car.name}</div>
                <div className="car-desc">{car.desc}</div>
                <div className="car-stats">
                  <div className="stat">
                    <div className="stat-val" style={{color: car.color}}>{car.price}</div>
                    <div className="stat-label">Starting</div>
                  </div>
                  <div className="stat">
                    <div className="stat-val" style={{color: car.color}}>{car.seats}</div>
                    <div className="stat-label">Seats</div>
                  </div>
                  <div className="stat">
                    <div className="stat-val" style={{color: car.color}}>{car.eta}</div>
                    <div className="stat-label">ETA</div>
                  </div>
                </div>
                <button className="book-btn" style={{background: car.color}}
                  onClick={() => navigate('/auth?mode=signup')}
                >
                </button>
              </div>
              <div className="car-dots">
                {cars.map((c, i) => (
                  <button
                    key={i}
                    className={`car-dot${activeCar === i ? " active" : ""}`}
                    style={activeCar === i ? {background: c.color} : {}}
                    onClick={() => setActiveCar(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2 className="feat-title">Why Uber?</h2>
          <div className="feat-grid">
            {[
              { icon: "⚡", name: "Instant Booking", text: "Request a ride and get picked up in minutes. Available 24/7, every day." },
              { icon: "🛡️", name: "Safety First", text: "Verified drivers, real-time GPS tracking, and in-app emergency features." },
              { icon: "💳", name: "Easy Payments", text: "Cash, UPI, cards — choose how you pay. Receipts sent automatically." },
              { icon: "🌍", name: "Ride Anywhere", text: "One app, 700+ cities worldwide. Your account travels with you." },
              { icon: "⭐", name: "Top-rated Drivers", text: "Community ratings ensure only the best drivers serve you every trip." },
              { icon: "♻️", name: "Green Rides", text: "UberGreen options and carbon offsets for a cleaner tomorrow." },
            ].map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-name">{f.name}</div>
                <div className="feat-text">{f.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bottom-cta">
          <h2 className="bottom-cta-title">
            Your city.<br />Your ride.
          </h2>
          <p className="bottom-cta-sub">Join millions who move smarter every day.</p>
          <button className="cta-btn cta-primary" onClick={() => navigate('/auth?mode=signup')}
            style={{fontSize:17, padding:"18px 52px"}}>
            Get Started Free
          </button>
        </section>
      </div>

     
    </div>
  );
}