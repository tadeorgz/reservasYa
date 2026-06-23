import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { appointmentToCalendarEvent } from '../data/appointmentAdapters';

function DashboardCalendar({ appointments, onEventClick, onDateSelect }) {
    const calendarRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const events = appointments.map(appointmentToCalendarEvent);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');

        const syncCalendarMode = () => {
            const mobile = mediaQuery.matches;
            setIsMobile(mobile);

            const calendarApi = calendarRef.current?.getApi();

            if (calendarApi) {
                calendarApi.changeView(mobile ? 'timeGridDay' : 'timeGridWeek');

                requestAnimationFrame(() => {
                    calendarApi.updateSize();
                });
            }
        };

        syncCalendarMode();

        mediaQuery.addEventListener('change', syncCalendarMode);

        return () => {
            mediaQuery.removeEventListener('change', syncCalendarMode);
        };
    }, []);

    const handleEventClick = (info) => {
        const appointment = info.event.extendedProps.appointment;
        if (!appointment) return;
        onEventClick(appointment);
    };

    const handleDateSelect = (selectInfo) => {
        onDateSelect({
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        });
    };

    return (
        <div className="dashboard-calendar-card">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-brand-text">Agenda</h3>
                <p className="text-sm text-brand-text/60">
                    Vista de turnos por profesional.
                </p>
            </div>

            <div className="dashboard-calendar-container">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
                    locale={esLocale}
                    events={events}
                    selectable
                    selectMirror
                    nowIndicator
                    allDaySlot={false}
                    firstDay={1}
                    slotMinTime="08:00:00"
                    slotMaxTime="22:00:00"
                    slotDuration="00:30:00"
                    slotLabelInterval="01:00"
                    height={isMobile ? 'auto' : '650px'}
                    contentHeight={isMobile ? 'auto' : 650}
                    stickyHeaderDates
                    dayMaxEvents={2}
                    eventClick={handleEventClick}
                    select={handleDateSelect}
                    eventContent={(eventInfo) => {
                        const appointment =
                            eventInfo.event.extendedProps.appointment ||
                            eventInfo.event.extendedProps;

                        if (!appointment) return null;

                        return (
                            <div className="fc-custom-event">
                                <div className="fc-custom-event-time">
                                    {eventInfo.timeText}
                                </div>

                                <div className="fc-custom-event-title">
                                    {appointment.serviceName || eventInfo.event.title}
                                </div>

                                <div className="fc-custom-event-customer">
                                    {appointment.customerName || 'Sin cliente'}
                                </div>
                            </div>
                        );
                    }}
                    headerToolbar={
                        isMobile
                            ? {
                                left: 'prev,next today',
                                center: 'title',
                                right: '',
                            }
                            : {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay',
                            }
                    }
                    buttonText={{
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                    }}
                    dayHeaderFormat={
                        isMobile
                            ? {
                                weekday: 'long',
                            }
                            : {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'numeric',
                            }
                    }
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                />
            </div>
        </div>
    );
}

export default DashboardCalendar;