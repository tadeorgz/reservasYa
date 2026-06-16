export const mockProfessionals = [
    {
        id: 'prof-1',
        name: 'Dante Leoni',
        role: 'Barbero',
        active: true,
    },
    {
        id: 'prof-2',
        name: 'Juan Pérez',
        role: 'Barbero',
        active: true,
    },
];

export const mockAppointments = [
    {
        id: 'app-1',
        customerName: 'Mateo Rodríguez',
        customerPhone: '099123456',
        serviceName: 'Corte',
        professionalName: 'Dante Leoni',
        professionalId: 'prof-1',
        date: '2026-06-10',
        time: '10:00',
        start: '2026-06-10T10:00:00',
        end: '2026-06-10T10:30:00',
        status: 'confirmed',
        price: 400,
    },
    {
        id: 'app-2',
        customerName: 'Lucía Fernández',
        customerPhone: '098456789',
        serviceName: 'Corte + barba',
        professionalName: 'Juan Pérez',
        professionalId: 'prof-2',
        date: '2026-06-10',
        time: '11:30',
        start: '2026-06-10T11:30:00',
        end: '2026-06-10T12:15:00',
        status: 'pending',
        price: 600,
    },
    {
        id: 'app-3',
        customerName: 'Carlos Medina',
        customerPhone: '091222333',
        serviceName: 'Barba',
        professionalName: 'Dante Leoni',
        professionalId: 'prof-1',
        date: '2026-06-10',
        time: '15:00',
        start: '2026-06-10T15:00:00',
        end: '2026-06-10T15:20:00',
        status: 'completed',
        price: 300,
    },
];

export const mockBusinessSettings = {
    bookingMode: 'automatic', // automatic | manual
};