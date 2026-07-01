import React from 'react';

export default function ReservationList({ 
  reservations, 
  tables, 
  searchQuery, 
  onSearchQueryChange, 
  statusFilter, 
  onStatusFilterChange, 
  onUpdateStatus, 
  onDeleteReservation,
  onOpenBookingForm 
}) {
  
  // Filtered reservations list
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.includes(searchQuery);
      
    const matchesStatus = statusFilter === 'todas' || res.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getTableLabel = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return 'Sin asignar';
    const loc = table.location === 'Salon' ? 'Salón' : 'Terraza';
    return `${table.name} (${loc})`;
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.filtersBar} className="glass-panel">
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por cliente, correo o celular..." 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="form-input"
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Estado:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="form-select"
            style={styles.filterSelect}
          >
            <option value="todas">Todas las reservas</option>
            <option value="pendiente">🟡 Pendientes</option>
            <option value="confirmada">🟢 Confirmadas</option>
            <option value="sentado">🔵 En mesa (Sentado)</option>
            <option value="cancelada">⚫ Canceladas</option>
          </select>
        </div>

        <button onClick={() => onOpenBookingForm(null)} className="btn btn-primary" style={styles.createBtn}>
          ➕ Crear Reserva
        </button>
      </div>

      <div className="glass-panel" style={styles.tablePanel}>
        <div style={styles.panelHeader}>
          <h3 style={styles.panelTitle}>Listado de Reservaciones</h3>
          <span style={styles.countLabel}>{filteredReservations.length} encontradas</span>
        </div>

        {filteredReservations.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📂</span>
            <p>No se encontraron reservaciones que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Personas</th>
                  <th style={styles.th}>Fecha & Hora</th>
                  <th style={styles.th}>Mesa Asignada</th>
                  <th style={styles.th}>Notas / Restricciones</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map(res => (
                  <tr key={res.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.clientCellName}>{res.clientName}</div>
                      <div style={styles.clientCellMeta}>{res.email}</div>
                      <div style={styles.clientCellMeta}>{res.phone}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.guestsBadge}>👥 {res.guests}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateText}>{res.date}</div>
                      <div style={styles.timeText}>🕗 {res.time} hrs</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.tableCellLabel}>{getTableLabel(res.tableId)}</span>
                    </td>
                    <td style={styles.td}>
                      {res.dietaryNotes !== 'Ninguna' && (
                        <span style={styles.dietBadge} title="Restricción alimentaria">
                          ⚠️ {res.dietaryNotes}
                        </span>
                      )}
                      {res.specialRequests && (
                        <div style={styles.notesText} title={res.specialRequests}>
                          {res.specialRequests}
                        </div>
                      )}
                      {res.dietaryNotes === 'Ninguna' && !res.specialRequests && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin notas</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span className={`badge badge-${res.status}`}>
                        {res.status === 'pendiente' && '🟡 Pendiente'}
                        {res.status === 'confirmada' && '🟢 Confirmada'}
                        {res.status === 'sentado' && '🔵 Sentado'}
                        {res.status === 'cancelada' && '⚫ Cancelada'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionsCell}>
                        {res.status === 'pendiente' && (
                          <button 
                            onClick={() => onUpdateStatus(res.id, 'confirmada')}
                            className="btn btn-secondary" 
                            style={styles.actionBtnSmall}
                            title="Confirmar Reserva"
                          >
                            ✅ Confirmar
                          </button>
                        )}
                        {res.status === 'confirmada' && (
                          <button 
                            onClick={() => onUpdateStatus(res.id, 'sentado')}
                            className="btn btn-secondary" 
                            style={{ ...styles.actionBtnSmall, borderColor: 'var(--color-seated)', color: 'var(--color-seated)' }}
                            title="Sentar comensales en mesa"
                          >
                            🛋️ Sentar
                          </button>
                        )}
                        {res.status !== 'cancelada' && res.status !== 'sentado' && (
                          <button 
                            onClick={() => onUpdateStatus(res.id, 'cancelada')}
                            className="btn btn-secondary" 
                            style={{ ...styles.actionBtnSmall, color: 'var(--color-occupied)' }}
                            title="Cancelar Reserva"
                          >
                            ❌ Cancelar
                          </button>
                        )}
                        <button 
                          onClick={() => onDeleteReservation(res.id)}
                          className="btn btn-danger" 
                          style={{ ...styles.actionBtnSmall, padding: '0.2rem 0.4rem' }}
                          title="Eliminar registro"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  filtersBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    minWidth: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '2.25rem',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  filterSelect: {
    minWidth: '180px',
  },
  createBtn: {
    padding: '0.75rem 1.5rem',
  },
  tablePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: '1.1rem',
    color: '#ffffff',
  },
  countLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    color: 'var(--text-muted)',
    gap: '1rem',
  },
  emptyIcon: {
    fontSize: '3rem',
  },
  tableResponsive: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.875rem',
  },
  th: {
    borderBottom: '1px solid var(--border-color)',
    padding: '0.75rem 1rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '1rem',
    verticalAlign: 'middle',
  },
  clientCellName: {
    fontWeight: '600',
    color: '#ffffff',
  },
  clientCellMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.1rem',
  },
  guestsBadge: {
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
  },
  dateText: {
    fontWeight: '500',
    color: '#ffffff',
  },
  timeText: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '600',
  },
  tableCellLabel: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  dietBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: 'var(--color-reserved)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '4px',
    padding: '0.15rem 0.4rem',
    fontSize: '0.7rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  notesText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    maxWidth: '220px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actionsCell: {
    display: 'flex',
    gap: '0.4rem',
  },
  actionBtnSmall: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.7rem',
    borderRadius: '4px',
  }
};
