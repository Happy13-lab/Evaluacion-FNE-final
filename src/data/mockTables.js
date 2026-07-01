// mockTables.js - Estado inicial de las mesas de Bistro Fusión

export const INITIAL_TABLES = [
  { id: 1, name: 'Mesa 1', capacity: 2, location: 'Salon', status: 'libre', currentReservationId: null },
  { id: 2, name: 'Mesa 2', capacity: 2, location: 'Salon', status: 'ocupada', currentReservationId: 'res-102' },
  { id: 3, name: 'Mesa 3', capacity: 4, location: 'Salon', status: 'libre', currentReservationId: null },
  { id: 4, name: 'Mesa 4', capacity: 4, location: 'Salon', status: 'reservada', currentReservationId: 'res-101' },
  { id: 5, name: 'Mesa 5', capacity: 6, location: 'Salon', status: 'libre', currentReservationId: null },
  { id: 6, name: 'Mesa 6', capacity: 4, location: 'Salon', status: 'libre', currentReservationId: null },
  { id: 7, name: 'Mesa 7', capacity: 8, location: 'Salon', status: 'reservada', currentReservationId: 'res-104' },
  { id: 8, name: 'Mesa 8', capacity: 2, location: 'Salon', status: 'libre', currentReservationId: null },
  { id: 9, name: 'Mesa 9', capacity: 2, location: 'Terraza', status: 'libre', currentReservationId: null },
  { id: 10, name: 'Mesa 10', capacity: 4, location: 'Terraza', status: 'ocupada', currentReservationId: 'res-103' },
  { id: 11, name: 'Mesa 11', capacity: 4, location: 'Terraza', status: 'libre', currentReservationId: null },
  { id: 12, name: 'Mesa 12', capacity: 6, location: 'Terraza', status: 'libre', currentReservationId: null },
];
