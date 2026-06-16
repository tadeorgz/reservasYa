import { supabase } from './supabaseClient';

export async function getAppointmentsByBusinessId(businessId) {
    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            professionals (
                color
            )
        `)
        .eq('business_id', businessId)
        .order('start_time', { ascending: true });

    if (error) throw error;

    return data.map(mapAppointmentFromDb);
}

export async function createAppointment({ businessId, appointment }) {
    const { data, error } = await supabase
        .from('appointments')
        .insert({
            business_id: businessId,
            service_id: appointment.serviceId || null,
            professional_id: appointment.professionalId || null,
            customer_name: appointment.customerName,
            customer_phone: appointment.customerPhone,
            notes: appointment.notes || null,
            service_name: appointment.serviceName,
            professional_name: appointment.professionalName,
            date: appointment.date,
            start_time: appointment.start,
            end_time: appointment.end,
            status: appointment.status || 'pending',
            price: Number(appointment.price || 0),
            source: appointment.source || 'dashboard_manual',
        })
        .select(`
    *,
    professionals (
        color
    )
`)
        .single();

    if (error) throw error;

    return mapAppointmentFromDb(data);
}

export async function updateAppointmentStatus(appointmentId, status) {
    const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select(`
    *,
    professionals (
        color
    )
`).single();

    if (error) throw error;

    return mapAppointmentFromDb(data);
}

function mapAppointmentFromDb(row) {
    const start = row.start_time;
    const end = row.end_time;

    return {
        id: row.id,
        businessId: row.business_id,
        serviceId: row.service_id,
        professionalId: row.professional_id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        notes: row.notes,
        serviceName: row.service_name,
        professionalName: row.professional_name,
        date: row.date,
        professionalColor: row.professionals?.color || '#2D7A5F',
        start,
        end,
        time: formatTimeFromDateTime(start),
        status: row.status,
        price: Number(row.price || 0),
        source: row.source,
    };
}

function formatTimeFromDateTime(dateTime) {
    if (!dateTime) return '';

    const date = new Date(dateTime);

    return date.toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}