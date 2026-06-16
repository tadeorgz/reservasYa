export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

export function getCurrentMonthKey() {
    return new Date().toISOString().slice(0, 7);
}

export function getDashboardStats(appointments, services) {
    const today = getTodayDate();
    const currentMonth = getCurrentMonthKey();

    const todayAppointments = appointments.filter(
        (appointment) => appointment.date === today
    );

    const monthlyAppointments = appointments.filter((appointment) =>
        appointment.date?.startsWith(currentMonth)
    );

    const monthlyIncome = monthlyAppointments
        .filter(
            (appointment) =>
                appointment.status === 'confirmed' ||
                appointment.status === 'completed'
        )
        .reduce((total, appointment) => total + Number(appointment.price || 0), 0);

    const pendingAppointments = appointments.filter(
        (appointment) => appointment.status === 'pending'
    );

    const activeServices = services.filter(
        (service) => service.active !== false
    );

    return {
        todayAppointments: todayAppointments.length,
        monthlyIncome,
        pendingAppointments: pendingAppointments.length,
        activeServices: activeServices.length,
    };
}