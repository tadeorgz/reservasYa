import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setErrorMessage('');

            const { error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (error) throw error;

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo iniciar sesión.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 justify-center bg-brand-gradient">
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-2 text-white">
                    AgendasYa
                </h1>
                <p className="text-white/80 text-sm">
                    Inicia sesión para gestionar tu negocio.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-brand-bg mt-8 p-8 rounded-3xl shadow-2xl w-full max-w-md"
            >
                <div className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                        required
                    />
                </div>

                {errorMessage && (
                    <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold mt-4">
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-accent hover:bg-brand-accent-light disabled:opacity-60 text-brand-text font-bold py-3.5 px-4 rounded-xl transition-all mt-6"
                >
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full mt-4 text-sm font-semibold text-brand-green hover:underline"
                >
                    Crear mi negocio
                </button>
            </form>
        </div>
    );
}

export default LoginPage;