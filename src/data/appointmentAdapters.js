// const professionalColors = [
//     '#2D7A5F',
//     '#D4AF37',
//     '#2563EB',
//     '#7C3AED',
//     '#DC2626',
//     '#EA580C',
//     '#0891B2',
//     '#16A34A',
// ];

// function getColorForProfessional(professionalId) {
//     if (!professionalId) return professionalColors[0];

//     let hash = 0;

//     for (let i = 0; i < professionalId.length; i++) {
//         hash += professionalId.charCodeAt(i);
//     }

//     return professionalColors[
//         hash % professionalColors.length
//     ];
// }

export function appointmentToCalendarEvent(appointment) {
    const color = appointment.professionalColor || '#2D7A5F';

    return {
        id: appointment.id,
        title: `${appointment.serviceName} · ${appointment.customerName}`,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
            appointment,
        },
    };
}