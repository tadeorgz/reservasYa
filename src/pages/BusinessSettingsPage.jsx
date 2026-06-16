import { useEffect, useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { defaultBusinessSettings } from '../data/defaultBusinessSettings';
import { supabase } from '../services/supabaseClient';
import { getCurrentBusinessId } from '../services/currentBusinessService';
import {
    getBusinessSettingsData,
    updateBusinessSettingsData,
} from '../services/businessSettingsService';
import { LogOut } from 'lucide-react';

function BusinessSettingsPage() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(defaultBusinessSettings);
    const [businessId, setBusinessId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadSettings() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const currentBusinessId = await getCurrentBusinessId();
                const settingsFromDb = await getBusinessSettingsData(currentBusinessId);

                setBusinessId(currentBusinessId);
                setSettings(settingsFromDb);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message || 'No se pudo cargar la configuración.');
            } finally {
                setIsLoading(false);
            }
        }

        loadSettings();
    }, []);

    const handleChange = (section, field, value) => {
        setSettings((current) => ({
            ...current,
            [section]: {
                ...current[section],
                [field]: value,
            },
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setErrorMessage('');

            if (!businessId) {
                throw new Error('No se encontró el negocio actual.');
            }

            await updateBusinessSettingsData(businessId, settings);

            alert('Configuración guardada');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo guardar la configuración.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBusinessHourChange = (dayOfWeek, field, value) => {
        setSettings((current) => ({
            ...current,
            businessHours: current.businessHours.map((day) =>
                day.dayOfWeek === dayOfWeek
                    ? {
                        ...day,
                        [field]: value,
                    }
                    : day
            ),
        }));
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
                <div className="bg-brand-bg rounded-3xl p-8 shadow-2xl">
                    <p className="text-brand-text/70 font-semibold">
                        Cargando configuración...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-gradient p-4 md:p-6">
            {/* Contenedor de navegación superior corregido */}
            <div className="lg:max-w-4/5 max-w-11/12 mx-auto flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-white/80 hover:text-white flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Volver al dashboard
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600/80 text-white flex items-center gap-2 font-medium transition-colors cursor-pointer py-2 px-4 rounded-xl"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>

            <div className="lg:max-w-4/5 max-w-11/12 mx-auto">
                <header className="mb-8">
                    <p className="text-white/70 text-sm">Panel de gestión</p>
                    <h1 className="text-3xl font-bold text-white">
                        Configuración del negocio
                    </h1>
                    <p className="text-white/70 mt-1">
                        Define cómo se verá y funcionará tu página de reservas.
                    </p>
                </header>

                <form onSubmit={handleSave} className="space-y-6">
                    {errorMessage && (
                        <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold">
                            {errorMessage}
                        </p>
                    )}
                    <SettingsCard title="Empresa">
                        <Input
                            label="Nombre del negocio"
                            value={settings.company.name}
                            onChange={(value) => handleChange('company', 'name', value)}
                        />

                        <Textarea
                            label="Descripción"
                            value={settings.company.description}
                            onChange={(value) => handleChange('company', 'description', value)}
                        />

                        <Input
                            label="Logo"
                            type="file"
                            onChange={() => { }}
                        />

                        <Input
                            label="URL pública"
                            value={settings.company.publicSlug}
                            onChange={(value) => handleChange('company', 'publicSlug', generateSlug(value))}
                        />

                    </SettingsCard>

                    <SettingsCard title="Horarios del negocio">
                        <div className="md:col-span-2 space-y-3">
                            {settings.businessHours.map((day) => (
                                <div
                                    key={day.dayOfWeek}
                                    className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_120px] gap-3 items-center bg-brand-surface border border-gray-200 rounded-2xl p-4"
                                >
                                    <div>
                                        <p className="font-bold text-brand-text">
                                            {day.dayLabel}
                                        </p>
                                        <p className="text-xs text-brand-text/50">
                                            {day.isOpen ? 'Abierto' : 'Cerrado'}
                                        </p>
                                    </div>

                                    <label className="flex items-center gap-2 text-sm font-semibold text-brand-text">
                                        <input
                                            type="checkbox"
                                            checked={day.isOpen}
                                            onChange={(e) =>
                                                handleBusinessHourChange(
                                                    day.dayOfWeek,
                                                    'isOpen',
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        Abierto
                                    </label>

                                    <input
                                        type="time"
                                        value={day.openTime}
                                        disabled={!day.isOpen}
                                        onChange={(e) =>
                                            handleBusinessHourChange(
                                                day.dayOfWeek,
                                                'openTime',
                                                e.target.value
                                            )
                                        }
                                        className="bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green disabled:opacity-40"
                                    />

                                    <input
                                        type="time"
                                        value={day.closeTime}
                                        disabled={!day.isOpen}
                                        onChange={(e) =>
                                            handleBusinessHourChange(
                                                day.dayOfWeek,
                                                'closeTime',
                                                e.target.value
                                            )
                                        }
                                        className="bg-white text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green disabled:opacity-40"
                                    />
                                </div>
                            ))}
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Personalización">
                        <ColorInput
                            label="Color principal de la página"
                            value={settings.theme.primaryColor}
                            onChange={(value) => handleChange('theme', 'primaryColor', value)}
                        />

                        <ColorInput
                            label="Color de botones generales"
                            value={settings.theme.generalButtonColor}
                            onChange={(value) => handleChange('theme', 'generalButtonColor', value)}
                        />

                        <ColorInput
                            label="Color del botón cancelar"
                            value={settings.theme.cancelButtonColor}
                            onChange={(value) => handleChange('theme', 'cancelButtonColor', value)}
                        />
                    </SettingsCard>

                    <SettingsCard title="Contacto y redes">
                        <Input
                            label="Instagram"
                            value={settings.contact.instagram}
                            onChange={(value) => handleChange('contact', 'instagram', value)}
                        />

                        <Input
                            label="Facebook"
                            value={settings.contact.facebook}
                            onChange={(value) => handleChange('contact', 'facebook', value)}
                        />

                        <Input
                            label="TikTok"
                            value={settings.contact.tiktok}
                            onChange={(value) => handleChange('contact', 'tiktok', value)}
                        />

                        <Input
                            label="Ubicación"
                            value={settings.contact.location}
                            onChange={(value) => handleChange('contact', 'location', value)}
                        />

                        <Input
                            label="WhatsApp"
                            value={settings.contact.whatsapp}
                            onChange={(value) => handleChange('contact', 'whatsapp', value)}
                        />
                    </SettingsCard>

                    <SettingsCard title="Reservas">
                        <Input
                            label="Tiempo mínimo antes de reservar"
                            type="number"
                            value={settings.booking.minHoursBeforeBooking}
                            onChange={(value) =>
                                handleChange('booking', 'minHoursBeforeBooking', Number(value))
                            }
                        />

                        <Input
                            label="Días máximos a futuro"
                            type="number"
                            value={settings.booking.maxDaysInAdvance}
                            onChange={(value) =>
                                handleChange('booking', 'maxDaysInAdvance', Number(value))
                            }
                        />

                        <Select
                            label="Notas de reserva"
                            value={settings.booking.allowBookingNotes ? 'yes' : 'no'}
                            onChange={(value) =>
                                handleChange('booking', 'allowBookingNotes', value === 'yes')
                            }
                            options={[
                                { value: 'yes', label: 'Permitir notas' },
                                { value: 'no', label: 'No permitir notas' },
                            ]}
                        />

                        <Select
                            label="Elección de profesional"
                            value={settings.booking.professionalSelection}
                            onChange={(value) =>
                                handleChange('booking', 'professionalSelection', value)
                            }
                            options={[
                                { value: 'can', label: 'El cliente puede elegir profesional' },
                                { value: 'must', label: 'El cliente debe elegir profesional' },
                                { value: 'cannot', label: 'El cliente no puede elegir profesional' },
                            ]}
                        />
                    </SettingsCard>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-brand-accent hover:bg-brand-accent-light disabled:opacity-60 text-brand-text font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        {isSaving ? 'Guardando...' : 'Guardar configuración'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function SettingsCard({ title, children }) {
    return (
        <section className="bg-brand-bg rounded-3xl shadow-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-brand-text mb-5">
                {title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </section>
    );
}

function Input({ label, value, onChange, type = 'text', placeholder = '' }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-brand-text/70">
                {label}
            </span>

            <input
                type={type}
                value={type === 'file' ? undefined : value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className="mt-2 w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
            />
        </label>
    );
}

function Textarea({ label, value, onChange }) {
    return (
        <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-brand-text/70">
                {label}
            </span>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                className="mt-2 w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green resize-none"
            />
        </label>
    );
}

function ColorInput({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-brand-text/70">
                {label}
            </span>

            <div className="mt-2 flex gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-12 w-16 bg-brand-surface border border-gray-200 rounded-xl"
                />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                />
            </div>
        </label>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-brand-text/70">
                {label}
            </span>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replaceAll(' ', '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '');
}

export default BusinessSettingsPage;