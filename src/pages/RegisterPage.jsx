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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('registerData', JSON.stringify(form));
        navigate('/tipo-negocio');
    };

    return (
        /* Reemplazamos bg-gray-100 por el gradiente verde oscuro con resplandor */
        <div className="min-h-screen flex flex-col items-center p-6 justify-center bg-brand-gradient selection:bg-brand-green/30">

            {/* Encabezado del Formulario */}
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-2 text-white font-['Pliant'] tracking-wide">
                    ReservaYa
                </h1>
                <p className="text-white/80 text-sm max-w-xs mx-auto">
                    Registra tu negocio y comienza a gestionar tus reservas.
                </p>
            </div>

            {/* Contenedor Principal (Blanco Hueso / Bordes muy redondeados tipo AgendaPro) */}
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
                        />
                    </div>

                    {/* Selector: Turnos Mensuales */}
                    <div>
                        <select
                            name="monthlyAppointments"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-all"
                            onChange={handleChange}
                            defaultValue=""
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
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-all placeholder:text-brand-text/50 mb-2"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Botón de Continuar (Premium con el color de acento) */}
                <button
                    type="submit"
                    className="w-full bg-brand-accent hover:bg-brand-accent-light text-brand-text font-bold py-3.5 px-4 rounded-xl transition-all duration-200 mt-6 shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                    Continuar
                </button>

                {/* Texto inferior opcional para mejorar la UI */}
                <p className="text-xs text-center text-brand-text/60 mt-4">
                    Al continuar, aceptas los términos y condiciones.
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;