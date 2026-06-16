import { supabase } from './supabaseClient';

export async function getPublicBookingDataBySlug(slug) {
    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (businessError) throw businessError;

    const [settingsResult, hoursResult, servicesResult, professionalsResult] =
        await Promise.all([
            supabase
                .from('business_settings')
                .select('*')
                .eq('business_id', business.id)
                .single(),

            supabase
                .from('business_hours')
                .select('*')
                .eq('business_id', business.id)
                .order('day_of_week', { ascending: true }),

            supabase
                .from('services')
                .select('*')
                .eq('business_id', business.id)
                .eq('active', true)
                .order('created_at', { ascending: true }),

            supabase
                .from('professionals')
                .select('*')
                .eq('business_id', business.id)
                .eq('active', true)
                .order('created_at', { ascending: true }),
        ]);

    if (settingsResult.error) throw settingsResult.error;
    if (hoursResult.error) throw hoursResult.error;
    if (servicesResult.error) throw servicesResult.error;
    if (professionalsResult.error) throw professionalsResult.error;

    return {
        business,
        settings: {
            company: {
                name: business.name || '',
                description: business.description || '',
                logoUrl: business.logo_url || '',
                publicSlug: business.slug || '',
            },
            businessHours: hoursResult.data.map((day) => ({
                dayOfWeek: day.day_of_week,
                dayLabel: day.day_label,
                isOpen: day.is_open,
                openTime: day.open_time?.slice(0, 5) || '',
                closeTime: day.close_time?.slice(0, 5) || '',
            })),
            theme: {
                primaryColor: settingsResult.data.theme?.primaryColor || '#2D7A5F',
                generalButtonColor: settingsResult.data.theme?.generalButtonColor || '#D4AF37',
                cancelButtonColor: settingsResult.data.theme?.cancelButtonColor || '#DC2626',
            },
            contact: {
                instagram: settingsResult.data.contact?.instagram || '',
                facebook: settingsResult.data.contact?.facebook || '',
                tiktok: settingsResult.data.contact?.tiktok || '',
                location: settingsResult.data.contact?.location || '',
                whatsapp: settingsResult.data.contact?.whatsapp || business.whatsapp || '',
            },
            booking: {
                minHoursBeforeBooking: settingsResult.data.booking?.minHoursBeforeBooking ?? 2,
                maxDaysInAdvance: settingsResult.data.booking?.maxDaysInAdvance ?? 30,
                allowBookingNotes: settingsResult.data.booking?.allowBookingNotes ?? true,
                professionalSelection: settingsResult.data.booking?.professionalSelection || 'can',
            },
        },
        services: servicesResult.data,
        professionals: professionalsResult.data,
    };
}

export async function createPublicAppointment({ businessId, appointment }) {
    const { data, error } = await supabase
        .from('appointments')
        .insert({
            business_id: businessId,
            service_id: appointment.serviceId,
            professional_id: appointment.professionalId,
            customer_name: appointment.customerName,
            customer_phone: appointment.customerPhone,
            notes: appointment.notes || null,
            service_name: appointment.serviceName,
            professional_name: appointment.professionalName,
            date: appointment.date,
            start_time: appointment.start,
            end_time: appointment.end,
            status: appointment.status || 'confirmed',
            price: Number(appointment.price || 0),
            source: 'public_booking',
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}