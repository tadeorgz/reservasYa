import { supabase } from './supabaseClient';

export async function getProfessionalsByBusinessId(businessId) {
    const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: true });

    if (error) throw error;

    return data;
}

export async function createProfessional({ businessId, professional }) {
    const { data, error } = await supabase
        .from('professionals')
        .insert({
            business_id: businessId,
            name: professional.name,
            phone: professional.phone || '',
            email: professional.email || '',
            role: professional.role || 'Profesional',
            active: professional.active !== false,
            color: professional.color || '#2D7A5F',
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateProfessional(professionalId, updates) {
    const { data, error } = await supabase
        .from('professionals')
        .update({
            name: updates.name,
            phone: updates.phone || '',
            email: updates.email || '',
            role: updates.role || 'Profesional',
            active: updates.active !== false,
            color: updates.color || '#2D7A5F',
        })
        .eq('id', professionalId)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function deleteProfessional(professionalId) {
    const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', professionalId);

    if (error) throw error;
}