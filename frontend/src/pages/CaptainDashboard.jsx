import React, { useState, useEffect, useRef } from 'react';

// ─── Mock socket shim (replace with real socket.io-client in production) ───────
const createMockSocket = () => {
  const listeners = {};
  return {
    emit: (event, data) => console.log('[socket.emit]', event, data),
    on: (event, cb) => { listeners[event] = cb; },
    off: (event) => { delete listeners[event]; },
    _trigger: (event, data) => listeners[event]?.(data),
  };
};
const socket = createMockSocket();

// ─── Simulate incoming ride request after 3s ──────────────────────────────────
setTimeout(() => {
  socket._trigger('new-ride-request', {
    rideId: 'RIDE_7823',
    pickup: 'Park Street Metro Gate 2',
    destination: 'Salt Lake Sector V, Infinity Benchmark',
    distance: '8.4',
    duration: '22',
    fare: 234,
    passengerName: 'Arjun Mehta',
    passengerRating: 4.8,
    passengerTrips: 142,
  });
}, 3000);

// ─── Stats Data ───────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Earnings Today', value: '₹1,840', sub: '+12% vs yesterday', up: true },
  { label: 'Trips Done', value: '11', sub: '3 more to daily goal', up: null },
  { label: 'Online Hours', value: '6h 14m', sub: 'Since 8:04 AM', up: null },
  { label: 'Rating', value: '4.93', sub: '★ Top 5% this week', up: true },
];

const TRIP_HISTORY = [
  { id: 'T-0091', from: 'Howrah Station', to: 'New Town Eco Park', fare: 310, time: '10:22 AM', status: 'completed' },
  { id: 'T-0090', from: 'Esplanade', to: 'Behala Chowrasta', fare: 185, time: '9:05 AM', status: 'completed' },
  { id: 'T-0089', from: 'Gariahat Market', to: 'Tollygunge Metro', fare: 98, time: '8:11 AM', status: 'cancelled' },
];

// ─── SVG Map Placeholder ──────────────────────────────────────────────────────
const MapPlaceholder = () => (
  <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,170,0.06)" strokeWidth="1"/>
      </pattern>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.08"/>
        <stop offset="100%" stopColor="#0A0F1E" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="400" fill="#0A0F1E"/>
    <rect width="800" height="400" fill="url(#grid)"/>
    <rect width="800" height="400" fill="url(#glow)"/>
    {/* Roads */}
    <path d="M 0 200 Q 200 180 400 200 Q 600 220 800 200" stroke="rgba(0,212,170,0.15)" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <path d="M 0 200 Q 200 180 400 200 Q 600 220 800 200" stroke="rgba(0,212,170,0.05)" strokeWidth="20" fill="none" strokeLinecap="round"/>
    <path d="M 300 0 Q 320 200 300 400" stroke="rgba(0,212,170,0.12)" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M 550 0 Q 530 200 550 400" stroke="rgba(0,212,170,0.08)" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M 100 0 Q 80 200 100 400" stroke="rgba(0,212,170,0.06)" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M 0 320 Q 400 290 800 320" stroke="rgba(0,212,170,0.07)" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M 0 80 Q 400 100 800 80" stroke="rgba(0,212,170,0.07)" strokeWidth="8" fill="none" strokeLinecap="round"/>
    {/* Location ping */}
    <circle cx="400" cy="200" r="28" fill="rgba(0,212,170,0.08)" className="ping-outer"/>
    <circle cx="400" cy="200" r="16" fill="rgba(0,212,170,0.15)"/>
    <circle cx="400" cy="200" r="8" fill="#00D4AA"/>
    <circle cx="400" cy="200" r="4" fill="#fff"/>
  </svg>
);

// ─── Circular Progress Ring ───────────────────────────────────────────────────
const RingTimer = ({ countdown, total = 15 }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = (countdown / total) * circ;
  const color = countdown > 8 ? '#00D4AA' : countdown > 4 ? '#FFB800' : '#FF3B30';
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"/>
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${progress} ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.9s linear, stroke 0.3s' }}
      />
      <text x="36" y="41" textAnchor="middle" fill={color} fontSize="15" fontWeight="700" fontFamily="'DM Mono', monospace">{countdown}s</text>
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CaptainDashboard({ captainId = 'CAP_001' }) {
  const [online, setOnline] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [accepted, setAccepted] = useState(false);
  const [ripple, setRipple] = useState(false);

  // Socket join + ride listener
  useEffect(() => {
    socket.emit('join', { userId: captainId, userType: 'captain' });
    socket.on('new-ride-request', (rideData) => {
      setActiveRequest(rideData);
      setCountdown(15);
      setAccepted(false);
    });
    return () => socket.off('new-ride-request');
  }, [captainId]);

  // Countdown timer
  useEffect(() => {
    if (!activeRequest || accepted) return;
    if (countdown === 0) { setActiveRequest(null); return; }
    const t = setTimeout(() => setCountdown(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, activeRequest, accepted]);

  const handleAccept = () => {
    socket.emit('accept-ride', { rideId: activeRequest?.rideId, captainId });
    setAccepted(true);
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  };

  const handleReject = () => setActiveRequest(null);

  const statusColor = countdown > 8 ? '#00D4AA' : countdown > 4 ? '#FFB800' : '#FF3B30';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #07080F; }

        .cap-root {
          font-family: 'DM Sans', sans-serif;
          background: #07080F;
          color: #E8EAF0;
          min-height: 100vh;
          display: grid;
          grid-template-rows: 64px 1fr;
          grid-template-columns: 280px 1fr;
          grid-template-areas: "nav nav" "sidebar main";
        }

        /* ── NAV ── */
        .cap-nav {
          grid-area: nav;
          background: rgba(10,15,30,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,212,170,0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          z-index: 100;
        }
        .nav-brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-brand-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00D4AA;
          box-shadow: 0 0 8px #00D4AA;
        }
        .nav-right { display: flex; align-items: center; gap: 20px; }
        .online-toggle {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 40px;
          padding: 6px 14px 6px 8px;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
        }
        .online-toggle:hover { background: rgba(255,255,255,0.08); }
        .toggle-pip {
          width: 36px; height: 20px;
          border-radius: 10px;
          background: #1A2030;
          border: 1px solid rgba(255,255,255,0.1);
          position: relative;
          transition: background 0.3s;
        }
        .toggle-pip.active { background: #00D4AA; border-color: #00D4AA; }
        .toggle-pip::after {
          content: '';
          position: absolute;
          top: 2px; left: 2px;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .toggle-pip.active::after { transform: translateX(16px); }
        .toggle-label {
          font-size: 13px;
          font-weight: 500;
          color: #aaa;
          font-family: 'DM Mono', monospace;
        }
        .toggle-label.active { color: #00D4AA; }
        .nav-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00D4AA 0%, #0099FF 100%);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px; color: #07080F;
          font-family: 'Syne', sans-serif;
          border: 2px solid rgba(0,212,170,0.3);
        }

        /* ── SIDEBAR ── */
        .cap-sidebar {
          grid-area: sidebar;
          background: rgba(10,15,30,0.7);
          border-right: 1px solid rgba(0,212,170,0.08);
          padding: 24px 20px;
          display: flex; flex-direction: column; gap: 8px;
          overflow-y: auto;
        }
        .sidebar-section-label {
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 12px 8px 4px;
        }
        .sidebar-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.45);
          border: 1px solid transparent;
          user-select: none;
        }
        .sidebar-item:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); }
        .sidebar-item.active {
          background: rgba(0,212,170,0.08);
          border-color: rgba(0,212,170,0.2);
          color: #00D4AA;
        }
        .sidebar-icon { font-size: 18px; width: 24px; text-align: center; }
        .sidebar-badge {
          margin-left: auto;
          background: #00D4AA;
          color: #07080F;
          font-size: 11px; font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          font-family: 'DM Mono', monospace;
        }

        /* Stats grid inside sidebar */
        .stats-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; margin-top: 8px;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px 12px;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700;
          color: #fff; letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .stat-sub {
          font-size: 11px;
          color: rgba(0,212,170,0.7);
          font-weight: 500;
        }

        /* ── MAIN AREA ── */
        .cap-main {
          grid-area: main;
          display: grid;
          grid-template-rows: 1fr auto;
          position: relative;
          overflow: hidden;
        }
        .map-area {
          position: relative;
          background: #0A0F1E;
          overflow: hidden;
        }
        .map-overlay-info {
          position: absolute; top: 20px; left: 20px;
          background: rgba(10,15,30,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,212,170,0.15);
          border-radius: 14px;
          padding: 14px 18px;
          z-index: 10;
        }
        .map-location-label {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: rgba(0,212,170,0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .map-location-value {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #fff;
        }
        .map-status-pill {
          position: absolute; top: 20px; right: 20px;
          display: flex; align-items: center; gap: 8px;
          background: rgba(10,15,30,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 40px;
          padding: 8px 16px;
          font-size: 13px; font-weight: 500;
          font-family: 'DM Mono', monospace;
          z-index: 10;
        }
        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #00D4AA;
          box-shadow: 0 0 6px #00D4AA;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        /* ── TRIP HISTORY PANEL ── */
        .trip-panel {
          background: rgba(10,15,30,0.95);
          border-top: 1px solid rgba(0,212,170,0.08);
          padding: 20px 24px;
          max-height: 220px;
          overflow-y: auto;
        }
        .trip-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .trip-panel-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 15px;
          color: #fff;
        }
        .trip-panel-see-all {
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: #00D4AA; cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .trip-row {
          display: flex; align-items: center; gap: 14px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.04);
          margin-bottom: 8px;
          background: rgba(255,255,255,0.02);
          transition: background 0.15s;
        }
        .trip-row:hover { background: rgba(255,255,255,0.04); }
        .trip-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(0,212,170,0.08);
          border: 1px solid rgba(0,212,170,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .trip-route { flex: 1; min-width: 0; }
        .trip-route-text {
          font-size: 13px; color: rgba(255,255,255,0.75);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .trip-time {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }
        .trip-fare {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 15px;
          color: #00D4AA; flex-shrink: 0;
        }
        .trip-status-chip {
          font-size: 10px; font-weight: 600;
          padding: 3px 8px; border-radius: 20px;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .trip-status-chip.completed {
          background: rgba(0,212,170,0.1);
          color: #00D4AA;
          border: 1px solid rgba(0,212,170,0.2);
        }
        .trip-status-chip.cancelled {
          background: rgba(255,59,48,0.1);
          color: #FF3B30;
          border: 1px solid rgba(255,59,48,0.2);
        }

        /* ── RIDE REQUEST DRAWER ── */
        .request-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 500;
          display: flex; align-items: flex-end; justify-content: center;
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }

        .request-drawer {
          width: 100%;
          max-width: 520px;
          background: #0D1220;
          border-top-left-radius: 28px;
          border-top-right-radius: 28px;
          padding: 28px 28px 36px;
          border: 1px solid rgba(0,212,170,0.15);
          border-bottom: none;
          box-shadow: 0 -20px 60px rgba(0,0,0,0.6);
          animation: slide-up 0.35s cubic-bezier(0.34,1.4,0.64,1);
          position: relative;
          overflow: hidden;
        }
        @keyframes slide-up {
          from { transform: translateY(120%) }
          to { transform: translateY(0) }
        }
        .drawer-glow {
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 200px; height: 120px;
          background: radial-gradient(circle, rgba(0,212,170,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .drawer-handle {
          width: 40px; height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.15);
          margin: 0 auto 24px;
        }
        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px;
        }
        .drawer-title-group {}
        .drawer-eyebrow {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: #00D4AA;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
        }
        .drawer-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #fff; letter-spacing: -0.5px;
        }

        /* Passenger pill */
        .passenger-pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 40px;
          padding: 8px 14px;
        }
        .passenger-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px; color: #fff;
          font-family: 'Syne', sans-serif;
        }
        .passenger-name { font-size: 13px; font-weight: 600; color: #fff; }
        .passenger-rating {
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: #FFB800;
        }

        /* Route card */
        .route-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 18px;
          position: relative;
        }
        .route-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 6px 0;
        }
        .route-icon-col {
          display: flex; flex-direction: column; align-items: center;
          padding-top: 3px;
        }
        .route-dot {
          width: 12px; height: 12px; border-radius: 50%;
          flex-shrink: 0;
        }
        .route-dot.pickup { background: #00D4AA; box-shadow: 0 0 8px rgba(0,212,170,0.5); }
        .route-dot.dropoff { background: #FF3B30; box-shadow: 0 0 8px rgba(255,59,48,0.5); }
        .route-line {
          width: 1px; height: 28px;
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 4px, transparent 4px, transparent 8px);
          margin: 4px 0;
        }
        .route-text-col {}
        .route-tag {
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 2px;
        }
        .route-addr {
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.85);
          line-height: 1.3;
        }

        /* Metrics strip */
        .metrics-strip {
          display: flex; gap: 1px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 22px;
        }
        .metric-cell {
          flex: 1; background: #111827;
          padding: 14px 12px; text-align: center;
        }
        .metric-cell + .metric-cell { border-left: 1px solid rgba(255,255,255,0.06); }
        .metric-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 20px; color: #fff;
          letter-spacing: -0.5px; line-height: 1;
          margin-bottom: 4px;
        }
        .metric-val.fare { color: #00D4AA; font-size: 24px; }
        .metric-label {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* CTA buttons */
        .cta-group { display: flex; gap: 12px; }
        .btn-decline {
          flex: 1;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          font-size: 15px; font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }
        .btn-decline:hover { background: rgba(255,59,48,0.08); border-color: rgba(255,59,48,0.3); color: #FF3B30; }

        .btn-accept {
          flex: 2.5;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #00D4AA 0%, #00B890 100%);
          color: #07080F;
          font-size: 16px; font-weight: 700;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.2px;
          transition: all 0.2s;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,212,170,0.25);
        }
        .btn-accept:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(0,212,170,0.35); }
        .btn-accept:active { transform: translateY(0); }
        .btn-accept.ripple::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.3);
          animation: ripple-out 0.6s ease-out;
        }
        @keyframes ripple-out { from { opacity: 1 } to { opacity: 0 } }

        /* Accepted state */
        .accepted-banner {
          text-align: center; padding: 20px;
        }
        .accepted-check {
          font-size: 40px; margin-bottom: 10px;
          display: block;
        }
        .accepted-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800; color: #00D4AA;
          margin-bottom: 6px;
        }
        .accepted-sub {
          font-size: 13px; color: rgba(255,255,255,0.4);
          font-family: 'DM Mono', monospace;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,170,0.2); border-radius: 2px; }
      `}</style>

      <div className="cap-root">

        {/* ── NAV ── */}
        <nav className="cap-nav">
          <div className="nav-brand">
            <div className="nav-brand-dot" />
            DRIVR <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>/ Captain</span>
          </div>
          <div className="nav-right">
            <div className="online-toggle" onClick={() => setOnline(o => !o)}>
              <div className={`toggle-pip ${online ? 'active' : ''}`} />
              <span className={`toggle-label ${online ? 'active' : ''}`}>
                {online ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="nav-avatar">AK</div>
          </div>
        </nav>

        {/* ── SIDEBAR ── */}
        <aside className="cap-sidebar">
          <div className="sidebar-section-label">Navigation</div>
          {[
            { icon: '🗺️', label: 'Live Map', active: true, badge: null },
            { icon: '🚗', label: 'My Trips', active: false, badge: '11' },
            { icon: '💰', label: 'Earnings', active: false, badge: null },
            { icon: '⭐', label: 'Ratings', active: false, badge: null },
          ].map(item => (
            <div key={item.label} className={`sidebar-item ${item.active ? 'active' : ''}`}>
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </div>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Today's Stats</div>
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Account</div>
          {[
            { icon: '👤', label: 'Profile' },
            { icon: '🔔', label: 'Notifications' },
            { icon: '⚙️', label: 'Settings' },
          ].map(item => (
            <div key={item.label} className="sidebar-item">
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── MAIN ── */}
        <main className="cap-main">
          {/* Map */}
          <div className="map-area">
            <MapPlaceholder />
            <div className="map-overlay-info">
              <div className="map-location-label">Current Location</div>
              <div className="map-location-value">Park Street, Kolkata</div>
            </div>
            {online && (
              <div className="map-status-pill">
                <div className="status-dot" />
                <span style={{ color: '#00D4AA', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
                  Searching for rides…
                </span>
              </div>
            )}
          </div>

          {/* Trip History */}
          <div className="trip-panel">
            <div className="trip-panel-header">
              <span className="trip-panel-title">Recent Trips</span>
              <span className="trip-panel-see-all">See all</span>
            </div>
            {TRIP_HISTORY.map(trip => (
              <div key={trip.id} className="trip-row">
                <div className="trip-icon">🚕</div>
                <div className="trip-route">
                  <div className="trip-route-text">{trip.from} → {trip.to}</div>
                  <div className="trip-time">{trip.time} · {trip.id}</div>
                </div>
                <span className={`trip-status-chip ${trip.status}`}>{trip.status}</span>
                <div className="trip-fare">₹{trip.fare}</div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── RIDE REQUEST DRAWER ── */}
      {activeRequest && (
        <div className="request-overlay">
          <div className="request-drawer">
            <div className="drawer-glow" />
            <div className="drawer-handle" />

            {accepted ? (
              <div className="accepted-banner">
                <span className="accepted-check">✅</span>
                <div className="accepted-title">Ride Accepted!</div>
                <div className="accepted-sub">Navigating to passenger pickup…</div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="drawer-header">
                  <div className="drawer-title-group">
                    <div className="drawer-eyebrow">New Request · {activeRequest.rideId}</div>
                    <div className="drawer-title">Ride Found!</div>
                  </div>
                  <RingTimer countdown={countdown} />
                </div>

                {/* Passenger */}
                <div className="passenger-pill" style={{ marginBottom: '18px' }}>
                  <div className="passenger-avatar">
                    {activeRequest.passengerName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div className="passenger-name">{activeRequest.passengerName || 'Passenger'}</div>
                    <div className="passenger-rating">★ {activeRequest.passengerRating} · {activeRequest.passengerTrips} trips</div>
                  </div>
                </div>

                {/* Route */}
                <div className="route-card">
                  <div className="route-item">
                    <div className="route-icon-col">
                      <div className="route-dot pickup" />
                      <div className="route-line" />
                    </div>
                    <div className="route-text-col">
                      <div className="route-tag">Pickup</div>
                      <div className="route-addr">{activeRequest.pickup}</div>
                    </div>
                  </div>
                  <div className="route-item" style={{ marginTop: '4px' }}>
                    <div className="route-icon-col">
                      <div className="route-dot dropoff" />
                    </div>
                    <div className="route-text-col">
                      <div className="route-tag">Drop-off</div>
                      <div className="route-addr">{activeRequest.destination}</div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="metrics-strip">
                  <div className="metric-cell">
                    <div className="metric-val">{activeRequest.distance}<span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}> km</span></div>
                    <div className="metric-label">Distance</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-val">{activeRequest.duration}<span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}> min</span></div>
                    <div className="metric-label">Est. Time</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-val fare">₹{activeRequest.fare}</div>
                    <div className="metric-label">Fare</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="cta-group">
                  <button className="btn-decline" onClick={handleReject}>Decline</button>
                  <button className={`btn-accept ${ripple ? 'ripple' : ''}`} onClick={handleAccept}>
                    Accept Ride →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}