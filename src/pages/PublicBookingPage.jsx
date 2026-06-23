import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, MessageCircle, Clock, CheckCircle, Edit2 } from 'lucide-react';

import { defaultBusinessSettings } from '../data/defaultBusinessSettings';
import {
    createPublicAppointment,
    getPublicBookingDataBySlug,
} from '../services/publicBookingService';

function PublicBookingPage() {
    const { slug } = useParams();

    const [settings, setSettings] = useState(defaultBusinessSettings);
    const [services, setServices] = useState([]);
    const [isValidSlug, setIsValidSlug] = useState(true);

    const [selectedService, setSelectedService] = useState(null);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [bookingCreated, setBookingCreated] = useState(false);
    const [professionals, setProfessionals] = useState([]);

    const [business, setBusiness] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [existingAppointments, setExistingAppointments] = useState([]);

    const [createdAppointment, setCreatedAppointment] = useState(null);

    useEffect(() => {
        async function loadPublicBookingData() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                setIsValidSlug(true);

                const data = await getPublicBookingDataBySlug(slug);

                setBusiness(data.business);
                setSettings(data.settings);
                setServices(data.services);
                setProfessionals(data.professionals);
                setExistingAppointments(data.appointments || []);
            } catch (error) {
                console.error(error);
                setIsValidSlug(false);
            } finally {
                setIsLoading(false);
            }
        }

        loadPublicBookingData();
    }, [slug]);

    function hasAppointmentOverlap({ appointments = [], professionalId, start, end }) {
        return appointments.some((appointment) => {
            if (appointment.professionalId !== professionalId) return false;
            if (appointment.status === 'cancelled') return false;

            return start < appointment.end && end > appointment.start;
        });
    }

    const availableDates = useMemo(() => {
        const today = new Date();

        const maxDaysToShow = Math.min(
            Number(settings.booking.maxDaysInAdvance || 7),
            30
        );

        return Array.from({ length: maxDaysToShow }, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);

            const dayOfWeek = date.getDay();
            const businessDay = settings.businessHours.find(
                (day) => day.dayOfWeek === dayOfWeek
            );

            return {
                value: toDateInputValue(date),
                label: date.toLocaleDateString('es-UY', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                }),
                isOpen: businessDay?.isOpen,
                openTime: businessDay?.openTime,
                closeTime: businessDay?.closeTime,
            };
        }).filter((date) => date.isOpen);
    }, [settings.businessHours]);

    const availableTimes = useMemo(() => {
        if (!selectedDate || !selectedService || !selectedProfessional) return [];

        const date = new Date(`${selectedDate}T00:00:00`);
        const dayOfWeek = date.getDay();

        const businessDay = settings.businessHours.find(
            (day) => day.dayOfWeek === dayOfWeek
        );

        if (!businessDay?.isOpen) return [];

        const serviceDuration = selectedService.duration || 30;

        const allSlots = generateTimeSlots(
            businessDay.openTime,
            businessDay.closeTime,
            serviceDuration
        );

        return allSlots.filter((time) => {
            const start = `${selectedDate}T${time}:00`;
            const end = addMinutesToDateTime(start, serviceDuration);

            if (!isAfterMinimumBookingTime(start, settings.booking.minHoursBeforeBooking)) {
                return false;
            }

            return !hasAppointmentOverlap({
                appointments: existingAppointments,
                professionalId: selectedProfessional.id,
                start,
                end,
            });
        });
    }, [
        selectedDate,
        selectedService,
        selectedProfessional,
        settings.businessHours,
        existingAppointments,
    ]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !business ||
            !selectedService ||
            !selectedProfessional ||
            !selectedDate ||
            !selectedTime
        ) {
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage('');

            const start = `${selectedDate}T${selectedTime}:00`;
            const end = addMinutesToDateTime(
                start,
                selectedService.duration || 30
            );

            const newAppointment = {
                customerName,
                customerPhone,
                notes,
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                professionalId: selectedProfessional.id,
                professionalName: selectedProfessional.name,
                date: selectedDate,
                time: selectedTime,
                start,
                end,
                status: settings.booking.autoConfirmAppointments ? 'confirmed' : 'pending',
                price: Number(selectedService.price || 0),
            };

            await createPublicAppointment({
                businessId: business.id,
                appointment: newAppointment,
            });

            setCreatedAppointment({
                ...newAppointment,
                businessId: business.id,
            });

            setExistingAppointments((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    businessId: business.id,
                    professionalId: selectedProfessional.id,
                    date: selectedDate,
                    start,
                    end,
                    status: newAppointment.status,
                },
            ]);

            setBookingCreated(true);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'No se pudo crear la reserva.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isValidSlug) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-6">
                <div className="bg-brand-bg rounded-3xl p-8 max-w-md text-center">
                    <h1 className="text-2xl font-bold text-brand-text mb-2">
                        Página no encontrada
                    </h1>
                    <p className="text-brand-text/60">
                        No encontramos una página de reservas para esta URL.
                    </p>
                </div>
            </div>
        );
    }

    const theme = settings.theme;
    const company = settings.company;
    const contact = settings.contact;
    const bookingRules = settings.booking || {};
    const professionalSelection = bookingRules.professionalSelection || 'can';
    const shouldShowProfessionalStep = professionalSelection !== 'cannot';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-6">
                <div className="bg-brand-bg rounded-3xl p-8 max-w-md text-center">
                    <p className="text-brand-text/60 font-semibold">
                        Cargando página de reservas...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-4 md:p-6"
            style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, #0D231B)`,
            }}
        >
            <div className="lg:max-w-4/5 md:max-w-10/12 mx-auto">
                <header className="bg-brand-bg rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
                    <p className="text-sm font-semibold text-brand-text/50 mb-1">
                        Reservas online
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
                        {company.name || 'Mi negocio'}
                    </h1>

                    {company.description && (
                        <p className="text-brand-text/70 mt-3 max-w-2xl">
                            {company.description}
                        </p>
                    )}
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    <section className="bg-brand-bg rounded-3xl shadow-2xl p-6 h-fit">
                        {bookingCreated ? (
                            <div className="text-center py-12">
                                <CheckCircle className="mx-auto text-brand-green mb-4" size={52} />

                                <h2 className="text-2xl font-bold text-brand-text mb-2">
                                    Reserva creada
                                </h2>

                                <p className="text-brand-text/60 mb-6">
                                    Tu turno quedó registrado correctamente.
                                </p>

                                {contact.whatsapp && createdAppointment && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.open(
                                                buildBusinessWhatsappConfirmationUrl({
                                                    businessWhatsapp: contact.whatsapp,
                                                    appointment: createdAppointment,
                                                    businessName: company.name,
                                                }),
                                                '_blank'
                                            );
                                        }}
                                        className="w-full cursor-pointer max-w-sm mx-auto mb-3 bg-brand-green text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all"
                                    >
                                        <MessageCircle size={18} />
                                        Enviar confirmación por WhatsApp
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedService(null);
                                        setSelectedProfessional(null);
                                        setSelectedDate('');
                                        setSelectedTime('');
                                        setCustomerName('');
                                        setCustomerPhone('');
                                        setNotes('');
                                        setBookingCreated(false);
                                        setCreatedAppointment(null);
                                    }}
                                    className="bg-brand-green cursor-pointer text-white font-bold px-5 py-3 rounded-xl"
                                >
                                    Hacer otra reserva
                                </button>
                            </div>
                        ) : (

                            <form onSubmit={handleSubmit} className="space-y-6">


                                {/* PASO 1: SERVICIOS (Siempre visible) */}
                                <BookingStep
                                    number="1"
                                    title="Elegí un servicio"
                                    isCompleted={!!selectedService}
                                    onEdit={() => {
                                        setSelectedService(null);
                                        setSelectedProfessional(null);
                                        setSelectedDate('');
                                        setSelectedTime('');
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map((service) => (
                                            <button
                                                type="button"
                                                key={service.id}
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setSelectedDate('');
                                                    setSelectedTime('');

                                                    if (professionalSelection === 'cannot') {
                                                        setSelectedProfessional(getAutoSelectedProfessional(professionals));
                                                    } else {
                                                        setSelectedProfessional(null);
                                                    }
                                                }}
                                                className={`text-left border rounded-2xl cursor-pointer p-5 transition-all ${selectedService?.id === service.id
                                                    ? 'bg-brand-green text-white border-brand-green'
                                                    : 'bg-brand-surface border-gray-200 text-brand-text hover:scale-[1.01]'
                                                    }`}
                                            >
                                                <h3 className="font-bold text-lg">{service.name}</h3>
                                                <p className="text-sm opacity-70 mt-1">{service.duration} min</p>
                                                <p className="text-2xl font-bold mt-4">${service.price}</p>
                                            </button>
                                        ))}
                                    </div>
                                </BookingStep>

                                {/* PASO 2: PROFESIONAL (Requiere Servicio) */}
                                {selectedService && shouldShowProfessionalStep && (<BookingStep
                                    number="2"
                                    title="Elegí profesional"
                                    isCompleted={!!selectedProfessional}
                                    onEdit={() => {
                                        setSelectedProfessional(null);
                                        setSelectedDate('');
                                        setSelectedTime('');
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {professionals.map((professional) => (
                                            <button
                                                type="button"
                                                key={professional.id}
                                                onClick={() => setSelectedProfessional(professional)}
                                                className={`text-left cursor-pointer border rounded-2xl p-5 transition-all ${selectedProfessional?.id === professional.id
                                                    ? 'bg-brand-green text-white border-brand-green'
                                                    : 'bg-brand-surface border-gray-200 text-brand-text hover:scale-[1.01]'
                                                    }`}
                                            >
                                                <h3 className="font-bold">{professional.name}</h3>
                                                <p className="text-sm opacity-70">{professional.role}</p>
                                            </button>
                                        ))}
                                    </div>
                                </BookingStep>
                                )}

                                {/* PASO 3: FECHA (Requiere Profesional) */}
                                {selectedProfessional && (
                                    <BookingStep
                                        number="3"
                                        title="Elegí día"
                                        isCompleted={!!selectedDate}
                                        onEdit={() => {
                                            setSelectedDate('');
                                            setSelectedTime('');
                                        }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {availableDates.map((date) => (
                                                <button
                                                    type="button"
                                                    key={date.value}
                                                    onClick={() => {
                                                        setSelectedDate(date.value);
                                                        setSelectedTime('');
                                                    }}
                                                    className={`border rounded-2xl cursor-pointer p-4 text-sm font-bold transition-all ${selectedDate === date.value
                                                        ? 'bg-brand-green text-white border-brand-green'
                                                        : 'bg-brand-surface border-gray-200 text-brand-text'
                                                        }`}
                                                >
                                                    {date.label}
                                                </button>
                                            ))}
                                        </div>
                                    </BookingStep>
                                )}

                                {/* PASO 4: HORA (Requiere Fecha) */}
                                {selectedDate && (
                                    <BookingStep
                                        number="4"
                                        title="Elegí hora"
                                        isCompleted={!!selectedTime}
                                        onEdit={() => setSelectedTime('')}
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {availableTimes.map((time) => (
                                                <button
                                                    type="button"
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`border rounded-xl cursor-pointer p-3 text-sm font-bold transition-all ${selectedTime === time
                                                        ? 'bg-brand-green text-white border-brand-green'
                                                        : 'bg-brand-surface border-gray-200 text-brand-text'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}

                                            {availableTimes.length === 0 && (
                                                <p className="text-sm text-brand-text/60 col-span-full">
                                                    No hay horarios disponibles para este día.
                                                </p>
                                            )}
                                        </div>
                                    </BookingStep>
                                )}

                                {/* PASO 5: DATOS DE CONTACTO Y CONFIRMACIÓN (Requiere Hora) */}
                                {selectedTime && (
                                    <BookingStep number="5" title="Tus datos" isCompleted={false}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="Nombre completo"
                                                className="bg-brand-surface border border-gray-200 rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-green"
                                                required
                                            />

                                            <input
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                placeholder="WhatsApp (ej: 099123456)"
                                                className="bg-brand-surface border border-gray-200 rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-green"
                                                required
                                            />

                                            {settings.booking.allowBookingNotes && (
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Notas u observaciones especiales para el profesional..."
                                                    className="md:col-span-2 bg-brand-surface border border-gray-200 rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-green resize-none"
                                                    rows={3}
                                                />
                                            )}
                                        </div>
                                        {errorMessage && (
                                            <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-semibold">
                                                {errorMessage}
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full text-white font-bold py-4 rounded-2xl mt-4 cursor-pointer shadow-lg hover:opacity-95 disabled:opacity-60 transition-all"
                                            style={{ backgroundColor: theme.generalButtonColor }}
                                        >
                                            {isSubmitting ? 'Creando reserva...' : 'Confirmar reserva'}
                                        </button>
                                    </BookingStep>
                                )}
                            </form>
                        )}
                    </section>

                    <aside className="space-y-4 h-fit">
                        <InfoCard title="Horarios" icon={<Clock size={18} />}>
                            <div className="space-y-2">
                                {settings.businessHours.map((day) => (
                                    <div
                                        key={day.dayOfWeek}
                                        className="flex justify-between text-sm border-b border-gray-100 pb-2"
                                    >
                                        <span className="text-brand-text font-semibold">
                                            {day.dayLabel}
                                        </span>
                                        <span className="text-brand-text/60">
                                            {day.isOpen
                                                ? `${day.openTime} - ${day.closeTime}`
                                                : 'Cerrado'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>

                        <InfoCard title="Contacto" icon={<MessageCircle size={18} />}>
                            <div className="space-y-3 text-sm text-brand-text/70">
                                {contact.whatsapp && (
                                    <p className="flex items-center gap-2">
                                        <MessageCircle size={16} />
                                        {contact.whatsapp}
                                    </p>
                                )}

                                {contact.location && (
                                    <p className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {contact.location}
                                    </p>
                                )}
                            </div>
                        </InfoCard>
                    </aside>
                </main>
            </div>
        </div>
    );
}

// Subcomponente de Pasos optimizado con estado de completado y acción de edición
function BookingStep({ number, title, children, isCompleted, onEdit }) {
    return (
        <section className={`border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 transition-opacity duration-300`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted
                        ? 'bg-brand-text/20 text-brand-text/60'
                        : 'bg-brand-green text-white'
                        }`}>
                        {number}
                    </span>

                    <h2 className={`text-xl font-bold transition-colors ${isCompleted ? 'text-brand-text/40 line-through decoration-1' : 'text-brand-text'
                        }`}>
                        {title}
                    </h2>
                </div>

                {isCompleted && onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="text-xs flex items-center gap-1 text-brand-green hover:underline font-medium cursor-pointer"
                    >
                        <Edit2 size={12} />
                        Modificar
                    </button>
                )}
            </div>

            {/* Si ya está completado, ocultamos las opciones detalladas para limpiar la interfaz */}
            {!isCompleted && <div className="animate-fadeIn">{children}</div>}
        </section>
    );
}

function InfoCard({ title, icon, children }) {
    return (
        <section className="bg-brand-bg rounded-3xl shadow-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-brand-text">
                {icon}
                <h2 className="font-bold">{title}</h2>
            </div>
            {children}
        </section>
    );
}

// Funciones utilitarias se mantienen igual...
function generateTimeSlots(openTime, closeTime, durationMinutes) {
    const slots = [];
    let current = timeToMinutes(openTime);
    const end = timeToMinutes(closeTime);

    while (current + durationMinutes <= end) {
        slots.push(minutesToTime(current));
        current += durationMinutes;
    }
    return slots;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function addMinutesToDateTime(dateTime, minutes) {
    const [datePart, timePart] = dateTime.split('T');
    const [hours, mins] = timePart.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + Number(minutes);
    const finalHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const finalMinutes = String(totalMinutes % 60).padStart(2, '0');
    return `${datePart}T${finalHours}:${finalMinutes}:00`;
}

function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getAutoSelectedProfessional(professionals) {
    return professionals[0] || null;
}

function isAfterMinimumBookingTime(start, minHoursBeforeBooking) {
    const startDate = new Date(start);
    const minimumDate = new Date();

    minimumDate.setHours(
        minimumDate.getHours() + Number(minHoursBeforeBooking || 0)
    );

    return startDate >= minimumDate;
}

function buildBusinessWhatsappConfirmationUrl({
    businessWhatsapp,
    appointment,
    businessName,
}) {
    const phone = normalizeUruguayPhone(businessWhatsapp);

    const message = `Hola, hice una reserva desde AgendasYa.

Negocio: ${businessName || 'el negocio'}
Nombre: ${appointment.customerName}
WhatsApp: ${appointment.customerPhone}
Servicio: ${appointment.serviceName}
Profesional: ${appointment.professionalName}
Día: ${formatBookingDate(appointment.date)}
Hora: ${appointment.time}

¿Me confirman si está todo correcto?`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function normalizeUruguayPhone(phone) {
    const cleaned = String(phone || '').replace(/\D/g, '');

    if (cleaned.startsWith('598')) return cleaned;

    return `598${cleaned}`;
}

function formatBookingDate(dateValue) {
    if (!dateValue) return '-';

    const date = new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString('es-UY', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default PublicBookingPage;