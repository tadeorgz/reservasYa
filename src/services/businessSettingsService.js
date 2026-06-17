import { supabase } from './supabaseClient';

export async function getBusinessSettingsData(businessId) {
    const [businessResult, settingsResult, hoursResult] = await Promise.all([
        supabase
            .from('businesses')
            .select('*')
            .eq('id', businessId)
            .single(),

        supabase
            .from('business_settings')
            .select('*')
            .eq('business_id', businessId)
            .single(),

        supabase
            .from('business_hours')
            .select('*')
            .eq('business_id', businessId)
            .order('day_of_week', { ascending: true }),
    ]);

    if (businessResult.error) throw businessResult.error;
    if (settingsResult.error) throw settingsResult.error;
    if (hoursResult.error) throw hoursResult.error;

    return mapSettingsFromDb({
        business: businessResult.data,
        settings: settingsResult.data,
        hours: hoursResult.data,
    });
}

export async function updateBusinessSettingsData(businessId, settings) {
    const businessPayload = {
        name: settings.company.name,
        slug: settings.company.publicSlug,
        description: settings.company.description,
        logo_url: settings.company.logoUrl || null,
        whatsapp: settings.contact.whatsapp,
        updated_at: new Date().toISOString(),
    };

    const { error: businessError } = await supabase
        .from('businesses')
        .update(businessPayload)
        .eq('id', businessId);

    if (businessError) throw businessError;

    const { error: settingsError } = await supabase
        .from('business_settings')
        .update({
            theme: settings.theme,
            contact: settings.contact,
            booking: settings.booking,
        })
        .eq('business_id', businessId);

    if (settingsError) throw settingsError;

    for (const day of settings.businessHours) {
        const { error: hourError } = await supabase
            .from('business_hours')
            .update({
                is_open: day.isOpen,
                open_time: day.isOpen ? day.openTime || null : null,
                close_time: day.isOpen ? day.closeTime || null : null,
            })
            .eq('business_id', businessId)
            .eq('day_of_week', day.dayOfWeek);

        if (hourError) throw hourError;
    }
}

function mapSettingsFromDb({ business, settings, hours }) {
    return {
        company: {
            name: business.name || '',
            description: business.description || '',
            logoUrl: business.logo_url || '',
            publicSlug: business.slug || '',
        },

        businessHours: hours.map((day) => ({
            dayOfWeek: day.day_of_week,
            dayLabel: day.day_label,
            isOpen: day.is_open,
            openTime: day.open_time?.slice(0, 5) || '',
            closeTime: day.close_time?.slice(0, 5) || '',
        })),

        theme: {
            primaryColor: settings.theme?.primaryColor || '#2D7A5F',
            generalButtonColor: settings.theme?.generalButtonColor || '#D4AF37',
            cancelButtonColor: settings.theme?.cancelButtonColor || '#DC2626',
        },

        contact: {
            instagram: settings.contact?.instagram || '',
            facebook: settings.contact?.facebook || '',
            tiktok: settings.contact?.tiktok || '',
            location: settings.contact?.location || '',
            whatsapp: settings.contact?.whatsapp || business.whatsapp || '',
        },

        booking: {
            minHoursBeforeBooking: settings.booking?.minHoursBeforeBooking ?? 2,
            maxDaysInAdvance: settings.booking?.maxDaysInAdvance ?? 30,
            allowBookingNotes: settings.booking?.allowBookingNotes ?? true,
            professionalSelection: settings.booking?.professionalSelection || 'can',
            autoConfirmAppointments: settings.booking?.autoConfirmAppointments ?? true,
        },
        subscription: {
            plan: business.plan || 'free',
            status: business.subscription_status || 'inactive',
            trialEndsAt: business.trial_ends_at || null,
        },
    };
}