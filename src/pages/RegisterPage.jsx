import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        businessName: '',
        email: '',
        whatsapp: '',
        monthlyAppointments: '',
        password: '',
    });

    const [passwordIsValid, setPasswordIsValid] = useState(true);

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        // UX: Si el usuario ya está corrigiendo la contraseña y llega a 6 caracteres, quitamos el error visual inmediatamente
        if (name === 'password') {
            if (validatePassword(value)) {
                setPasswordIsValid(true);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validamos la contraseña al intentar enviar
        const isValid = validatePassword(form.password);
        setPasswordIsValid(isValid);

        // 2. Si NO es válida, cortamos la ejecución aquí (evita que guarde y navegue)
        if (!isValid) {
            return;
        }

        // Si es válida, continúa el flujo normal
        localStorage.setItem('registerData', JSON.stringify(form));
        navigate('/tipo-negocio');
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 justify-center bg-brand-gradient selection:bg-brand-green/30">

            {/* Encabezado del Formulario */}
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-2 text-white font-['Pliant'] tracking-wide">
                    ReservasYa
                </h1>
                <p className="text-white/80 text-sm max-w-xs mx-auto">
                    Registra tu negocio y comienza a gestionar tus reservas.
                </p>
            </div>

            {/* Contenedor Principal */}
            <form
                onSubmit={handleSubmit}
                className="bg-brand-bg mt-8 p-8 rounded-3xl shadow-2xl w-full md:max-w-md lg:max-w-1/3 border border-white/10"
            >
                <div className="space-y-4">

                    {/* Campo: Nombre del negocio */}
                    <div>
                        <input
                            type="text"
                            name="businessName"
                            placeholder="Nombre del negocio"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-all placeholder:text-brand-text/50"
                            onChange={handleChange}
                            value={form.businessName}
                        />
                    </div>

                    {/* Campo: Correo */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-all placeholder:text-brand-text/50"
                            onChange={handleChange}
                            value={form.email}
                        />
                    </div>

                    {/* Campo: WhatsApp */}
                    <div>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="WhatsApp de contacto"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-all placeholder:text-brand-text/50"
                            onChange={handleChange}
                            value={form.whatsapp}
                        />
                    </div>

                    {/* Selector: Turnos Mensuales */}
                    <div>
                        <select
                            name="monthlyAppointments"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-all"
                            onChange={handleChange}
                            defaultValue=""
                            value={form.monthlyAppointments}
                        >
                            <option value="" disabled>
                                Cantidad de turnos mensuales
                            </option>
                            <option value="1">Hasta 20 turnos</option>
                            <option value="2">Entre 20 y 50 turnos</option>
                            <option value="3">Más de 50 turnos</option>
                        </select>
                    </div>

                    {/* Campo: Contraseña */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Crea tu contraseña"
                            className={`w-full bg-brand-surface text-brand-text border p-3 rounded-xl focus:outline-none transition-all placeholder:text-brand-text/50 ${!passwordIsValid
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-brand-green'
                                }`}
                            onChange={handleChange}
                            value={form.password}
                        />
                        {/* El mensaje de error ahora se muestra abajo del input, lo que visualmente es más orgánico */}
                        {!passwordIsValid && (
                            <p className="text-red-500 text-xs mt-1.5 ml-1 animate-pulse">
                                La contraseña debe tener al menos 6 caracteres.
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón de Continuar */}

                <button
                    type="submit"
                    className="w-full cursor-pointer bg-brand-accent hover:bg-brand-accent-light text-brand-text font-bold py-3.5 px-4 rounded-xl transition-all duration-200 mt-6 shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                    Continuar
                </button>

                <p className="text-xs text-center text-brand-text/60 mt-4">
                    Al continuar, aceptas los términos y condiciones.
                </p>
            </form>
            <p className="text-sm text-center text-white mt-4">
                ¿Ya tienes una cuenta?  {"   "}
                <button
                    onClick={() => navigate('/login')}
                    className="text-sm cursor-pointer font-semibold text-brand-green hover:underline mt-4"
                >
                    Inicia sesión aquí
                </button>
            </p>
        </div>
    );
}

export default RegisterPage;