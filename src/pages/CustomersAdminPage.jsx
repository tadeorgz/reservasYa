import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, User, CalendarDays, DollarSign, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getCurrentBusinessId } from '../services/currentBusinessService';
import { getAppointmentsByBusinessId } from '../services/appointmentService';

import { buildCustomersFromAppointments } from '../utils/customerUtils';

function CustomersAdminPage() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
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
                setErrorMessage(error.message || 'No se pudieron cargar los clientes.');
            } finally {
                setIsLoading(false);
            }
        }

        loadAppointments();
    }, []);

    const customers = useMemo(() => {
        return buildCustomersFromAppointments(appointments);
    }, [appointments]);

    const filteredCustomers = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        if (!normalizedSearch) return customers;

        return customers.filter((customer) =>
            customer.name.toLowerCase().includes(normalizedSearch) ||
            customer.phone.includes(normalizedSearch) ||
            customer.lastServiceName.toLowerCase().includes(normalizedSearch)
        );
    }, [customers, searchTerm]);

    const totalCustomers = customers.length;

    const totalRevenue = customers.reduce(
        (total, customer) => total + customer.totalSpent,
        0
    );

    const recurringCustomers = customers.filter(
        (customer) => customer.bookingsCount > 1
    ).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-6">
                <div className="bg-brand-bg rounded-3xl p-8 shadow-2xl">
                    <p className="text-brand-text/70 font-semibold">
                        Cargando clientes...
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
                            Clientes
                        </h1>

                        <p className="text-white/70 mt-1">
                            Historial generado automáticamente desde las reservas.
                        </p>
                    </div>
                </header>
                {errorMessage && (
                    <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold mb-6">
                        {errorMessage}
                    </p>
                )}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <MetricCard
                        title="Clientes"
                        value={totalCustomers}
                        icon={<User size={20} />}
                    />

                    <MetricCard
                        title="Clientes recurrentes"
                        value={recurringCustomers}
                        icon={<CalendarDays size={20} />}
                    />

                    <MetricCard
                        title="Ingresos registrados"
                        value={`$${totalRevenue}`}
                        icon={<DollarSign size={20} />}
                    />
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
                    <div className="bg-brand-bg rounded-3xl shadow-2xl border border-white/10 p-5 md:p-6">
                        <div className="flex items-center gap-3 bg-brand-surface border border-gray-200 rounded-2xl p-3 mb-5">
                            <Search size={18} className="text-brand-text/50" />

                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre, teléfono o servicio"
                                className="w-full bg-transparent text-brand-text focus:outline-none text-sm"
                            />
                        </div>

                        <div className="hidden md:grid grid-cols-[1fr_140px_130px_150px] gap-3 px-4 mb-3 text-xs font-bold uppercase tracking-wide text-brand-text/50">
                            <span>Cliente</span>
                            <span>Reservas</span>
                            <span>Total</span>
                            <span>Última reserva</span>
                        </div>

                        <div className="space-y-3">
                            {filteredCustomers.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className={`w-full text-left grid grid-cols-1 md:grid-cols-[1fr_140px_130px_150px] gap-3 items-center bg-brand-surface border rounded-2xl p-4 transition-all ${selectedCustomer?.id === customer.id
                                        ? 'border-brand-green'
                                        : 'border-gray-200 hover:border-brand-green/40'
                                        }`}
                                >
                                    <div>
                                        <p className="font-bold text-brand-text">
                                            {customer.name}
                                        </p>

                                        <p className="text-xs text-brand-text/60 flex items-center gap-1 mt-1">
                                            <Phone size={13} />
                                            {customer.phone || 'Sin teléfono'}
                                        </p>
                                    </div>

                                    <p className="text-sm font-semibold text-brand-text">
                                        {customer.bookingsCount} reserva(s)
                                    </p>

                                    <p className="text-sm font-bold text-brand-text">
                                        ${customer.totalSpent}
                                    </p>

                                    <p className="text-sm text-brand-text/60">
                                        {formatDate(customer.lastBookingDate)}
                                    </p>
                                </button>
                            ))}

                            {filteredCustomers.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-brand-text/60">
                                        No hay clientes para mostrar.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="bg-brand-bg rounded-3xl shadow-2xl border border-white/10 p-5 md:p-6 h-fit">
                        {selectedCustomer ? (
                            <CustomerDetail customer={selectedCustomer} />
                        ) : (
                            <div className="text-center py-12">
                                <User className="mx-auto text-brand-text/30 mb-4" size={42} />

                                <h2 className="font-bold text-brand-text mb-2">
                                    Seleccioná un cliente
                                </h2>

                                <p className="text-sm text-brand-text/60">
                                    Acá verás su historial de reservas.
                                </p>
                            </div>
                        )}
                    </aside>
                </section>
            </div>
        </div>
    );
}

function CustomerDetail({ customer }) {
    return (
        <div>
            <h2 className="text-xl font-bold text-brand-text">
                {customer.name}
            </h2>

            <p className="text-sm text-brand-text/60 mt-1">
                {customer.phone || 'Sin teléfono'}
            </p>

            <div className="grid grid-cols-2 gap-3 my-5">
                <SmallStat label="Reservas" value={customer.bookingsCount} />
                <SmallStat label="Total" value={`$${customer.totalSpent}`} />
            </div>

            <h3 className="font-bold text-brand-text mb-3">
                Historial
            </h3>

            <div className="space-y-3">
                {customer.appointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="bg-brand-surface border border-gray-200 rounded-2xl p-4"
                    >
                        <p className="font-bold text-brand-text">
                            {appointment.serviceName}
                        </p>

                        <p className="text-sm text-brand-text/60">
                            {formatDate(appointment.date)} · {appointment.time}
                        </p>

                        <p className="text-sm text-brand-text/60">
                            Profesional: {appointment.professionalName}
                        </p>

                        <p className="text-sm font-bold text-brand-text mt-2">
                            ${appointment.price}
                        </p>
                    </div>
                ))}
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

function SmallStat({ label, value }) {
    return (
        <div className="bg-brand-surface border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-brand-text/50">
                {label}
            </p>

            <p className="font-bold text-brand-text">
                {value}
            </p>
        </div>
    );
}

function formatDate(date) {
    if (!date) return 'Sin fecha';

    return new Date(`${date}T00:00:00`).toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default CustomersAdminPage;