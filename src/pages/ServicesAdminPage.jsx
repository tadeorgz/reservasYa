import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getCurrentBusinessId } from '../services/currentBusinessService';
import {
    createService,
    deleteService,
    getServicesByBusinessId,
    updateService,
} from '../services/serviceService';

function ServicesAdminPage() {
    const navigate = useNavigate();

    const [businessId, setBusinessId] = useState(null);
    const [services, setServices] = useState([]);
    const [deletedServiceIds, setDeletedServiceIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadServices() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const currentBusinessId = await getCurrentBusinessId();
                const servicesFromDb = await getServicesByBusinessId(currentBusinessId);

                setBusinessId(currentBusinessId);
                setServices(servicesFromDb);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message || 'No se pudieron cargar los servicios.');
            } finally {
                setIsLoading(false);
            }
        }

        loadServices();
    }, []);

    const handleServiceChange = (serviceId, field, value) => {
        setServices((currentServices) =>
            currentServices.map((service) =>
                service.id === serviceId
                    ? {
                        ...service,
                        [field]:
                            field === 'price' || field === 'duration'
                                ? Number(value)
                                : value,
                    }
                    : service
            )
        );
    };

    const handleAddService = () => {
        const newService = {
            id: `local-${crypto.randomUUID()}`,
            name: '',
            price: 0,
            duration: 30,
            active: true,
        };

        setServices((currentServices) => [...currentServices, newService]);
    };

    const handleRemoveService = (serviceId) => {
        if (!String(serviceId).startsWith('local-')) {
            setDeletedServiceIds((currentIds) => [...currentIds, serviceId]);
        }

        setServices((currentServices) =>
            currentServices.filter((service) => service.id !== serviceId)
        );
    };

    const handleToggleActive = (serviceId) => {
        setServices((currentServices) =>
            currentServices.map((service) =>
                service.id === serviceId
                    ? { ...service, active: service.active === false ? true : false }
                    : service
            )
        );
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setErrorMessage('');

            if (!businessId) {
                throw new Error('No se encontró el negocio actual.');
            }

            for (const serviceId of deletedServiceIds) {
                await deleteService(serviceId);
            }

            const savedServices = [];

            for (const service of services) {
                if (!service.name.trim()) continue;

                if (String(service.id).startsWith('local-')) {
                    const createdService = await createService({
                        businessId,
                        service,
                    });

                    savedServices.push(createdService);
                } else {
                    const updatedService = await updateService(service.id, service);
                    savedServices.push(updatedService);
                }
            }

            setServices(savedServices);
            setDeletedServiceIds([]);
            alert('Servicios guardados');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudieron guardar los servicios.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gradient p-4 md:p-6">
            <div className="lg:max-w-4/5 md:max-w-10/12 mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-white/80 hover:text-white flex cursor-pointer items-center gap-2 mb-6"
                >
                    <ArrowLeft size={18} />
                    Volver al dashboard
                </button>

                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-white/70 text-sm">
                            Panel de gestión
                        </p>

                        <h1 className="text-3xl font-bold text-white">
                            Servicios
                        </h1>

                        <p className="text-white/70 mt-1">
                            Edita los servicios, precios y duración de cada turno.
                        </p>
                    </div>

                    <button
                        onClick={handleAddService}
                        disabled={isLoading || isSaving}
                        className="bg-brand-accent hover:bg-brand-accent-light disabled:opacity-60 text-brand-text font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        Nuevo servicio
                    </button>
                </header>

                <section className="bg-brand-bg rounded-3xl shadow-2xl border border-white/10 p-5 md:p-6">
                    {errorMessage && (
                        <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold mb-4">
                            {errorMessage}
                        </p>
                    )}

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-brand-text/60">
                                Cargando servicios...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:grid grid-cols-[1fr_130px_130px_120px_60px] gap-3 px-4 mb-3 text-xs font-bold uppercase tracking-wide text-brand-text/50">
                                <span>Servicio</span>
                                <span>Precio</span>
                                <span>Duración</span>
                                <span>Estado</span>
                                <span></span>
                            </div>

                            <div className="space-y-3">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="grid grid-cols-1 md:grid-cols-[1fr_130px_130px_120px_60px] gap-3 items-end md:items-center bg-brand-surface border border-gray-200 rounded-2xl p-4"
                                    >
                                        <label>
                                            <span className="block md:hidden text-xs font-bold text-brand-text/50 mb-1">
                                                Servicio
                                            </span>

                                            <input
                                                value={service.name}
                                                onChange={(e) =>
                                                    handleServiceChange(
                                                        service.id,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nombre del servicio"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>

                                        <label>
                                            <span className="block md:hidden text-xs font-bold text-brand-text/50 mb-1">
                                                Precio
                                            </span>

                                            <input
                                                type="number"
                                                value={service.price}
                                                onChange={(e) =>
                                                    handleServiceChange(
                                                        service.id,
                                                        'price',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="$ 0"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>

                                        <label>
                                            <span className="block md:hidden text-xs font-bold text-brand-text/50 mb-1">
                                                Duración
                                            </span>

                                            <input
                                                type="number"
                                                value={service.duration}
                                                onChange={(e) =>
                                                    handleServiceChange(
                                                        service.id,
                                                        'duration',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Minutos"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(service.id)}
                                            className={`px-3 py-3 rounded-xl text-sm font-bold ${service.active === false
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-emerald-50 text-emerald-700'
                                                }`}
                                        >
                                            {service.active === false ? 'Inactivo' : 'Activo'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveService(service.id)}
                                            className="justify-self-end md:justify-self-center text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {services.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-brand-text/60 mb-4">
                                        Todavía no hay servicios configurados.
                                    </p>

                                    <button
                                        onClick={handleAddService}
                                        className="bg-brand-green text-white font-bold px-5 py-3 rounded-xl"
                                    >
                                        Crear primer servicio
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-brand-green hover:bg-brand-dark-bg disabled:opacity-60 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-6"
                            >
                                <Save size={18} />
                                {isSaving ? 'Guardando...' : 'Guardar servicios'}
                            </button>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ServicesAdminPage;