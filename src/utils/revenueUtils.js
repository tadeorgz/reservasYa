export function getCurrentMonthKey() {
    return new Date().toISOString().slice(0, 7);
}

export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

export function getRevenueAppointments(appointments) {
    return appointments.filter(
        (appointment) => appointment.status === 'completed'
    );
}

export function getRevenueStats(appointments) {
    const today = getTodayDate();
    const currentMonth = getCurrentMonthKey();

    const revenueAppointments = getRevenueAppointments(appointments);

    const todayRevenueAppointments = revenueAppointments.filter(
        (appointment) => appointment.date === today
    );

    const monthRevenueAppointments = revenueAppointments.filter((appointment) =>
        appointment.date?.startsWith(currentMonth)
    );

    const todayRevenue = sumRevenue(todayRevenueAppointments);
    const monthRevenue = sumRevenue(monthRevenueAppointments);
    const averageTicket =
        revenueAppointments.length > 0
            ? Math.round(sumRevenue(revenueAppointments) / revenueAppointments.length)
            : 0;

    return {
        todayRevenue,
        monthRevenue,
        completedAppointments: revenueAppointments.length,
        averageTicket,
    };
}

export function getRevenueByProfessional(appointments) {
    const revenueAppointments = getRevenueAppointments(appointments);
    const result = {};

    revenueAppointments.forEach((appointment) => {
        const key = appointment.professionalId || appointment.professionalName || 'sin-profesional';

        if (!result[key]) {
            result[key] = {
                id: key,
                name: appointment.professionalName || 'Sin profesional',
                total: 0,
                count: 0,
            };
        }

        result[key].total += Number(appointment.price || 0);
        result[key].count += 1;
    });

    return Object.values(result).sort((a, b) => b.total - a.total);
}

export function getRevenueByService(appointments) {
    const revenueAppointments = getRevenueAppointments(appointments);
    const result = {};

    revenueAppointments.forEach((appointment) => {
        const key = appointment.serviceId || appointment.serviceName || 'sin-servicio';

        if (!result[key]) {
            result[key] = {
                id: key,
                name: appointment.serviceName || 'Sin servicio',
                total: 0,
                count: 0,
            };
        }

        result[key].total += Number(appointment.price || 0);
        result[key].count += 1;
    });

    return Object.values(result).sort((a, b) => b.total - a.total);
}

function sumRevenue(appointments) {
    return appointments.reduce(
        (total, appointment) => total + Number(appointment.price || 0),
        0
    );
}