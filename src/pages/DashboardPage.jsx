import { useEffect, useMemo, useState } from 'react';
import {
    CalendarDays,
    DollarSign,
    Clock,
    Scissors,
    ExternalLink,
    // Plus,
    LayoutDashboard,
    // Calendar,
    Users,
    Settings,
    BriefcaseBusiness,
    Link as LinkIcon,
    Banknote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AppointmentModal from '../components/AppointmentModal';
import DashboardCalendar from '../components/DashboardCalendar';

import { getCurrentProfile } from '../services/currentBusinessService';
import { getServicesByBusinessId } from '../services/serviceService';
import { getProfessionalsByBusinessId } from '../services/professionalService';
import {
    createAppointment,
    getAppointmentsByBusinessId,
    updateAppointmentStatus,
} from '../services/appointmentService';

import { getDashboardStats } from '../utils/dashboardStats';

function DashboardPage() {
    const [businessType, setBusinessType] = useState(null);
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: null,
        appointment: null,
        selectedSlot: null,
    });
    const [business, setBusiness] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const profile = await getCurrentProfile();
                const businessId = profile.business_id;

                const [servicesFromDb, professionalsFromDb, appointmentsFromDb] =
                    await Promise.all([
                        getServicesByBusinessId(businessId),
                        getProfessionalsByBusinessId(businessId),
                        getAppointmentsByBusinessId(businessId),
                    ]);

                setBusiness(profile.businesses);
                setBusinessType(profile.businesses?.business_type || 'Negocio');
                setServices(servicesFromDb);
                setProfessionals(professionalsFromDb);
                setAppointments(appointmentsFromDb);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message || 'No se pudo cargar el dashboard.');
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboardData();
    }, []);


    const businessName = business?.name || 'Mi negocio';
    const publicUrl = business?.slug ? `/reservas/${business.slug}` : '/reservas';

    const navigate = useNavigate();

    const filteredAppointments = useMemo(() => {
        let result = appointments;

        if (selectedProfessional !== 'all') {
            result = result.filter(
                (appointment) => appointment.professionalName === selectedProfessional
            );
        }

        if (selectedStatus !== 'all') {
            result = result.filter(
                (appointment) => appointment.status === selectedStatus
            );
        }

        return result;
    }, [selectedProfessional, selectedStatus, appointments]);

    const handleOpenAppointment = (appointment) => {
        setModalState({
            isOpen: true,
            mode: 'view',
            appointment,
            selectedSlot: null,
        });
    };

    const handleOpenCreateAppointment = (slot) => {
        setModalState({
            isOpen: true,
            mode: 'create',
            appointment: null,
            selectedSlot: slot,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            mode: null,
            appointment: null,
            selectedSlot: null,
        });
    };

    const handleCreateAppointment = async (newAppointment) => {
        try {
            if (!business?.id) {
                throw new Error('No se encontró el negocio actual.');
            }

            const createdAppointment = await createAppointment({
                businessId: business.id,
                appointment: {
                    ...newAppointment,
                    source: 'dashboard_manual',
                },
            });

            setAppointments((currentAppointments) => [
                ...currentAppointments,
                createdAppointment,
            ]);

            handleCloseModal();
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo crear el turno.');
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const updatedAppointment = await updateAppointmentStatus(
                appointmentId,
                newStatus
            );

            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment.id === appointmentId
                        ? updatedAppointment
                        : appointment
                )
            );

            handleCloseModal();
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo actualizar el turno.');
        }
    };

    const stats = useMemo(() => {
        return getDashboardStats(filteredAppointments, services);
    }, [filteredAppointments, services]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
                <div className="bg-brand-bg rounded-3xl p-8 shadow-2xl">
                    <p className="text-brand-text/70 font-semibold">
                        Cargando dashboard...
                    </p>
                </div>
            </div>
        );
    }
    return (
        /* pb-24 en móvil evita que la barra inferior tape el contenido de la página */
        <div className="min-h-screen bg-brand-gradient p-2 md:p-4 pb-24 lg:pb-6">
            <div className="lg:max-w-4/5 md:max-w-10/12 mx-auto flex flex-col gap-6">

                <nav className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto bg-brand-bg border-t lg:border-t-0 lg:border-b border-white/10 px-6 py-2 lg:py-4 flex justify-between items-center z-50 lg:rounded-3xl shadow-2xl backdrop-blur-md bg-brand-bg/95">
                    {/* Logo/Nombre: Solo visible en PC */}
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-bold text-brand-text font-['Pliant'] tracking-wide">
                            ReservaYa
                        </h1>
                        <p className="text-xs text-brand-text/50">Gestión de reservas</p>
                    </div>

                    {/* Menú de Íconos */}
                    <div className="flex w-full lg:w-auto justify-around lg:justify-end items-center gap-1 sm:gap-4">
                        <NavigationItem icon={<LayoutDashboard size={20} />} label="Inicio" active onClick={() => navigate('/dashboard')} />
                        {/* <NavigationItem icon={<Calendar size={20} />} label="Agenda" onClick={() => navigate('/dashboard/agenda')} /> */}
                        <NavigationItem icon={<Scissors size={20} />} label="Servicios" onClick={() => navigate('/dashboard/servicios')} />
                        <NavigationItem icon={<Banknote size={20} />} label="Ingresos" onClick={() => navigate('/dashboard/ingresos')} />
                        <NavigationItem icon={<Users size={20} />} label="Personal" onClick={() => navigate('/dashboard/personal')} />
                        <NavigationItem icon={<BriefcaseBusiness size={20} />} label="Clientes" onClick={() => navigate('/dashboard/clientes')} />
                        <NavigationItem icon={<Settings size={20} />} label="Config" onClick={() => navigate('/dashboard/configuracion')} />
                    </div>
                </nav>

                {/* Panel de Contenido */}
                <main className="w-full">
                    <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6 mt-2">
                        <div>
                            <p className="text-white/70 text-sm">Panel de gestión</p>
                            <h2 className="text-3xl font-bold text-white">{businessName}</h2>
                            <p className="text-white/70 text-sm mt-1">
                                {businessType?.title || 'Negocio'} · Modo{' '}
                                {/* {mockBusinessSettings.bookingMode === 'automatic' ? 'automático' : 'manual'} */}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => window.open(publicUrl, '_blank')}
                                disabled={!business?.slug}
                                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-semibold"
                            >
                                <ExternalLink size={16} />
                                Ver página pública
                            </button>
                            {/*                         

                            <button className="bg-brand-accent hover:bg-brand-accent-light text-brand-text font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                                <Plus size={16} />
                                Nuevo turno
                            </button> */}
                        </div>
                    </header>

                    {errorMessage && (
                        <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold mb-4">
                            {errorMessage}
                        </p>
                    )}

                    {/* Tarjetas de Métricas */}
                    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        <MetricCard title="Turnos de hoy" value={stats.todayAppointments} icon={<CalendarDays size={20} />} />
                        <MetricCard title="Ingresos del mes" value={`$${stats.monthlyIncome}`} icon={<DollarSign size={20} />} />
                        <MetricCard title="Pendientes" value={stats.pendingAppointments} icon={<Clock size={20} />} />
                        <MetricCard title="Servicios activos" value={stats.activeServices} icon={<Scissors size={20} />} />
                    </section>

                    {/* Agenda e Información Secundaria */}
                    {/* FIX 1: Agregamos min-w-0 al grid principal para romper la rigidez nativa de los tracks flex */}
                    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 w-full min-w-0">
                        <div className="w-full min-w-0 overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                                <select
                                    value={selectedProfessional}
                                    onChange={(e) => setSelectedProfessional(e.target.value)}
                                    className="bg-brand-surface border border-gray-200 justify-content rounded-xl p-3 text-sm text-brand-text focus:outline-none focus:border-brand-green w-full sm:w-auto"
                                >
                                    <option value="all">Todos los profesionales</option>
                                    {professionals.map((professional) => (
                                        <option key={professional.id} value={professional.name} className="text-brand-text " >
                                            {professional.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="bg-brand-surface border border-gray-200 rounded-xl p-3 text-sm text-brand-text focus:outline-none focus:border-brand-green w-full sm:w-auto"
                                >
                                    <option value="all">Todos los estados</option>
                                    <option value="pending">Pendientes</option>
                                    <option value="confirmed">Confirmados</option>
                                    <option value="completed">Completados</option>
                                    <option value="cancelled">Cancelados</option>
                                </select>
                            </div>
                            <DashboardCalendar
                                appointments={filteredAppointments}
                                onEventClick={handleOpenAppointment}
                                onDateSelect={handleOpenCreateAppointment}
                            />

                        </div>

                        {/* Paneles laterales informativos */}
                        <aside className="space-y-4 w-full">
                            <InfoPanel title="Página pública" icon={<LinkIcon size={18} />}>
                                <p className="text-sm text-brand-text/60 mb-3">Link de reserva de tus clientes.</p>
                                <div className="bg-brand-surface border border-gray-200 rounded-xl p-3 text-xs text-brand-text break-all">
                                    {publicUrl}
                                </div>
                            </InfoPanel>

                            <InfoPanel title="Servicios activos" icon={<Scissors size={18} />}>
                                <div className="space-y-2">
                                    {services.slice(0, 4).map((service) => (
                                        <div key={service.id} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                            <span className="text-brand-text">{service.name}</span>
                                            <span className="font-semibold text-brand-text">${service.price}</span>
                                        </div>
                                    ))}
                                    {services.length === 0 && (
                                        <p className="text-sm text-brand-text/60">No hay servicios.</p>
                                    )}
                                </div>
                            </InfoPanel>
                        </aside>
                    </section>
                </main>
            </div>
            {modalState.isOpen && (
                <AppointmentModal
                    mode={modalState.mode}
                    appointment={modalState.appointment}
                    selectedSlot={modalState.selectedSlot}
                    services={services}
                    professionals={professionals}
                    onClose={handleCloseModal}
                    onCreateAppointment={handleCreateAppointment}
                    onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                />
            )}
        </div>
    );
}

/* Componente de Navegación Refactorizado e Inteligente */
function NavigationItem({ icon, label, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex cursor-pointer flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl text-[10px] lg:text-sm font-semibold transition-all ${active
                ? 'bg-brand-green/10 text-brand-green lg:bg-brand-green lg:text-white'
                : 'text-brand-text/60 hover:bg-brand-surface lg:hover:bg-brand-surface hover:text-brand-text'
                }`}
        >
            <div className={`${active ? 'scale-110 lg:scale-100' : ''} transition-transform`}>
                {icon}
            </div>
            {/* Ocultamos el texto en pantallas muy chicas para emular Instagram, y lo mostramos a partir de sm/lg */}
            <span className="hidden sm:inline lg:inline">{label}</span>
        </button>
    );
}

function MetricCard({ title, value, icon }) {
    return (
        <div className="bg-brand-bg rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
                <p className="text-xs sm:text-sm text-brand-text/60 font-medium truncate pr-1">{title}</p>
                <div className="text-brand-text/50 hidden sm:block">{icon}</div>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-brand-text truncate">{value}</p>
        </div>
    );
}

function InfoPanel({ title, icon, children }) {
    return (
        <div className="bg-brand-bg rounded-3xl shadow-xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4 text-brand-text font-bold text-sm sm:text-base">
                {icon}
                <h3>{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default DashboardPage;