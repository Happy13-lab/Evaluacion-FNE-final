import React from 'react';

export default function TableLayout({ tables, reservations, isTerraceClosed, onTableAction, onSelectTableForBooking }) {
  const salonTables = tables.filter(t => t.location === 'Salon');
  const terraceTables = tables.filter(t => t.location === 'Terraza');

  // Helper to find reservation associated with a table
  const getTableReservation = (tableId) => {
    return reservations.find(r => r.tableId === tableId && (r.status === 'confirmada' || r.status === 'sentado'));
  };

  const renderTable = (table, isZoneDisabled) => {
    const activeRes = getTableReservation(table.id);
    const isDisabled = isZoneDisabled;
    
    // Status style mapping
    let borderStyle = '1px solid var(--border-color)';
    let statusLabel = 'Libre';
    let statusClass = 'badge-free';
    
    if (isDisabled) {
      statusLabel = 'Bloqueada';
      statusClass = 'badge-cancelled';
    } else if (table.status === 'ocupada') {
      statusLabel = 'Ocupada';
      statusClass = 'badge-occupied';
      borderStyle = '1px solid var(--color-occupied)';
    } else if (table.status === 'reservada') {
      statusLabel = 'Reservada';
      statusClass = 'badge-reserved';
      borderStyle = '1px solid var(--color-reserved)';
    }

    return (
      <div 
        key={table.id} 
        style={{
          ...styles.tableCard,
          border: borderStyle,
          opacity: isDisabled ? 0.4 : 1,
          pointerEvents: isDisabled ? 'none' : 'auto'
        }}
        className="glass-panel"
      >
        <div style={styles.tableHeader}>
          <span style={styles.tableName}>{table.name}</span>
          <span className={`badge ${statusClass}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
            {statusLabel}
          </span>
        </div>

        {/* Dynamic Table Shape Visual */}
        <div style={styles.tableShapeContainer}>
          <div 
            style={{
              ...styles.tableDisk,
              backgroundColor: isDisabled 
                ? 'var(--bg-primary)' 
                : table.status === 'ocupada' 
                  ? 'var(--color-occupied-bg)' 
                  : table.status === 'reservada' 
                    ? 'var(--color-reserved-bg)' 
                    : 'var(--color-free-bg)',
              borderColor: isDisabled 
                ? 'var(--text-muted)' 
                : table.status === 'ocupada' 
                  ? 'var(--color-occupied)' 
                  : table.status === 'reservada' 
                    ? 'var(--color-reserved)' 
                    : 'var(--color-free)',
              borderRadius: table.capacity >= 6 ? '12px' : '50%'
            }}
          >
            <span style={styles.tableCapacity}>👥 {table.capacity}</span>
          </div>
        </div>

        {/* Dynamic details based on status */}
        <div style={styles.tableBody}>
          {isDisabled ? (
            <div style={styles.statusTextMuted}>Fuera de servicio</div>
          ) : table.status === 'libre' ? (
            <div style={styles.tableDetails}>
              <div style={styles.statusTextFree}>Disponible</div>
              <button 
                onClick={() => onSelectTableForBooking(table.id)}
                className="btn btn-primary" 
                style={styles.quickActionBtn}
              >
                ➕ Reservar
              </button>
            </div>
          ) : activeRes ? (
            <div style={styles.tableDetails}>
              <div style={styles.clientName}>{activeRes.clientName}</div>
              <div style={styles.clientTime}>🕗 {activeRes.time} hrs • {activeRes.guests} pers.</div>
              <div style={styles.actionRow}>
                {table.status === 'reservada' && (
                  <button 
                    onClick={() => onTableAction(table.id, 'seat')}
                    className="btn btn-secondary" 
                    style={{ ...styles.quickActionBtn, borderColor: 'var(--color-seated)', color: 'var(--color-seated)' }}
                  >
                    🛋️ Sentar
                  </button>
                )}
                <button 
                  onClick={() => onTableAction(table.id, 'free')}
                  className="btn btn-danger" 
                  style={styles.quickActionBtn}
                >
                  🧹 Liberar
                </button>
              </div>
            </div>
          ) : (
            // Fallback if table status is reserved/occupied but reservation mock is missing
            <div style={styles.tableDetails}>
              <div style={styles.clientName}>Reserva Activa</div>
              <button 
                onClick={() => onTableAction(table.id, 'free')}
                className="btn btn-danger" 
                style={styles.quickActionBtn}
              >
                🧹 Liberar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.topLegend} className="glass-panel">
        <h3 style={styles.legendTitle}>Estado de Mesas</h3>
        <div style={styles.legendItems}>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: 'var(--color-free)' }}></span> Libre</span>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: 'var(--color-reserved)' }}></span> Reservada</span>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: 'var(--color-occupied)' }}></span> Ocupada</span>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: 'var(--text-muted)' }}></span> Bloqueada por Clima</span>
        </div>
      </div>

      <div style={styles.zonesGrid}>
        {/* Salon Principal */}
        <div className="glass-panel" style={styles.zonePanel}>
          <h3 style={styles.zoneTitle}>🛋️ Salón Principal</h3>
          <p style={styles.zoneDesc}>Capacidad climatizada y música ambiental</p>
          <div style={styles.grid}>
            {salonTables.map(t => renderTable(t, false))}
          </div>
        </div>

        {/* Terraza Exterior */}
        <div className="glass-panel" style={{ ...styles.zonePanel, position: 'relative' }}>
          <h3 style={styles.zoneTitle}>🌿 Terraza Exterior</h3>
          <p style={styles.zoneDesc}>Área abierta y ventilada</p>
          
          {isTerraceClosed && (
            <div style={styles.overlay}>
              <div style={styles.overlayCard} className="glass-panel">
                <span style={styles.overlayIcon}>🌧️</span>
                <h4>Terraza Inhabilitada</h4>
                <p>Cerrada por condiciones climáticas adversas.</p>
              </div>
            </div>
          )}

          <div style={styles.grid}>
            {terraceTables.map(t => renderTable(t, isTerraceClosed))}
          </div>
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
  topLegend: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  legendTitle: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  legendItems: {
    display: 'flex',
    gap: '1.5rem',
  },
  legendItem: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  zonesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
  },
  zonePanel: {
    minHeight: '400px',
  },
  zoneTitle: {
    fontSize: '1.2rem',
    color: 'var(--text-primary)',
    fontWeight: '700',
  },
  zoneDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  tableCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
    height: '220px',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  tableShapeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0.5rem 0',
  },
  tableDisk: {
    width: '60px',
    height: '60px',
    border: '2px dashed var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  tableCapacity: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  tableBody: {
    minHeight: '65px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tableDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.35rem',
    width: '100%',
  },
  statusTextFree: {
    fontSize: '0.75rem',
    color: 'var(--color-free)',
    fontWeight: '500',
  },
  statusTextMuted: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  clientName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  clientTime: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  actionRow: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
    justifyContent: 'center',
  },
  quickActionBtn: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.7rem',
    borderRadius: '4px',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(242, 247, 244, 0.88)',
    borderRadius: '16px',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(6px)',
  },
  overlayCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '1.5rem',
    maxWidth: '280px',
    gap: '0.5rem',
    border: '1px solid rgba(211, 47, 47, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  overlayIcon: {
    fontSize: '2rem',
  }
};
// Media queries are handled responsively in zonesGrid and grid columns
