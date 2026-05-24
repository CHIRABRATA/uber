import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Point this to your backend server URL

export default function CaptainPanel({ captainId }) {
  const [activeRequest, setActiveRequest] = useState(null);
  const [countdown, setCountdown] = useState(15);

  // 1. Listen for socket connections and register driver
  useEffect(() => {
    socket.emit('join', { userId: captainId, userType: 'captain' });

    socket.on('new-ride-request', (rideData) => {
      setActiveRequest(rideData);
      setCountdown(15); // Reset the timer back to 15 seconds
    });

    return () => {
      socket.off('new-ride-request');
    };
  }, [captainId]);

  // 2. The 15-Second Countdown Logic
  useEffect(() => {
    if (!activeRequest) return;

    if (countdown === 0) {
      // Time run out! Auto reject/dismiss the ride
      setActiveRequest(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, activeRequest]);

  // 3. Handle Driver Actions
  const handleAccept = () => {
    // Send acceptance event to backend
    socket.emit('accept-ride', { rideId: activeRequest.rideId, captainId });
    setActiveRequest(null); // Close layout modal
    // Redirect driver to trip navigation panel...
  };

  const handleReject = () => {
    setActiveRequest(null); // Dismiss request immediately
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#222' }}>
      <h1>Captain Map view / Navigation screen active</h1>

      {/* RIDE REQUEST POPUP DRAWER */}
      {activeRequest && (
        <div style={styles.modalOverlay}>
          <div style={styles.popupCard}>
            
            {/* Pulsing Timer UI Head */}
            <div style={styles.timerHeader}>
              <span>New Ride Request Found!</span>
              <div style={styles.timerCircle}>{countdown}s</div>
            </div>

            <div style={styles.tripDetails}>
              <div style={styles.detailRow}><strong>📍 Pickup:</strong> {activeRequest.pickup}</div>
              <div style={styles.detailRow}><strong>🏁 Destination:</strong> {activeRequest.destination}</div>
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <div style={styles.metaRow}>
                <div>📏 {activeRequest.distance} km</div>
                <div>⏱ {activeRequest.duration} min</div>
                <div style={styles.fareAmt}>₹{activeRequest.fare}</div>
              </div>
            </div>

            {/* Response CTA Controls */}
            <div style={styles.btnGroup}>
              <button onClick={handleReject} style={styles.rejectBtn}>Decline</button>
              <button onClick={handleAccept} style={styles.acceptBtn}>Accept Ride</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Inline minimalist dark mode styles for quick prototyping
const styles = {
  modalOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 9999 },
  popupCard: { width: '100%', maxWidth: '450px', background: '#121212', color: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', boxShadow: '0 -10px 30px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' },
  timerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
  timerCircle: { width: '40px', height: '40px', borderRadius: '50%', background: '#FF3B30', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' },
  tripDetails: { background: '#1A1A1A', padding: '16px', borderRadius: '12px', marginBottom: '20px' },
  detailRow: { margin: '8px 0', fontSize: '15px', color: '#ccc' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', color: '#aaa' },
  fareAmt: { fontSize: '22px', fontWeight: 'bold', color: '#00D4AA' },
  btnGroup: { display: 'flex', gap: '12px' },
  rejectBtn: { flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#262626', color: '#fff', fontSize: '16px', cursor: 'pointer', fontWeight: '600' },
  acceptBtn: { flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#00D4AA', color: '#000', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }
};