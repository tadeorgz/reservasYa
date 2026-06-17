import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleArrowLeft, Trash2, Plus } from 'lucide-react';
import { createBusinessOnboarding } from '../services/onboardingService';

function ServicesPage() {
    const navigate = useNavigate();

    const [businessType, setBusinessType] = useState(null);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedType = localStorage.getItem('selectedBusinessType');

        if (!storedType) {
            navigate('/tipo-negocio');
            return;
        }

        const parsedType = JSON.parse(storedType);

        setBusinessType(parsedType);
        setServices(parsedType.defaultServices || []);
    }, [navigate]);

    const handleServiceChange = (serviceId, field, value) => {
        const updatedServices = services.map((service) =>
            service.id === serviceId
                ? { ...service, [field]: value }
                : service
        );

        setServices(updatedServices);
    };

    const handleAddService = () => {
        const newService = {
            id: crypto.randomUUID(),
            name: '',
            price: '',
            duration: '',
        };

        setServices([...services, newService]);
    };

    const handleRemoveService = (serviceId) => {
        const updatedServices = services.filter((service) => service.id !== serviceId);
        setServices(updatedServices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setErrorMessage('');

        try {
            const storedRegister = localStorage.getItem('registerData');
            const storedBusinessType = localStorage.getItem('selectedBusinessType');

            if (!storedRegister || !storedBusinessType) {
                throw new Error('Faltan datos del registro.');
            }

            const registerData = JSON.parse(storedRegister);
            const businessType = JSON.parse(storedBusinessType);

            localStorage.setItem('selectedServices', JSON.stringify(services));

            const { business } = await createBusinessOnboarding({
                registerData,
                businessType,
                services,
            });

            localStorage.setItem('currentBusinessId', business.id);
            localStorage.setItem('currentBusinessSlug', business.slug);

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo crear el negocio.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!businessType) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient p-4 md:p-6 flex flex-col items-center justify-center">
                <div className="bg-brand-bg p-6 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/10">
                    <p className="text-brand-text/70 font-semibold">
                        Cargando servicios...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-gradient p-4 md:p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl text-center mb-6 md:mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white cursor-pointer py-2 px-4 rounded-lg mb-4 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                    <CircleArrowLeft size={20} />
                    <span>Volver</span>
                </button>

                <h1 className="text-3xl font-bold text-white mb-2">
                    Configura tus servicios
                </h1>

                <p className="text-white/80">
                    Agregamos algunos servicios sugeridos para {businessType.title.toLowerCase()}.
                    Puedes editarlos ahora.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-brand-bg p-4 md:p-6 rounded-3xl shadow-2xl w-full max-w-3xl border border-white/10"
            >
                {/* ENCABEZADOS DE ESCRITORIO (Solo visibles en md: en adelante) */}
                {services.length > 0 && (
                    <div className="hidden md:grid grid-cols-[1fr_130px_130px_48px] gap-4 px-4 mb-2 text-sm font-semibold text-brand-text/70">
                        <div>Nombre del servicio</div>
                        <div>Precio</div>
                        <div>Duración (Min)</div>
                        <div></div> {/* Espacio para el botón de borrar */}
                    </div>
                )}

                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-brand-surface p-4 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-[1fr_130px_130px_auto] gap-4 items-end md:items-center"
                        >
                            {/* INPUT: NOMBRE */}
                            <div className="w-full ">
                                <label className="block md:hidden text-xs font-semibold text-brand-text/60 mb-1">
                                    Nombre del servicio
                                </label>
                                <input
                                    type="text"
                                    value={service.name}
                                    placeholder="Ej. Corte de cabello"
                                    onChange={(e) =>
                                        handleServiceChange(service.id, 'name', e.target.value)
                                    }
                                    className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors"
                                />
                            </div>

                            {/* INPUT: PRECIO */}
                            <div className="w-full">
                                <label className="block md:hidden text-xs font-semibold text-brand-text/60 mb-1">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    value={service.price}
                                    placeholder="$ 0.00"
                                    onChange={(e) =>
                                        handleServiceChange(service.id, 'price', e.target.value)
                                    }
                                    className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors"
                                />
                            </div>

                            {/* INPUT: DURACIÓN */}
                            <div className="w-full">
                                <label className="block md:hidden text-xs font-semibold text-brand-text/60 mb-1">
                                    Duración (Min)
                                </label>
                                <input
                                    type="number"
                                    value={service.duration}
                                    placeholder="Minutos"
                                    onChange={(e) =>
                                        handleServiceChange(service.id, 'duration', e.target.value)
                                    }
                                    className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors"
                                />
                            </div>

                            {/* BOTÓN ELIMINAR */}
                            <div className="flex justify-end md:justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveService(service.id)}
                                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1 md:gap-0"
                                    title="Quitar servicio"
                                >
                                    <Trash2 size={18} />
                                    <span className="md:hidden text-sm font-medium">Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTÓN AGREGAR */}
                <button
                    type="button"
                    onClick={handleAddService}
                    className="w-full border border-dashed cursor-pointer border-brand-text/30 text-brand-text font-semibold py-3 rounded-xl mt-5 hover:bg-brand-surface transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    <span>Agregar otro servicio</span>
                </button>

                {/* BOTÓN SUBMIT */}
                <button
                    type="submit"
                    className="w-full bg-brand-accent cursor-pointer hover:bg-brand-accent-light text-brand-text font-bold py-3.5 px-4 rounded-xl transition-all duration-200 mt-6 shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                    Crear mi agenda
                </button>
                {errorMessage && (
                    <p className="text-red-600 text-sm font-semibold mt-4 text-center">
                        {errorMessage}
                    </p>
                )}
            </form>
        </div>
    );
}

export default ServicesPage;