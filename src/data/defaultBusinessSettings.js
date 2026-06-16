export const defaultBusinessHours = [
    {
        dayOfWeek: 1,
        dayLabel: 'Lunes',
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
    },
    {
        dayOfWeek: 2,
        dayLabel: 'Martes',
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
    },
    {
        dayOfWeek: 3,
        dayLabel: 'Miércoles',
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
    },
    {
        dayOfWeek: 4,
        dayLabel: 'Jueves',
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
    },
    {
        dayOfWeek: 5,
        dayLabel: 'Viernes',
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
    },
    {
        dayOfWeek: 6,
        dayLabel: 'Sábado',
        isOpen: true,
        openTime: '09:00',
        closeTime: '14:00',
    },
    {
        dayOfWeek: 0,
        dayLabel: 'Domingo',
        isOpen: false,
        openTime: '',
        closeTime: '',
    },
];

export const defaultBusinessSettings = {
    company: {
        name: '',
        description: '',
        logoUrl: '',
        publicSlug: '',
    },

    businessHours: defaultBusinessHours,

    theme: {
        primaryColor: '#2D7A5F',
        generalButtonColor: '#D4AF37',
        cancelButtonColor: '#DC2626',
    },

    contact: {
        instagram: '',
        facebook: '',
        tiktok: '',
        location: '',
        whatsapp: '',
    },

    booking: {
        minHoursBeforeBooking: 2,
        maxDaysInAdvance: 30,
        allowBookingNotes: true,
        professionalSelection: 'can',
    },
};