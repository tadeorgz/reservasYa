const PUBLIC_APPOINTMENTS_KEY = 'publicAppointments';

export function getPublicAppointments() {
    const storedAppointments = localStorage.getItem(PUBLIC_APPOINTMENTS_KEY);

    if (!storedAppointments) return [];

    return JSON.parse(storedAppointments);
}

export function savePublicAppointment(appointment) {
    const currentAppointments = getPublicAppointments();

    localStorage.setItem(
        PUBLIC_APPOINTMENTS_KEY,
        JSON.stringify([...currentAppointments, appointment])
    );
}

export function updateStoredAppointmentStatus(appointmentId, newStatus) {
    const currentAppointments = getPublicAppointments();

    const updatedAppointments = currentAppointments.map((appointment) =>
        appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
    );

    localStorage.setItem(
        PUBLIC_APPOINTMENTS_KEY,
        JSON.stringify(updatedAppointments)
    );
}