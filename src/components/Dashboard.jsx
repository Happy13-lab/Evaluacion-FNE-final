import React from 'react';

export default function Dashboard({ reservations, tables, isTerraceClosed, onViewChange }) {
  // Calculations
  const todayStr = '2026-07-01'; // Simulated today
  const activeReservations = reservations.filter(r => r.date === todayStr && r.status !== 'cancelada');
  const totalReservations = activeReservations.length;
  
  const seatedReservations = reservations.filter(r => r.status === 'sentado');
  const pendingReservations = reservations.filter(r => r.status === 'pendiente');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmada');

  const totalGuests = activeReservations.reduce((acc, curr) => acc + curr.guests, 0);
  
  const freeTables = tables.filter(t => t.status === 'libre').length;
  const occupiedTables = tables.filter(t => t.status === 'ocupada').length;
  const reservedTables = tables.filter(t => t.status === 'reservada').length;
  const totalTables = tables.length;
  const occupancyPercentage = Math.round(((occupiedTables + reservedTables) / totalTables) * 100);

  // Get next 3 upcoming reservations (based on time)
  const upcomingReservations = [...reservations]
    .filter(r => r.status === 'confirmada' || r.status === 'pendiente')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  return (
    <div style={styles.container} className="fade-in">
      {/* Metric Cards Row */}
      <div style={styles.metricsRow}>
        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Ocupación de Mesas</span>
            <span style={styles.metricIcon}>🍽️</span>
          </div>
          <div style={styles.metricValue}>{occupancyPercentage}%</div>
          <div style={styles.metricSub}>
            {occupiedTables} En uso • {reservedTables} Reservadas
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBar, width: `${occupancyPercentage}%` }}></div>
          </div>
        </div>

        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Reservas del Día</span>
            <span style={styles.metricIcon}>📅</span>
          </div>
          <div style={styles.metricValue}>{totalReservations}</div>
          <div style={styles.metricSub}>
            {confirmedReservations.length} Confirmadas • {pendingReservations.length} Pendientes
          </div>
          <div style={styles.miniStats}>
            <span style={styles.dotConfirmed}>{confirmedReservations.length} Conf.</span>
            <span style={styles.dotPending}>{pendingReservations.length} Pend.</span>
            <span style={styles.dotSeated}>{seatedReservations.length} Sent.</span>
          </div>
        </div>

        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Comensales Totales</span>
            <span style={styles.metricIcon}>👥</span>
          </div>
          <div style={styles.metricValue}>{totalGuests}</div>
          <div style={styles.metricSub}>Cubiertos estimados para hoy</div>
          <div style={styles.guestsAverage}>
            Promedio: {totalReservations > 0 ? (totalGuests / totalReservations).toFixed(1) : 0} personas/mesa
          </div>
        </div>
      </div>

      {/* Warning if Terrace is Closed */}
      {isTerraceClosed && (
        <div style={styles.warningBanner} className="glass-panel">
          <span style={styles.warningIcon}>⚠️</span>
          <div style={styles.warningTextContainer}>
            <h4 style={styles.warningTitle}>Alerta de Capacidad: Terraza Deshabilitada</h4>
            <p style={styles.warningText}>
              Debido a las lluvias simulatedas, las mesas 9 a 12 de la terraza exterior no están disponibles. 
              Por favor reubique o cancele reservas asignadas a esas mesas.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Upcoming and Table Summary */}
      <div style={styles.grid}>
        {/* Upcoming Bookings */}
        <div className="glass-panel" style={styles.gridItemMain}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Próximas Reservas de Hoy</h3>
            <button onClick={() => onViewChange('reservations')} style={styles.linkBtn}>
              Ver todas &rarr;
            </button>
          </div>
          {upcomingReservations.length === 0 ? (
            <div style={styles.emptyState}>No hay reservas pendientes de arribo hoy.</div>
          ) : (
            <div style={styles.list}>
              {upcomingReservations.map(res => (
                <div key={res.id} style={styles.listItem}>
                  <div style={styles.listItemTime}>{res.time} hrs</div>
                  <div style={styles.listItemInfo}>
                    <div style={styles.clientName}>{res.clientName}</div>
                    <div style={styles.clientMeta}>
                      {res.guests} personas • Mesa {res.tableId} ({tables.find(t => t.id === res.tableId)?.location === 'Salon' ? 'Salón' : 'Terraza'})
                    </div>
                  </div>
                  <div>
                    <span className={`badge badge-${res.status}`}>
                      {res.status === 'confirmada' ? '🟢 Confirmada' : '🟡 Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Map Status Summary */}
        <div className="glass-panel" style={styles.gridItemSide}>
          <h3 style={styles.sectionTitle}>Distribución del Salón</h3>
          <div style={styles.tableStatusList}>
            <div style={styles.tableStatusItem}>
              <span style={{ ...styles.statusDot, backgroundColor: 'var(--color-free)' }}></span>
              <span style={styles.statusLabel}>Mesas Libres</span>
              <span style={styles.statusCount}>{freeTables}</span>
            </div>
            <div style={styles.tableStatusItem}>
              <span style={{ ...styles.statusDot, backgroundColor: 'var(--color-reserved)' }}></span>
              <span style={styles.statusLabel}>Mesas Reservadas</span>
              <span style={styles.statusCount}>{reservedTables}</span>
            </div>
            <div style={styles.tableStatusItem}>
              <span style={{ ...styles.statusDot, backgroundColor: 'var(--color-occupied)' }}></span>
              <span style={styles.statusLabel}>Mesas Ocupadas (Sentados)</span>
              <span style={styles.statusCount}>{occupiedTables}</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.totalRow}>
              <span>Capacidad Operativa</span>
              <span>
                {tables.filter(t => !(isTerraceClosed && t.location === 'Terraza')).length} / {totalTables} Mesas
              </span>
            </div>
          </div>
          <button 
            onClick={() => onViewChange('map')} 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Ver Mapa de Distribución
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  metricIcon: {
    fontSize: '1.25rem',
  },
  metricValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-title)',
  },
  metricSub: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '3px',
    marginTop: '0.5rem',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  miniStats: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  dotConfirmed: { color: 'var(--color-free)', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--color-free-bg)' },
  dotPending: { color: 'var(--color-reserved)', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--color-reserved-bg)' },
  dotSeated: { color: 'var(--color-seated)', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--color-seated-bg)' },
  guestsAverage: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '500',
    marginTop: '0.5rem',
  },
  warningBanner: {
    display: 'flex',
    gap: '1rem',
    borderLeft: '4px solid var(--color-occupied)',
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: '1.75rem',
  },
  warningTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  warningTitle: {
    color: 'var(--color-occupied)',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  warningText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
  },
  gridItemMain: {
    minHeight: '280px',
  },
  gridItemSide: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  emptyState: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '3rem 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(46, 125, 50, 0.02)',
    border: '1px solid rgba(46, 125, 50, 0.08)',
    borderRadius: '8px',
    gap: '1rem',
  },
  listItemTime: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--primary)',
    fontFamily: 'var(--font-title)',
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    minWidth: '65px',
    textAlign: 'center',
  },
  listItemInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  clientMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  tableStatusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    margin: '1.5rem 0',
  },
  tableStatusItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '0.75rem',
  },
  statusLabel: {
    flex: 1,
    color: 'var(--text-secondary)',
  },
  statusCount: {
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.5rem 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  }
};
