import { supabase } from './supabaseClient';

export async function getServicesByBusinessId(businessId) {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: true });

    if (error) throw error;

    return data;
}

export async function createService({ businessId, service }) {
    const { data, error } = await supabase
        .from('services')
        .insert({
            business_id: businessId,
            name: service.name,
            price: Number(service.price || 0),
            duration: Number(service.duration || 30),
            active: service.active !== false,
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateService(serviceId, updates) {
    const { data, error } = await supabase
        .from('services')
        .update({
            name: updates.name,
            price: Number(updates.price || 0),
            duration: Number(updates.duration || 30),
            active: updates.active !== false,
        })
        .eq('id', serviceId)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function deleteService(serviceId) {
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

    if (error) throw error;
}