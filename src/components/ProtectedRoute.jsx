import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function ProtectedRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        async function checkSession() {
            const { data } = await supabase.auth.getSession();

            setSession(data.session);
            setIsLoading(false);
        }

        checkSession();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
                <div className="bg-brand-bg rounded-3xl p-8 shadow-2xl">
                    <p className="text-brand-text/70 font-semibold">
                        Verificando sesión...
                    </p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;