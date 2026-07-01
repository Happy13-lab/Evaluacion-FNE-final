import React from 'react';

export default function Header({ currentView, onViewChange, isTerraceClosed, onToggleTerrace }) {
  return (
    <header style={styles.header} className="glass-panel">
      <div style={styles.brand}>
        <div style={styles.logoRing}>
          <img src="/logo.png" alt="Bistro Fusión Logo" style={styles.logoImg} />
        </div>
        <div>
          <h1 style={styles.title}>BISTRO FUSIÓN</h1>
          <span style={styles.subtitle}>TableFlow • Panel de Control</span>
        </div>
      </div>

      <nav style={styles.nav}>
        <button 
          onClick={() => onViewChange('dashboard')} 
          className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => onViewChange('reservations')} 
          className={`btn ${currentView === 'reservations' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📋 Reservas
        </button>
        <button 
          onClick={() => onViewChange('map')} 
          className={`btn ${currentView === 'map' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🗺️ Mapa de Mesas
        </button>
      </nav>

      <div style={styles.weatherWidget} className="glass-panel">
        <div style={styles.weatherInfo}>
          <span style={styles.weatherIcon}>{isTerraceClosed ? '🌧️' : '☀️'}</span>
          <div>
            <div style={styles.weatherLabel}>Clima en Santiago</div>
            <div style={styles.weatherState}>
              {isTerraceClosed ? '14°C • Lluvia (Terraza Cerrada)' : '22°C • Soleado (Terraza Activa)'}
            </div>
          </div>
        </div>
        <button 
          style={styles.toggleWeatherBtn}
          onClick={onToggleTerrace} 
          title="Simular cambio climático para probar restricciones de reserva"
        >
          🔄 Simular
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderRadius: '16px',
    margin: '1rem 2rem 0 2rem',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoRing: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  title: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    letterSpacing: '0.1em',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    display: 'block',
    marginTop: '-2px',
  },
  nav: {
    display: 'flex',
    gap: '0.75rem',
  },
  weatherWidget: {
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  weatherInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  weatherIcon: {
    fontSize: '1.5rem',
  },
  weatherLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  weatherState: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  toggleWeatherBtn: {
    background: 'rgba(46, 125, 50, 0.1)',
    border: '1px solid rgba(46, 125, 50, 0.2)',
    color: 'var(--primary)',
    borderRadius: '6px',
    padding: '0.25rem 0.5rem',
    fontSize: '0.7rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  }
};
