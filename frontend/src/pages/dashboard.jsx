import React, { useState, useEffect, useRef } from 'react';

const RIDE_OPTIONS = [
  {
    id: 'uberx',
    name: 'UberX',
    tag: 'Everyday',
    eta: '3 min',
    price: '₹89',
    seats: 4,
    color: '#00D4AA',
    icon: (
      <svg viewBox="0 0 64 28" fill="none" style={{width:'100%',height:'100%'}}>
        <ellipse cx="32" cy="25" rx="28" ry="3" fill="rgba(0,212,170,0.15)"/>
        <rect x="8" y="10" width="48" height="12" rx="5" fill="#1a1a2e"/>
        <path d="M14 10 Q20 2 32 2 Q44 2 50 10Z" fill="#16213e"/>
        <rect x="17" y="4" width="12" height="6" rx="2" fill="rgba(0,212,170,0.4)"/>
        <rect x="34" y="4" width="12" height="6" rx="2" fill="rgba(0,212,170,0.4)"/>
        <circle cx="18" cy="22" r="5" fill="#111" stroke="#00D4AA" strokeWidth="1.5"/>
        <circle cx="18" cy="22" r="2" fill="#333"/>
        <circle cx="46" cy="22" r="5" fill="#111" stroke="#00D4AA" strokeWidth="1.5"/>
        <circle cx="46" cy="22" r="2" fill="#333"/>
      </svg>
    ),
  },
  {
    id: 'premier',
    name: 'Premier',
    tag: 'Luxury',
    eta: '6 min',
    price: '₹189',
    seats: 4,
    color: '#FFD700',
    icon: (
      <svg viewBox="0 0 64 28" fill="none" style={{width:'100%',height:'100%'}}>
        <ellipse cx="32" cy="25" rx="28" ry="3" fill="rgba(255,215,0,0.15)"/>
        <rect x="6" y="11" width="52" height="11" rx="5" fill="#0d0d1a"/>
        <path d="M12 11 Q19 1 32 1 Q45 1 52 11Z" fill="#1a1a2e"/>
        <rect x="16" y="3" width="13" height="7" rx="2" fill="rgba(255,215,0,0.35)"/>
        <rect x="35" y="3" width="13" height="7" rx="2" fill="rgba(255,215,0,0.35)"/>
        <circle cx="17" cy="22" r="5" fill="#111" stroke="#FFD700" strokeWidth="1.5"/>
        <circle cx="17" cy="22" r="2" fill="#333"/>
        <circle cx="47" cy="22" r="5" fill="#111" stroke="#FFD700" strokeWidth="1.5"/>
        <circle cx="47" cy="22" r="2" fill="#333"/>
      </svg>
    ),
  },
  {
    id: 'suv',
    name: 'UberSUV',
    tag: 'Spacious',
    eta: '9 min',
    price: '₹299',
    seats: 6,
    color: '#FF6B35',
    icon: (
      <svg viewBox="0 0 64 28" fill="none" style={{width:'100%',height:'100%'}}>
        <ellipse cx="32" cy="25" rx="29" ry="3" fill="rgba(255,107,53,0.15)"/>
        <rect x="4" y="9" width="56" height="14" rx="5" fill="#0a0a1a"/>
        <path d="M10 9 Q18 0 32 0 Q46 0 54 9Z" fill="#13132a"/>
        <rect x="14" y="2" width="14" height="7" rx="2" fill="rgba(255,107,53,0.3)"/>
        <rect x="36" y="2" width="14" height="7" rx="2" fill="rgba(255,107,53,0.3)"/>
        <circle cx="15" cy="23" r="5" fill="#111" stroke="#FF6B35" strokeWidth="1.5"/>
        <circle cx="15" cy="23" r="2" fill="#333"/>
        <circle cx="49" cy="23" r="5" fill="#111" stroke="#FF6B35" strokeWidth="1.5"/>
        <circle cx="49" cy="23" r="2" fill="#333"/>
      </svg>
    ),
  },
  {
    id: 'auto',
    name: 'Auto',
    tag: 'Budget',
    eta: '2 min',
    price: '₹45',
    seats: 3,
    color: '#A855F7',
    icon: (
      <svg viewBox="0 0 64 28" fill="none" style={{width:'100%',height:'100%'}}>
        <ellipse cx="36" cy="25" rx="24" ry="3" fill="rgba(168,85,247,0.15)"/>
        <rect x="18" y="10" width="38" height="12" rx="5" fill="#0d0d1a"/>
        <path d="M22 10 Q27 2 46 2 Q54 2 56 10Z" fill="#1a1030"/>
        <rect x="26" y="4" width="22" height="6" rx="2" fill="rgba(168,85,247,0.3)"/>
        <circle cx="23" cy="22" r="5" fill="#111" stroke="#A855F7" strokeWidth="1.5"/>
        <circle cx="23" cy="22" r="2" fill="#333"/>
        <circle cx="49" cy="22" r="5" fill="#111" stroke="#A855F7" strokeWidth="1.5"/>
        <circle cx="49" cy="22" r="2" fill="#333"/>
        <path d="M18 14 Q8 14 7 19 L7 24 Q18 24 18 19Z" fill="#1a1030"/>
        <circle cx="9" cy="22" r="4" fill="#111" stroke="#A855F7" strokeWidth="1.5"/>
        <circle cx="9" cy="22" r="1.5" fill="#333"/>
      </svg>
    ),
  },
];

const QUICK_PLACES = [
  { icon: '🏠', label: 'Home', sub: 'Salt Lake, Sec V' },
  { icon: '💼', label: 'Work', sub: 'Park Street, CBD' },
  { icon: '🛍️', label: 'Forum Mall', sub: 'Elgin Rd' },
  { icon: '✈️', label: 'Airport', sub: 'CCU, Dum Dum' },
];

const RECENT = [
  { from: 'Salt Lake', to: 'New Town', time: '2 hrs ago', price: '₹134' },
  { from: 'Park Street', to: 'Howrah', time: 'Yesterday', price: '₹89' },
];

export default function Dashboard() {
  const [pickup, setPickup]           = useState('');
  const [destination, setDestination] = useState('');
  const [sheet, setSheet]             = useState('home'); // home | search | rides
  const [selectedRide, setSelectedRide] = useState('uberx');
  const [menuOpen, setMenuOpen]       = useState(false);
  const [time, setTime]               = useState(new Date());
  const [pickupFocus, setPickupFocus] = useState(false);
  const [destFocus, setDestFocus]     = useState(false);
  const destRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(iv);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearch = e => {
    e.preventDefault();
    if (pickup && destination) setSheet('rides');
  };

  const ride = RIDE_OPTIONS.find(r => r.id === selectedRide);

  return (
    <div style={{
      height: '100dvh', width: '100vw',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: '#0a0a14',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: 'DM Sans', sans-serif; }
        button { cursor: pointer; }

        .db-map {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 60% 30%, rgba(0,212,170,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 70%, rgba(168,85,247,0.06) 0%, transparent 50%),
            #0a0a14;
        }
        .db-map-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.22;
          filter: saturate(0.4) hue-rotate(160deg) brightness(0.5);
          mix-blend-mode: screen;
        }
        .db-map-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom,
            rgba(10,10,20,0.55) 0%,
            rgba(10,10,20,0.1) 40%,
            rgba(10,10,20,0.2) 60%,
            rgba(10,10,20,0.98) 100%);
        }

        /* Grid lines on map */
        .db-map-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,212,170,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,170,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Pulsing location pin */
        .db-pin {
          position: absolute;
          top: 38%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }
        .db-pin-pulse {
          position: absolute;
          width: 60px; height: 60px;
          top: -8px; left: -8px;
          border-radius: 50%;
          border: 2px solid rgba(0,212,170,0.4);
          animation: pinPulse 2.5s ease-out infinite;
        }
        .db-pin-pulse2 {
          animation-delay: 0.8s;
          border-color: rgba(0,212,170,0.2);
          width: 80px; height: 80px;
          top: -18px; left: -18px;
        }
        .db-pin-dot {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(0,212,170,0.15);
          border: 2px solid #00D4AA;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }
        .db-pin-center {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #00D4AA;
          box-shadow: 0 0 14px rgba(0,212,170,0.8);
        }
        @keyframes pinPulse {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* Floating road lines */
        .db-road {
          position: absolute;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
        }

        /* NAV */
        .db-nav {
          position: absolute; top: 0; left: 0; right: 0;
          z-index: 30;
          display: flex; align-items: center; justify-content: space-between;
          padding: 52px 20px 16px;
        }
        .db-menu-btn {
          width: 46px; height: 46px;
          border-radius: 14px;
          background: rgba(10,10,20,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          transition: all 0.25s;
        }
        .db-menu-btn:hover { background: rgba(30,30,50,0.9); }
        .db-time-badge {
          background: rgba(10,10,20,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border-radius: 12px;
          padding: 10px 16px;
          display: flex; flex-direction: column; align-items: flex-end;
        }
        .db-time-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 0.06em;
          color: #fff; line-height: 1;
        }
        .db-time-date {
          font-size: 10px; color: rgba(255,255,255,0.4);
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        /* BOTTOM SHEET */
        .db-sheet {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 20;
          border-radius: 28px 28px 0 0;
          background: rgba(8,8,18,0.96);
          border-top: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          box-shadow: 0 -20px 60px rgba(0,0,0,0.6);
          padding: 0 20px 40px;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .db-sheet-handle {
          width: 40px; height: 4px;
          background: rgba(255,255,255,0.12);
          border-radius: 2px;
          margin: 14px auto 0;
        }

        /* Greeting */
        .db-greeting {
          padding: 20px 0 6px;
        }
        .db-greeting-sub {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-bottom: 4px;
        }
        .db-greeting-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 0.04em;
          color: #fff; line-height: 1;
        }
        .db-greeting-name span { color: #00D4AA; }

        /* Search inputs */
        .db-search-wrap {
          position: relative;
          margin: 16px 0 14px;
        }
        .db-route-line {
          position: absolute;
          left: 21px;
          top: 36px;
          bottom: 36px;
          width: 2px;
          background: linear-gradient(to bottom, #00D4AA, rgba(255,255,255,0.3));
          border-radius: 1px;
          z-index: 0;
        }
        .db-input-row {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 14px 16px;
          position: relative; z-index: 1;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          margin-bottom: 8px;
        }
        .db-input-row.focused {
          border-color: #00D4AA;
          background: rgba(0,212,170,0.06);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
        }
        .db-input-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #00D4AA;
          margin-right: 14px; flex-shrink: 0;
          box-shadow: 0 0 8px rgba(0,212,170,0.6);
        }
        .db-input-sq {
          width: 10px; height: 10px; border-radius: 3px;
          background: #fff;
          margin-right: 14px; flex-shrink: 0;
        }
        .db-input {
          flex: 1;
          background: transparent;
          border: none; outline: none;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .db-input::placeholder { color: rgba(255,255,255,0.3); }
        .db-input-label {
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.25); margin-right: 10px; flex-shrink: 0;
        }

        /* Quick places */
        .db-quick-title {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 12px;
        }
        .db-quick-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin-bottom: 20px;
        }
        .db-quick-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 14px 8px;
          display: flex; flex-direction: column; align-items: center;
          gap: 8px;
          transition: all 0.22s;
          cursor: pointer;
        }
        .db-quick-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }
        .db-quick-icon {
          font-size: 22px; line-height: 1;
        }
        .db-quick-label {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.8);
          text-align: center;
        }
        .db-quick-sub {
          font-size: 9px; color: rgba(255,255,255,0.3);
          text-align: center; line-height: 1.3;
        }

        /* Recent */
        .db-recent-title {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 12px;
        }
        .db-recent-item {
          display: flex; align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .db-recent-item:hover { opacity: 0.7; }
        .db-recent-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          margin-right: 14px; flex-shrink: 0;
          font-size: 14px;
        }
        .db-recent-from { font-size: 13px; font-weight: 600; color: #fff; }
        .db-recent-to   { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 1px; }
        .db-recent-price { font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: rgba(255,255,255,0.5); margin-left: auto; }
        .db-recent-time  { font-size: 10px; color: rgba(255,255,255,0.28); margin-left: auto; text-align: right; }

        /* Search CTA */
        .db-search-btn {
          width: 100%;
          padding: 17px;
          border: none; border-radius: 16px;
          background: #fff;
          color: #080818;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: all 0.25s;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .db-search-btn:hover { background: #f0f0f0; transform: translateY(-1px); }
        .db-search-btn:active { transform: translateY(1px); }

        /* RIDES SHEET */
        .db-rides-header {
          padding: 20px 0 16px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .db-rides-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 0.04em; color: #fff;
        }
        .db-rides-route {
          font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px;
        }
        .db-back-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 8px 16px;
          color: rgba(255,255,255,0.7);
          font-family: 'Syne', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em;
          transition: all 0.2s;
        }
        .db-back-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .db-ride-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .db-ride-card {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.25s;
          position: relative; overflow: hidden;
        }
        .db-ride-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--card-accent), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .db-ride-card:hover { transform: translateX(4px); }
        .db-ride-card.selected {
          border-color: var(--card-accent);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 1px var(--card-accent), 0 8px 24px rgba(0,0,0,0.3);
        }
        .db-ride-card.selected::before { opacity: 0.06; }
        .db-ride-car-wrap {
          width: 64px; height: 28px; flex-shrink: 0; margin-right: 14px;
        }
        .db-ride-info { flex: 1; }
        .db-ride-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          color: #fff; letter-spacing: 0.02em;
        }
        .db-ride-meta {
          display: flex; gap: 10px; align-items: center; margin-top: 3px;
        }
        .db-ride-eta {
          font-size: 12px; color: rgba(255,255,255,0.45);
        }
        .db-ride-tag {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 2px 8px; border-radius: 99px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.4);
        }
        .db-ride-seats {
          font-size: 11px; color: rgba(255,255,255,0.3);
          display: flex; align-items: center; gap: 4px;
        }
        .db-ride-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px; letter-spacing: 0.04em;
          flex-shrink: 0;
          transition: color 0.3s;
        }
        .db-ride-card.selected .db-ride-price { color: var(--card-accent); }

        .db-confirm-btn {
          width: 100%;
          padding: 18px;
          border: none; border-radius: 18px;
          color: #080818;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
          display: flex; align-items: center; justify-content: center; gap: 12px;
          position: relative; overflow: hidden;
        }
        .db-confirm-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent 60%);
        }
        .db-confirm-btn:hover { transform: translateY(-2px); }
        .db-confirm-btn:active { transform: translateY(1px); }

        /* Menu drawer */
        .db-menu-drawer {
          position: absolute; inset: 0; z-index: 50;
          display: flex;
        }
        .db-menu-backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          animation: fadeIn 0.3s ease;
        }
        .db-menu-panel {
          position: relative; z-index: 1;
          width: 80%; max-width: 300px;
          background: rgba(8,8,18,0.98);
          border-right: 1px solid rgba(255,255,255,0.07);
          padding: 60px 28px 40px;
          display: flex; flex-direction: column;
          animation: slideInLeft 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }

        .db-menu-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px; letter-spacing: 0.06em;
          color: #fff; margin-bottom: 4px;
        }
        .db-menu-logo span { color: #00D4AA; }
        .db-menu-user {
          display: flex; align-items: center; gap: 14px;
          padding: 20px 0 28px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 28px;
        }
        .db-menu-avatar {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #00D4AA, #0094FF);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; color: #fff;
        }
        .db-menu-uname { font-weight: 700; font-size: 15px; color: #fff; }
        .db-menu-email { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .db-menu-links { display: flex; flex-direction: column; gap: 4px; }
        .db-menu-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 12px; border-radius: 14px;
          background: transparent; border: none;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          text-align: left;
          transition: all 0.2s;
        }
        .db-menu-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .db-menu-link-icon { font-size: 18px; }
        .db-menu-signout {
          margin-top: auto;
          display: flex; align-items: center; gap: 12px;
          padding: 14px 12px; border-radius: 14px;
          background: rgba(255,80,80,0.08);
          border: 1px solid rgba(255,80,80,0.12);
          color: #ff7070;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          width: 100%;
          transition: all 0.2s;
        }
        .db-menu-signout:hover { background: rgba(255,80,80,0.14); }

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* MAP */}
      <div className="db-map">
        <img
          className="db-map-img"
          src="https://simonpan.com/wp-content/themes/sp_portfolio/assets/uber-rider-app-map.jpg"
          alt="Map"
        />
        <div className="db-map-grid" />
        <div className="db-map-overlay" />

        {/* Decorative road lines */}
        {[
          {top:'20%',left:'10%',w:'60%',h:'2px',rot:'-8deg'},
          {top:'55%',left:'0%',w:'45%',h:'2px',rot:'12deg'},
          {top:'30%',left:'55%',w:'50%',h:'2px',rot:'-3deg'},
          {top:'10%',left:'30%',w:'2px',h:'35%',rot:'0deg'},
          {top:'15%',left:'70%',w:'2px',h:'40%',rot:'5deg'},
        ].map((r,i) => (
          <div key={i} className="db-road" style={{
            top:r.top, left:r.left,
            width:r.w, height:r.h,
            transform:`rotate(${r.rot})`,
          }} />
        ))}
      </div>

      {/* LOCATION PIN */}
      <div className="db-pin">
        <div className="db-pin-pulse" />
        <div className="db-pin-pulse db-pin-pulse2" />
        <div className="db-pin-dot">
          <div className="db-pin-center" />
        </div>
      </div>

      {/* NAVBAR */}
      <div className="db-nav">
        <button className="db-menu-btn" onClick={() => setMenuOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="16" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="db-time-badge">
          <div className="db-time-val">
            {time.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit', hour12:false})}
          </div>
          <div className="db-time-date">
            {time.toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short'})}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SHEET: HOME ── */}
      {sheet === 'home' && (
        <div className="db-sheet" style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom))' }}>
          <div className="db-sheet-handle" />

          <div className="db-greeting">
            <div className="db-greeting-sub">{greeting()},</div>
            <div className="db-greeting-name">Ready to <span>ride?</span></div>
          </div>

          {/* Search inputs */}
          <div className="db-search-wrap">
            <div className="db-route-line" />
            <div className={`db-input-row${pickupFocus ? ' focused' : ''}`}>
              <div className="db-input-dot" />
              <input
                className="db-input"
                placeholder="Add a pick-up location"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                onFocus={() => setPickupFocus(true)}
                onBlur={() => setPickupFocus(false)}
                onKeyDown={e => e.key === 'Enter' && destRef.current?.focus()}
              />
            </div>
            <div className={`db-input-row${destFocus ? ' focused' : ''}`} style={{marginBottom:0}}>
              <div className="db-input-sq" />
              <input
                ref={destRef}
                className="db-input"
                placeholder="Where to?"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                onFocus={() => setDestFocus(true)}
                onBlur={() => setDestFocus(false)}
              />
            </div>
          </div>

          {/* Quick places */}
          <div className="db-quick-title">Quick Select</div>
          <div className="db-quick-grid">
            {QUICK_PLACES.map((p, i) => (
              <div key={i} className="db-quick-item" onClick={() => setDestination(p.sub)}>
                <div className="db-quick-icon">{p.icon}</div>
                <div className="db-quick-label">{p.label}</div>
                <div className="db-quick-sub">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* Recent */}
          <div className="db-recent-title">Recent Trips</div>
          {RECENT.map((r, i) => (
            <div key={i} className="db-recent-item"
              onClick={() => { setPickup(r.from); setDestination(r.to); }}>
              <div className="db-recent-icon">🕐</div>
              <div>
                <div className="db-recent-from">{r.from} → {r.to}</div>
                <div className="db-recent-to">{r.time}</div>
              </div>
              <div style={{marginLeft:'auto', textAlign:'right'}}>
                <div className="db-recent-price">{r.price}</div>
                <div className="db-recent-to" style={{fontSize:10}}>{r.time}</div>
              </div>
            </div>
          ))}

          <div style={{height:16}} />
          <button
            className="db-search-btn"
            onClick={() => { if (pickup && destination) setSheet('rides'); else setSheet('rides'); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Search Rides
          </button>
        </div>
      )}

      {/* ── BOTTOM SHEET: RIDES ── */}
      {sheet === 'rides' && (
        <div className="db-sheet" style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom))' }}>
          <div className="db-sheet-handle" />
          <div className="db-rides-header">
            <div>
              <div className="db-rides-title">Choose a ride</div>
              <div className="db-rides-route">
                {pickup || 'Current location'} → {destination || 'Destination'}
              </div>
            </div>
            <button className="db-back-btn" onClick={() => setSheet('home')}>← Back</button>
          </div>

          <div className="db-ride-list">
            {RIDE_OPTIONS.map(r => (
              <div
                key={r.id}
                className={`db-ride-card${selectedRide === r.id ? ' selected' : ''}`}
                style={{ '--card-accent': r.color }}
                onClick={() => setSelectedRide(r.id)}
              >
                <div className="db-ride-car-wrap">{r.icon}</div>
                <div className="db-ride-info">
                  <div className="db-ride-name">{r.name}</div>
                  <div className="db-ride-meta">
                    <div className="db-ride-eta">⏱ {r.eta}</div>
                    <div className="db-ride-tag">{r.tag}</div>
                  </div>
                  <div className="db-ride-seats">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    {r.seats} seats
                  </div>
                </div>
                <div className="db-ride-price" style={{ color: selectedRide === r.id ? r.color : 'rgba(255,255,255,0.6)' }}>
                  {r.price}
                </div>
              </div>
            ))}
          </div>

          <button
            className="db-confirm-btn"
            style={{
              background: ride.color,
              boxShadow: `0 10px 30px rgba(${RIDE_OPTIONS.find(r=>r.id===selectedRide)?.color.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',')},0.4)`,
            }}
          >
            Confirm {ride.name} · {ride.price}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      )}

      {/* ── MENU DRAWER ── */}
      {menuOpen && (
        <div className="db-menu-drawer">
          <div className="db-menu-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="db-menu-panel">
            <div className="db-menu-logo">UB<span>E</span>R</div>
            <div className="db-menu-user">
              <div className="db-menu-avatar">R</div>
              <div>
                <div className="db-menu-uname">Rahul Sharma</div>
                <div className="db-menu-email">rahul@example.com</div>
              </div>
            </div>
            <div className="db-menu-links">
              {[
                ['🚗', 'My Trips'],
                ['💳', 'Payment'],
                ['⭐', 'Rewards'],
                ['🛡️', 'Safety'],
                ['⚙️', 'Settings'],
                ['❓', 'Help'],
              ].map(([icon, label]) => (
                <button key={label} className="db-menu-link">
                  <span className="db-menu-link-icon">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
            <button className="db-menu-signout">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}