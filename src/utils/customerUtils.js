export function buildCustomersFromAppointments(appointments) {
    const customersMap = new Map();

    appointments.forEach((appointment) => {
        const phone = appointment.customerPhone || 'sin-telefono';
        const key = phone;

        const existingCustomer = customersMap.get(key);

        if (!existingCustomer) {
            customersMap.set(key, {
                id: key,
                name: appointment.customerName || 'Cliente sin nombre',
                phone: appointment.customerPhone || '',
                email: appointment.customerEmail || '',
                bookingsCount: 1,
                totalSpent: Number(appointment.price || 0),
                lastBookingDate: appointment.date || '',
                lastServiceName: appointment.serviceName || '',
                lastProfessionalName: appointment.professionalName || '',
                appointments: [appointment],
            });

            return;
        }

        const updatedAppointments = [
            ...existingCustomer.appointments,
            appointment,
        ];

        customersMap.set(key, {
            ...existingCustomer,
            name: existingCustomer.name || appointment.customerName,
            bookingsCount: existingCustomer.bookingsCount + 1,
            totalSpent: existingCustomer.totalSpent + Number(appointment.price || 0),
            lastBookingDate: getLatestDate(
                existingCustomer.lastBookingDate,
                appointment.date
            ),
            lastServiceName: appointment.serviceName || existingCustomer.lastServiceName,
            lastProfessionalName:
                appointment.professionalName || existingCustomer.lastProfessionalName,
            appointments: updatedAppointments,
        });
    });

    return Array.from(customersMap.values()).sort(
        (a, b) => new Date(b.lastBookingDate) - new Date(a.lastBookingDate)
    );
}

function getLatestDate(currentDate, newDate) {
    if (!currentDate) return newDate;
    if (!newDate) return currentDate;

    return new Date(newDate) > new Date(currentDate)
        ? newDate
        : currentDate;
}