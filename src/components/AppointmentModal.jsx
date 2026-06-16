import { X } from 'lucide-react';

function AppointmentModal({
    mode,
    appointment,
    selectedSlot,
    services,
    professionals,
    onClose,
    onCreateAppointment,
    onUpdateAppointmentStatus,
}) {
    const isViewMode = mode === 'view';

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const selectedService = services.find(
            (service) => service.id === formData.get('serviceId')
        );

        const selectedProfessional = professionals.find(
            (professional) => professional.id === formData.get('professionalId')
        );

        const newAppointment = {
            id: crypto.randomUUID(),
            customerName: formData.get('customerName'),
            customerPhone: formData.get('customerPhone'),
            serviceName: selectedService?.name || 'Servicio',
            serviceId: selectedService?.id,
            professionalName: selectedProfessional?.name || 'Profesional',
            professionalId: selectedProfessional?.id,
            start: selectedSlot.start,
            end: addMinutesToDateTime(
                selectedSlot.start,
                Number(selectedService?.duration || 30)
            ),
            date: selectedSlot.start.split('T')[0],
            time: selectedSlot.start.split('T')[1]?.slice(0, 5),
            status: formData.get('status'),
            price: Number(selectedService?.price || 0),
        };

        onCreateAppointment(newAppointment);
    };

    const statusLabels = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        completed: 'Completado',
        cancelled: 'Cancelado',
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <div className="bg-brand-bg rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-brand-text/60 hover:text-brand-text"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-brand-text mb-2">
                    {isViewMode ? 'Detalle del turno' : 'Nuevo turno'}
                </h2>

                <p className="text-sm text-brand-text/60 mb-6">
                    {isViewMode
                        ? 'Información registrada para esta reserva.'
                        : 'Carga los datos para crear una nueva reserva.'}
                </p>

                {isViewMode ? (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Info label="Cliente" value={appointment.customerName} />
                            <Info label="Teléfono" value={appointment.customerPhone} />
                            <Info label="Servicio" value={appointment.serviceName} />
                            <Info label="Profesional" value={appointment.professionalName} />
                            <Info label="Inicio" value={formatDateTime(appointment.start)} />
                            <Info label="Fin" value={formatDateTime(appointment.end)} />
                            <Info label="Estado" value={statusLabels[appointment.status] || appointment.status} />
                            <Info label="Precio" value={`$${appointment.price}`} />
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <p className="text-sm font-bold text-brand-text mb-3">
                                Cambiar estado
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => onUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                    disabled={appointment.status === 'confirmed'}
                                    className="bg-blue-50 text-blue-700 border border-blue-200 disabled:opacity-40 font-bold py-3 rounded-xl hover:bg-blue-100 transition-all"
                                >
                                    Confirmar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onUpdateAppointmentStatus(appointment.id, 'completed')}
                                    disabled={appointment.status === 'completed'}
                                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 disabled:opacity-40 font-bold py-3 rounded-xl hover:bg-emerald-100 transition-all"
                                >
                                    Completar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onUpdateAppointmentStatus(appointment.id, 'cancelled')}
                                    disabled={appointment.status === 'cancelled'}
                                    className="bg-red-50 text-red-700 border border-red-200 disabled:opacity-40 font-bold py-3 rounded-xl hover:bg-red-100 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="customerName"
                            placeholder="Nombre del cliente"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                            required
                        />

                        <input
                            name="customerPhone"
                            placeholder="Teléfono / WhatsApp"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                            required
                        />

                        <select
                            name="serviceId"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                            required
                        >
                            <option value="">Seleccionar servicio</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} · ${service.price}
                                </option>
                            ))}
                        </select>

                        <select
                            name="professionalId"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                            required
                        >
                            <option value="">Seleccionar profesional</option>
                            {professionals.map((professional) => (
                                <option key={professional.id} value={professional.id}>
                                    {professional.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="status"
                            defaultValue="confirmed"
                            className="w-full bg-brand-surface text-brand-text border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-green"
                        >
                            <option value="confirmed">Confirmado</option>
                            <option value="pending">Pendiente</option>
                        </select>

                        <div className="bg-brand-surface rounded-xl p-3 text-sm text-brand-text/70">
                            <p>Inicio: {selectedSlot?.start}</p>
                            <p>Fin: se calculará según la duración del servicio</p>                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-accent hover:bg-brand-accent-light text-brand-text font-bold py-3.5 rounded-xl transition-all"
                        >
                            Guardar turno
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="bg-brand-surface rounded-xl p-3">
            <p className="text-xs text-brand-text/50">{label}</p>
            <p className="font-semibold text-brand-text">{value}</p>
        </div>
    );
}

function formatDateTime(dateTime) {
    if (!dateTime) return '-';

    const [datePart, timePart] = dateTime.split('T');

    if (!datePart || !timePart) return dateTime;

    const [year, month, day] = datePart.split('-');
    const time = timePart.slice(0, 5);

    return `${day}/${month}/${year} ${time}`;
}

function addMinutesToDateTime(dateTime, minutes) {
    const date = new Date(dateTime);
    date.setMinutes(date.getMinutes() + minutes);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${mins}:00`;
}
export default AppointmentModal;