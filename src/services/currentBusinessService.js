import { supabase } from './supabaseClient';

export async function getCurrentProfile() {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    const user = authData.user;

    if (!user) {
        throw new Error('No hay usuario autenticado.');
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
        *,
        businesses (
            id,
            name,
            slug,
            business_type
        )
    `)
        .eq('id', user.id)
        .single();

    if (profileError) throw profileError;

    return profile;
}

export async function getCurrentBusinessId() {
    const profile = await getCurrentProfile();

    if (!profile.business_id) {
        throw new Error('El usuario no tiene negocio asociado.');
    }

    return profile.business_id;
}