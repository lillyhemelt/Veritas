import React, { useState, useEffect } from 'react';
import { Shield, Lock, Activity, Cpu, Database, Radar, Terminal } from 'lucide-react';
import './index.css';
export default function App() {
  const [telemetry, setTelemetry] = useState({
    state: "IDLE", g_force: 0, drift_val: 0, history: Array(30).fill(0),
    raw_input: "SYSTEM_STANDBY...", consensus: "Ready.", is_locked: false, adjective_density: 0,
    source: "STANDBY", headline: "INITIALIZING..."
  });

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/telemetry.json');
        if (res.ok) setTelemetry(await res.json());
      } catch (e) {}
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* HEADER SECTION */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Shield color={telemetry.is_locked ? 'var(--neon-red)' : 'var(--neon-blue)'} size={28} />
          <h2 style={{ margin: 0, fontSize: '18px', letterSpacing: '4px' }}>VERITAS // MANGIONE CASE</h2>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--neon-blue)' }}>TRACE: ACTIVE // POLARITY: MONITORING</div>
      </header>

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="meter-label">ANALYSIS_STATE</div>
        <div className="meter-value" style={{ color: telemetry.is_locked ? 'var(--neon-red)' : 'var(--neon-blue)' }}>{telemetry.state}</div>
        
        <div className="meter-label" style={{ marginTop: '20px' }}>AGGREGATE_G_FORCE</div>
        <div className="meter-bg"><div className="meter-fill" style={{ width: `${(telemetry.g_force / 15) * 100}%`, backgroundColor: telemetry.is_locked ? 'var(--neon-red)' : 'var(--neon-blue)' }} /></div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
          <div className="meter-label"><Database size={10} /> METADATA</div>
          <div style={{ fontSize: '9px', color: '#475569' }}>DENSITY: {telemetry.adjective_density}%<br/>DRIFT: {telemetry.drift_val}</div>
        </div>
      </aside>

      {/* MAIN FEED */}
      <main className="main-feed">
        <div className="meter-label" style={{color: 'var(--neon-blue)', marginBottom: '15px'}}><Activity size={14} /> NARRATIVE_POLARITY_SWING</div>
        
        {/* CHART */}
        <div style={{ height: '150px', display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '30px', position: 'relative', borderBottom: '1px solid #111' }}>
          <div style={{ position: 'absolute', width: '100%', height: '1px', background: '#1e293b', top: '50%' }} />
          {telemetry.history?.map((point, i) => {
            // Amplification for visual "swing"
            const h = Math.max(Math.abs((point / 15) * 90), 3); // Min 3% height
            return (
              <div key={i} style={{ 
                flex: 1, 
                height: `${h}%`, 
                backgroundColor: point < 0 ? 'var(--neon-red)' : (point > 0 ? 'var(--neon-green)' : '#1e293b'),
                // This logic forces the bars to grow FROM the center line
                transform: point < 0 ? `translateY(${h/2}%)` : (point > 0 ? `translateY(-${h/2}%)` : 'none'),
                opacity: (i + 1) / 30,
                boxShadow: point !== 0 ? `0 0 10px ${point < 0 ? 'var(--neon-red)' : 'var(--neon-green)'}` : 'none',
                transition: 'all 0.3s ease-out'
              }} />
            );
          })}
        </div>

        {/* HEADLINE AND RAW INPUT */}
        <div style={{ marginBottom: '20px' }}>
          <div className="meter-label" style={{ marginBottom: '10px' }}>SOURCE: {telemetry.source}</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderLeft: '3px solid var(--neon-blue)' }}>
            <div style={{ fontSize: '10px', opacity: 0.5 }}>HEADLINE_RECON:</div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: telemetry.is_locked ? 'var(--neon-red)' : 'white' }}>{telemetry.headline}</div>
          </div>
          <p style={{ fontSize: '18px', marginTop: '15px', fontStyle: 'italic', opacity: 0.8 }}>"{telemetry.raw_input}"</p>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', position: 'relative' }}>
          <div className="meter-label" style={{color: 'var(--neon-green)'}}>CONSENSUS_RECONSTRUCTION</div>
          <p style={{ fontSize: '20px', color: 'var(--neon-green)', marginBottom: '0' }}>{telemetry.consensus}</p>
          
          {/* PERMANENT STAIN - Static version without glitching/shaking */}
          <div style={{ minHeight: '80px', marginTop: '20px' }}>
            {telemetry.is_locked && (
              <div style={{ 
                padding: '10px', 
                border: '2px solid var(--neon-red)', 
                backgroundColor: 'rgba(255, 0, 60, 0.1)',
                color: 'var(--neon-red)',
                fontWeight: '900',
                textAlign: 'center',
                letterSpacing: '2px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <Lock size={16} /> PERMANENT STAIN DETECTED // INTEGRITY COMPROMISED
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT BAR */}
      <aside className="right-bar">
        <div className="meter-label">GEO_RECON</div>
        <div style={{ margin: '15px 0', border: '1px solid #1e293b', height: '120px', background: '#000', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid #111', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '50%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--neon-green))', top: '50%', left: '50%', transformOrigin: 'left center', animation: 'radar-sweep 4s linear infinite' }} />
          <div className="radar-point" style={{ top: '30%', left: '40%' }} />
        </div>
        <div className="meter-label">SIGNAL_STRENGTH</div>
        <div style={{ fontSize: '10px', color: '#475569' }}>NY_HUB: 98%<br/>PA_HUB: 84%</div>
      </aside>

      <footer className="footer">
        <div>CORE: 2.0.4_SOVEREIGN</div>
        <div style={{ color: telemetry.is_locked ? 'var(--neon-red)' : 'var(--neon-blue)' }}>SYSTEM_STABLE</div>
        <div>{new Date().toLocaleTimeString()}</div>
      </footer>

      <style>{`
        @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blip { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .radar-point { position: absolute; width: 4px; height: 4px; background: var(--neon-green); border-radius: 50%; box-shadow: 0 0 10px var(--neon-green); animation: blip 2s infinite; }
      `}</style>
    </div>
  );
}