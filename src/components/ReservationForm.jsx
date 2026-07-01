import React, { useState, useEffect } from 'react';

export default function ReservationForm({ tables, reservations, isTerraceClosed, preselectedTableId, onSubmit, onCancel }) {
  // Local state for form fields
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('2026-07-01');
  const [time, setTime] = useState('20:00');
  const [tableId, setTableId] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('Ninguna');
  const [specialRequests, setSpecialRequests] = useState('');

  // Suggestions and warnings
  const [tableWarning, setTableWarning] = useState('');
  const [tableSuggestions, setTableSuggestions] = useState([]);

  // Pre-fill table if selected from the map
  useEffect(() => {
    if (preselectedTableId) {
      setTableId(preselectedTableId.toString());
      const selectedTable = tables.find(t => t.id === preselectedTableId);
      if (selectedTable) {
        setGuests(selectedTable.capacity);
      }
    } else {
      setTableId('');
    }
  }, [preselectedTableId, tables]);

  // Update suggestions and warnings based on inputs
  useEffect(() => {
    if (!tableId) {
      setTableWarning('');
      // Suggest tables with matching capacity
      const suggestions = tables
        .filter(t => {
          // Keep active tables that can fit the guests
          const isTerraceBlocked = isTerraceClosed && t.location === 'Terraza';
          return t.capacity >= guests && t.status === 'libre' && !isTerraceBlocked;
        })
        .slice(0, 3);
      setTableSuggestions(suggestions);
      return;
    }

    const selectedTable = tables.find(t => t.id === parseInt(tableId));
    if (!selectedTable) return;

    let warningText = '';

    // Check 1: Capacity
    if (guests > selectedTable.capacity) {
      warningText = `⚠️ Advertencia: La ${selectedTable.name} tiene capacidad máxima de ${selectedTable.capacity} personas (Reserva para ${guests} personas).`;
    }

    // Check 2: Weather & Terrace
    if (isTerraceClosed && selectedTable.location === 'Terraza') {
      warningText = `⚠️ Alerta Crítica: La ${selectedTable.name} se ubica en Terraza, la cual se encuentra cerrada actualmente por mal clima.`;
    }

    // Check 3: Already reserved/occupied
    if (selectedTable.status !== 'libre' && selectedTable.id !== preselectedTableId) {
      warningText = `⚠️ Advertencia: La ${selectedTable.name} ya figura como "${selectedTable.status}" hoy. Se generará conflicto de mesas.`;
    }

    setTableWarning(warningText);

    // Calculate suggestions in case they want to change
    const suggestions = tables
      .filter(t => {
        const isTerraceBlocked = isTerraceClosed && t.location === 'Terraza';
        return t.capacity >= guests && t.status === 'libre' && !isTerraceBlocked && t.id !== parseInt(tableId);
      })
      .slice(0, 3);
    setTableSuggestions(suggestions);

  }, [tableId, guests, isTerraceClosed, tables, preselectedTableId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic verification
    if (!clientName.trim() || !phone.trim() || !tableId) {
      alert('Por favor complete los campos obligatorios: Nombre, Teléfono y Mesa.');
      return;
    }

    const newReservation = {
      clientName,
      email: email || 'sin.correo@email.com',
      phone,
      guests: parseInt(guests),
      date,
      time,
      tableId: parseInt(tableId),
      dietaryNotes,
      specialRequests: specialRequests.trim(),
    };

    onSubmit(newReservation);
  };

  return (
    <div style={styles.backdrop}>
      <div className="glass-panel" style={styles.modal} className="glass-panel fade-in">
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Nueva Reservación</h2>
          <button style={styles.closeBtn} onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            {/* Left Column: Client Details */}
            <div style={styles.column}>
              <h3 style={styles.subTitle}>Datos del Cliente</h3>
              
              <div className="form-group">
                <label className="form-label">Nombre del Cliente *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Juan Pérez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="Ej: juan.perez@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Celular / Teléfono *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ej: +56 9 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Restricciones Alimenticias</label>
                <select 
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  className="form-select"
                >
                  <option value="Ninguna">Ninguna</option>
                  <option value="Vegetariana">Vegetariana</option>
                  <option value="Vegano">Vegano</option>
                  <option value="Sin gluten (Celíaca)">Sin gluten (Celíaca)</option>
                  <option value="Alergia a mariscos">Alergia a mariscos</option>
                  <option value="Alergia a frutos secos">Alergia a frutos secos</option>
                  <option value="Sin lactosa">Sin lactosa</option>
                </select>
              </div>
            </div>

            {/* Right Column: Reservation details */}
            <div style={styles.column}>
              <h3 style={styles.subTitle}>Detalles de la Reserva</h3>

              <div style={styles.timeGuestsRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Comensales</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12"
                    required
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Hora</label>
                  <select 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-select"
                  >
                    <option value="12:30">12:30 hrs</option>
                    <option value="13:00">13:00 hrs</option>
                    <option value="13:30">13:30 hrs</option>
                    <option value="14:00">14:00 hrs</option>
                    <option value="19:00">19:00 hrs</option>
                    <option value="19:30">19:30 hrs</option>
                    <option value="20:00">20:00 hrs</option>
                    <option value="20:30">20:30 hrs</option>
                    <option value="21:00">21:00 hrs</option>
                    <option value="21:30">21:30 hrs</option>
                    <option value="22:00">22:00 hrs</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mesa Asignada *</label>
                <select 
                  required
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Seleccionar Mesa --</option>
                  {tables.map(t => {
                    const isTerraceBlocked = isTerraceClosed && t.location === 'Terraza';
                    return (
                      <option 
                        key={t.id} 
                        value={t.id}
                        disabled={isTerraceBlocked}
                      >
                        {t.name} (Capacidad: {t.capacity} - {t.location === 'Salon' ? 'Salón' : 'Terraza'}) {t.status !== 'libre' ? `[${t.status.toUpperCase()}]` : ''} {isTerraceBlocked ? '(BLOQUEADA)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Warning display */}
              {tableWarning && (
                <div style={styles.warningContainer}>
                  {tableWarning}
                </div>
              )}

              {/* Table suggestions */}
              {!tableWarning && tableSuggestions.length > 0 && (
                <div style={styles.suggestionsContainer}>
                  <div style={styles.suggestionTitle}>Mesas sugeridas libres para {guests} personas:</div>
                  <div style={styles.suggestionChips}>
                    {tableSuggestions.map(t => (
                      <button 
                        key={t.id} 
                        type="button" 
                        onClick={() => setTableId(t.id.toString())}
                        style={styles.suggestionChip}
                      >
                        {t.name} (Cap. {t.capacity})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Notas Especiales</label>
                <textarea 
                  placeholder="Ej: Aniversario, requiere silla de bebé, restricciones, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="form-textarea"
                  style={styles.textarea}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              💾 Registrar Reservación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backdropFilter: 'blur(6px)',
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-xl)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  modalTitle: {
    fontSize: '1.25rem',
    color: '#ffffff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formRow: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  column: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  subTitle: {
    fontSize: '0.95rem',
    color: 'var(--primary)',
    fontWeight: '600',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
    marginBottom: '0.75rem',
  },
  timeGuestsRow: {
    display: 'flex',
    gap: '1rem',
  },
  warningContainer: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    color: 'var(--color-occupied)',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1.3',
    margin: '0.25rem 0',
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    padding: '0.75rem',
    borderRadius: '6px',
    margin: '0.25rem 0',
  },
  suggestionTitle: {
    fontSize: '0.7rem',
    color: 'var(--color-free)',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  suggestionChips: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--color-free)',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    fontSize: '0.7rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  textarea: {
    resize: 'none',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1.25rem',
  },
  submitBtn: {
    minWidth: '180px',
  }
};
