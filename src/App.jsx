import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TableLayout from './components/TableLayout';
import ReservationList from './components/ReservationList';
import ReservationForm from './components/ReservationForm';
import { INITIAL_TABLES } from './data/mockTables';
import { INITIAL_RESERVATIONS } from './data/mockReservations';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [isTerraceClosed, setIsTerraceClosed] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [preselectedTableId, setPreselectedTableId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');

  // Toggle Terrace (weather simulation)
  const handleToggleTerrace = () => {
    setIsTerraceClosed(prev => {
      const nextState = !prev;
      if (nextState) {
        // If terrace is closed, we alert user and count affected reservations
        const affectedCount = reservations.filter(
          r => r.status !== 'cancelada' && 
          tables.find(t => t.id === r.tableId)?.location === 'Terraza'
        ).length;
        
        if (affectedCount > 0) {
          alert(`🌧️ Clima cambiado a Lluvia: Hay ${affectedCount} reservaciones activas asignadas a la terraza exterior que requieren atención.`);
        }
      }
      return nextState;
    });
  };

  // Select a table directly from the floor map to book
  const handleSelectTableForBooking = (tableId) => {
    setPreselectedTableId(tableId);
    setIsBookingFormOpen(true);
  };

  // Open booking form without preselected table
  const handleOpenBookingForm = () => {
    setPreselectedTableId(null);
    setIsBookingFormOpen(true);
  };

  // Create new reservation
  const handleCreateReservation = (newResData) => {
    const newResId = `res-${Date.now()}`;
    const newReservation = {
      id: newResId,
      ...newResData,
      status: 'confirmada' // Defaults to confirmed on creation
    };

    // Add to reservations list
    setReservations(prev => [newReservation, ...prev]);

    // Update table status
    setTables(prevTables => 
      prevTables.map(t => 
        t.id === newReservation.tableId 
          ? { ...t, status: 'reservada', currentReservationId: newResId }
          : t
      )
    );

    setIsBookingFormOpen(false);
  };

  // Update reservation status (seated, confirmed, cancelled)
  const handleUpdateStatus = (resId, newStatus) => {
    setReservations(prev => 
      prev.map(r => r.id === resId ? { ...r, status: newStatus } : r)
    );

    // Sync table state
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setTables(prevTables => 
      prevTables.map(t => {
        if (t.id === res.tableId) {
          if (newStatus === 'sentado') {
            return { ...t, status: 'ocupada' };
          } else if (newStatus === 'cancelada') {
            return { ...t, status: 'libre', currentReservationId: null };
          } else if (newStatus === 'confirmada' || newStatus === 'pendiente') {
            return { ...t, status: 'reservada', currentReservationId: resId };
          }
        }
        return t;
      })
    );
  };

  // Delete reservation
  const handleDeleteReservation = (resId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro de reserva?')) {
      const resToDelete = reservations.find(r => r.id === resId);
      
      setReservations(prev => prev.filter(r => r.id !== resId));
      
      if (resToDelete) {
        setTables(prevTables => 
          prevTables.map(t => 
            t.id === resToDelete.tableId 
              ? { ...t, status: 'libre', currentReservationId: null }
              : t
          )
        );
      }
    }
  };

  // Table action directly from the Map
  const handleTableAction = (tableId, action) => {
    if (action === 'seat') {
      // Find the confirmed reservation for this table
      const res = reservations.find(
        r => r.tableId === tableId && r.status === 'confirmada'
      );
      if (res) {
        handleUpdateStatus(res.id, 'sentado');
      } else {
        // Fallback: update table status only
        setTables(prev => 
          prev.map(t => t.id === tableId ? { ...t, status: 'ocupada' } : t)
        );
      }
    } else if (action === 'free') {
      // Free the table and cancel/complete its reservation
      const table = tables.find(t => t.id === tableId);
      if (table && table.currentReservationId) {
        handleUpdateStatus(table.currentReservationId, 'cancelada');
      } else {
        // Fallback: update table status only
        setTables(prev => 
          prev.map(t => t.id === tableId ? { ...t, status: 'libre', currentReservationId: null } : t)
        );
      }
    }
  };

  return (
    <div className="app-container">
      <Header 
        currentView={view} 
        onViewChange={setView} 
        isTerraceClosed={isTerraceClosed}
        onToggleTerrace={handleToggleTerrace}
      />

      <main className="main-content">
        {view === 'dashboard' && (
          <Dashboard 
            reservations={reservations} 
            tables={tables} 
            isTerraceClosed={isTerraceClosed} 
            onViewChange={setView}
          />
        )}

        {view === 'reservations' && (
          <ReservationList 
            reservations={reservations}
            tables={tables}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onUpdateStatus={handleUpdateStatus}
            onDeleteReservation={handleDeleteReservation}
            onOpenBookingForm={handleOpenBookingForm}
          />
        )}

        {view === 'map' && (
          <TableLayout 
            tables={tables}
            reservations={reservations}
            isTerraceClosed={isTerraceClosed}
            onTableAction={handleTableAction}
            onSelectTableForBooking={handleSelectTableForBooking}
          />
        )}
      </main>

      {/* Booking Form Modal */}
      {isBookingFormOpen && (
        <ReservationForm 
          tables={tables}
          reservations={reservations}
          isTerraceClosed={isTerraceClosed}
          preselectedTableId={preselectedTableId}
          onSubmit={handleCreateReservation}
          onCancel={() => setIsBookingFormOpen(false)}
        />
      )}
    </div>
  );
}
