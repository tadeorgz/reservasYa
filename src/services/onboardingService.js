import { supabase } from './supabaseClient';
import { defaultBusinessHours } from '../data/defaultBusinessSettings';

export async function createBusinessOnboarding({
    registerData,
    businessType,
    services,
}) {
    const { email, password, businessName, whatsapp, monthlyAppointments } = registerData;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) throw authError;

    const user = authData.user;

    if (!user) {
        throw new Error('No se pudo crear el usuario.');
    }

    const slug = generateSlug(businessName);

    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
            owner_id: user.id,
            name: businessName,
            slug,
            email,
            whatsapp,
            business_type: businessType.id,
            monthly_appointments_estimate: monthlyAppointments,
        })
        .select()
        .single();

    if (businessError) throw businessError;

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            business_id: business.id,
            email,
            role: 'owner',
        });

    if (profileError) throw profileError;

    const servicesToInsert = services.map((service) => ({
        business_id: business.id,
        name: service.name,
        price: Number(service.price || 0),
        duration: Number(service.duration || 30),
        active: service.active !== false,
    }));

    const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesToInsert);

    if (servicesError) throw servicesError;

    const { error: professionalsError } = await supabase
        .from('professionals')
        .insert({
            business_id: business.id,
            name: 'Profesional principal',
            role: businessType.title || 'Profesional',
            active: true,
        });

    if (professionalsError) throw professionalsError;

    const { error: settingsError } = await supabase
        .from('business_settings')
        .insert({
            business_id: business.id,
            theme: {
                primaryColor: '#2D7A5F',
                generalButtonColor: '#D4AF37',
                cancelButtonColor: '#DC2626',
            },
            contact: {
                whatsapp,
            },
            booking: {
                minHoursBeforeBooking: 2,
                maxDaysInAdvance: 30,
                allowBookingNotes: true,
                professionalSelection: 'can',
            },
        });

    if (settingsError) throw settingsError;

    const hoursToInsert = defaultBusinessHours.map((day) => ({
        business_id: business.id,
        day_of_week: day.dayOfWeek,
        day_label: day.dayLabel,
        is_open: day.isOpen,
        open_time: day.openTime || null,
        close_time: day.closeTime || null,
    }));

    const { error: hoursError } = await supabase
        .from('business_hours')
        .insert(hoursToInsert);

    if (hoursError) throw hoursError;

    return {
        user,
        business,
    };
}

function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replaceAll(' ', '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '');
}