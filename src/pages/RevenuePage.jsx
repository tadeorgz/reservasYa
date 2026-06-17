import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, DollarSign, CalendarDays, Scissors, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getCurrentBusinessId } from '../services/currentBusinessService';
import { getAppointmentsByBusinessId } from '../services/appointmentService';

import {
    getRevenueAppointments,
    getRevenueByProfessional,
    getRevenueByService,
    getRevenueStats,
} from '../utils/revenueUtils';

function RevenuePage() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadAppointments() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const businessId = await getCurrentBusinessId();
                const appointmentsFromDb = await getAppointmentsByBusinessId(businessId);

                setAppointments(appointmentsFromDb);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message || 'No se pudieron cargar los ingresos.');
            } finally {
                setIsLoading(false);
            }
        }

        loadAppointments();
    }, []);

    const stats = useMemo(() => {
        return getRevenueStats(appointments);
    }, [appointments]);

    const revenueByProfessional = useMemo(() => {
        return getRevenueByProfessional(appointments);
    }, [appointments]);

    const revenueByService = useMemo(() => {
        return getRevenueByService(appointments);
    }, [appointments]);

    const completedAppointments = useMemo(() => {
        return getRevenueAppointments(appointments).sort(
            (a, b) => new Date(b.start) - new Date(a.start)
        );
    }, [appointments]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-6">
                <div className="bg-brand-bg rounded-3xl p-8 shadow-2xl">
                    <p className="text-brand-text/70 font-semibold">
                        Cargando ingresos...
                    </p>
                </div>
            </div>
        );
    }
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

                <header className="mb-8">
                    <p className="text-white/70 text-sm">
                        Panel de gestión
                    </p>

                    <h1 className="text-3xl font-bold text-white">
                        Ingresos
                    </h1>

                    <p className="text-white/70 mt-1">
                        Reporte simple basado en turnos completados.
                    </p>
                </header>
                {errorMessage && (
                    <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold mb-6">
                        {errorMessage}
                    </p>
                )}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                        title="Ingresos hoy"
                        value={`$${stats.todayRevenue}`}
                        icon={<DollarSign size={20} />}
                    />

                    <MetricCard
                        title="Ingresos del mes"
                        value={`$${stats.monthRevenue}`}
                        icon={<CalendarDays size={20} />}
                    />

                    <MetricCard
                        title="Turnos completados"
                        value={stats.completedAppointments}
                        icon={<Scissors size={20} />}
                    />

                    <MetricCard
                        title="Ticket promedio"
                        value={`$${stats.averageTicket}`}
                        icon={<DollarSign size={20} />}
                    />
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    <ReportCard title="Ingresos por profesional" icon={<Users size={18} />}>
                        <div className="space-y-3">
                            {revenueByProfessional.map((item) => (
                                <ReportRow
                                    key={item.id}
                                    name={item.name}
                                    count={item.count}
                                    total={item.total}
                                />
                            ))}

                            {revenueByProfessional.length === 0 && (
                                <EmptyText text="Todavía no hay ingresos por profesional." />
                            )}
                        </div>
                    </ReportCard>

                    <ReportCard title="Ingresos por servicio" icon={<Scissors size={18} />}>
                        <div className="space-y-3">
                            {revenueByService.map((item) => (
                                <ReportRow
                                    key={item.id}
                                    name={item.name}
                                    count={item.count}
                                    total={item.total}
                                />
                            ))}

                            {revenueByService.length === 0 && (
                                <EmptyText text="Todavía no hay ingresos por servicio." />
                            )}
                        </div>
                    </ReportCard>
                </section>

                <section className="bg-brand-bg rounded-3xl shadow-2xl border border-white/10 p-5 md:p-6">
                    <h2 className="text-xl font-bold text-brand-text mb-5">
                        Turnos cobrados
                    </h2>

                    <div className="space-y-3">
                        {completedAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px_100px] gap-3 items-center bg-brand-surface border border-gray-200 rounded-2xl p-4"
                            >
                                <div>
                                    <p className="font-bold text-brand-text">
                                        {appointment.customerName}
                                    </p>
                                    <p className="text-sm text-brand-text/60">
                                        {appointment.serviceName}
                                    </p>
                                </div>

                                <p className="text-sm text-brand-text/70">
                                    {appointment.professionalName}
                                </p>

                                <p className="text-sm text-brand-text/70">
                                    {formatDateTime(appointment.start)}
                                </p>

                                <p className="font-bold text-brand-text">
                                    ${appointment.price}
                                </p>
                            </div>
                        ))}

                        {completedAppointments.length === 0 && (
                            <EmptyText text="Todavía no hay turnos completados." />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon }) {
    return (
        <div className="bg-brand-bg rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
                <p className="text-xs sm:text-sm text-brand-text/60 font-medium truncate pr-1">
                    {title}
                </p>

                <div className="text-brand-text/50 hidden sm:block">
                    {icon}
                </div>
            </div>

            <p className="text-xl sm:text-3xl font-bold text-brand-text truncate">
                {value}
            </p>
        </div>
    );
}

function ReportCard({ title, icon, children }) {
    return (
        <section className="bg-brand-bg rounded-3xl shadow-2xl border border-white/10 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5 text-brand-text">
                {icon}
                <h2 className="font-bold">
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
}

function ReportRow({ name, count, total }) {
    return (
        <div className="flex items-center justify-between bg-brand-surface border border-gray-200 rounded-2xl p-4">
            <div>
                <p className="font-bold text-brand-text">
                    {name}
                </p>

                <p className="text-xs text-brand-text/60">
                    {count} turno(s)
                </p>
            </div>

            <p className="font-bold text-brand-text">
                ${total}
            </p>
        </div>
    );
}

function EmptyText({ text }) {
    return (
        <div className="text-center py-8">
            <p className="text-brand-text/60 text-sm">
                {text}
            </p>
        </div>
    );
}

function formatDateTime(dateTime) {
    if (!dateTime) return '-';

    const [datePart, timePart] = dateTime.split('T');

    if (!datePart || !timePart) return dateTime;

    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${year} ${timePart.slice(0, 5)}`;
}

export default RevenuePage;