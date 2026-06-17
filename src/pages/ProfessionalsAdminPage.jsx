import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getCurrentBusinessId } from '../services/currentBusinessService';
import {
    createProfessional,
    deleteProfessional,
    getProfessionalsByBusinessId,
    updateProfessional,
} from '../services/professionalService';

function ProfessionalsAdminPage() {
    const navigate = useNavigate();

    const [businessId, setBusinessId] = useState(null);
    const [professionals, setProfessionals] = useState([]);
    const [deletedProfessionalIds, setDeletedProfessionalIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadProfessionals() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const currentBusinessId = await getCurrentBusinessId();
                const professionalsFromDb = await getProfessionalsByBusinessId(currentBusinessId);

                setBusinessId(currentBusinessId);
                setProfessionals(professionalsFromDb);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message || 'No se pudo cargar el personal.');
            } finally {
                setIsLoading(false);
            }
        }

        loadProfessionals();
    }, []);

    const handleProfessionalChange = (professionalId, field, value) => {
        setProfessionals((currentProfessionals) =>
            currentProfessionals.map((professional) =>
                professional.id === professionalId
                    ? {
                        ...professional,
                        [field]: value,
                    }
                    : professional
            )
        );
    };

    const handleAddProfessional = () => {
        const newProfessional = {
            id: `local-${crypto.randomUUID()}`,
            name: '',
            phone: '',
            email: '',
            role: '',
            active: true,
            color: '',
        };

        setProfessionals((currentProfessionals) => [
            ...currentProfessionals,
            newProfessional,
        ]);
    };

    const handleRemoveProfessional = (professionalId) => {
        if (!String(professionalId).startsWith('local-')) {
            setDeletedProfessionalIds((currentIds) => [
                ...currentIds,
                professionalId,
            ]);
        }

        setProfessionals((currentProfessionals) =>
            currentProfessionals.filter(
                (professional) => professional.id !== professionalId
            )
        );
    };

    const handleToggleActive = (professionalId) => {
        setProfessionals((currentProfessionals) =>
            currentProfessionals.map((professional) =>
                professional.id === professionalId
                    ? {
                        ...professional,
                        active: professional.active === false ? true : false,
                    }
                    : professional
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

            for (const professionalId of deletedProfessionalIds) {
                await deleteProfessional(professionalId);
            }

            const savedProfessionals = [];

            for (const professional of professionals) {
                if (!professional.name.trim()) continue;

                if (String(professional.id).startsWith('local-')) {
                    const createdProfessional = await createProfessional({
                        businessId,
                        professional,
                    });

                    savedProfessionals.push(createdProfessional);
                } else {
                    const updatedProfessional = await updateProfessional(
                        professional.id,
                        professional
                    );

                    savedProfessionals.push(updatedProfessional);
                }
            }

            setProfessionals(savedProfessionals);
            setDeletedProfessionalIds([]);
            alert('Personal guardado');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo guardar el personal.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gradient p-4 md:p-6">
            <div className="lg:max-w-4/5 md:max-w-10/12 mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-white/80 hover:text-white cursor-pointer flex items-center gap-2 mb-6"
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
                            Personal
                        </h1>

                        <p className="text-white/70 mt-1">
                            Administra los profesionales que atienden turnos.
                        </p>
                    </div>

                    <button
                        onClick={handleAddProfessional}
                        disabled={isLoading || isSaving}
                        className="bg-brand-accent hover:bg-brand-accent-light disabled:opacity-60 text-brand-text font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        Nuevo profesional
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
                                Cargando personal...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* <div className="hidden md:grid grid-cols-[1fr_150px_1fr_140px_90px_120px_60px] gap-3 px-4 mb-3 text-xs font-bold uppercase tracking-wide text-brand-text/50">
                                <span>Nombre</span>
                                <span>Teléfono</span>
                                <span>Correo</span>
                                <span>Rol</span>
                                <span>Estado</span>
                                <span></span>
                            </div> */}

                            <div className="space-y-3">
                                {professionals.map((professional) => (
                                    <div
                                        key={professional.id}
                                        className="grid grid-cols-1 md:grid-cols-grid-cols-[1fr_150px_1fr_140px_90px_120px_60px] gap-3 items-end md:items-center bg-brand-surface border border-gray-200 rounded-2xl p-4"
                                    >
                                        <label>
                                            <span className="block  text-xs font-bold text-brand-text/50 mb-1">
                                                Nombre
                                            </span>

                                            <input
                                                value={professional.name}
                                                onChange={(e) =>
                                                    handleProfessionalChange(
                                                        professional.id,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nombre"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>

                                        <label>
                                            <span className="block   text-xs font-bold text-brand-text/50 mb-1">
                                                Teléfono
                                            </span>

                                            <input
                                                value={professional.phone || ''}
                                                onChange={(e) =>
                                                    handleProfessionalChange(
                                                        professional.id,
                                                        'phone',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="WhatsApp"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>

                                        <label>
                                            <span className="block   text-xs font-bold text-brand-text/50 mb-1">
                                                Correo
                                            </span>

                                            <input
                                                type="email"
                                                value={professional.email || ''}
                                                onChange={(e) =>
                                                    handleProfessionalChange(
                                                        professional.id,
                                                        'email',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="correo@email.com"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>

                                        <label>
                                            <span className="block text-xs font-bold text-brand-text/50 mb-1">
                                                Rol
                                            </span>

                                            <input
                                                value={professional.role || ''}
                                                onChange={(e) =>
                                                    handleProfessionalChange(
                                                        professional.id,
                                                        'role',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Rol (ej: Peluquero)"
                                                className="w-full bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                                            />
                                        </label>
                                        <label>
                                            <span className="block text-xs font-bold text-brand-text/50 mb-1">
                                                Color
                                            </span>

                                            <input
                                                type="color"
                                                value={professional.color || '#2D7A5F'}
                                                onChange={(e) =>
                                                    handleProfessionalChange(
                                                        professional.id,
                                                        'color',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green p-1 cursor-pointer transition-colors
               [&::-webkit-color-swatch-wrapper]:p-0 
               [&::-webkit-color-swatch]:border-0 
               [&::-webkit-color-swatch]:rounded-lg"
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(professional.id)}
                                            className={`px-3 py-3 rounded-xl text-sm font-bold ${professional.active === false
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-emerald-50 text-emerald-700'
                                                }`}
                                        >
                                            {professional.active === false ? 'Inactivo' : 'Activo'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProfessional(professional.id)}
                                            className="justify-self-end md:justify-self-center text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {professionals.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-brand-text/60 mb-4">
                                        Todavía no hay profesionales cargados.
                                    </p>

                                    <button
                                        onClick={handleAddProfessional}
                                        className="bg-brand-green text-white font-bold px-5 py-3 rounded-xl"
                                    >
                                        Crear primer profesional
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-brand-green hover:bg-brand-dark-bg disabled:opacity-60 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-6"
                            >
                                <Save size={18} />
                                {isSaving ? 'Guardando...' : 'Guardar personal'}
                            </button>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ProfessionalsAdminPage;