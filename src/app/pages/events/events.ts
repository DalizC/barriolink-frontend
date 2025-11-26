import { CommonModule, registerLocaleData } from "@angular/common";
import {
  Component,
  ViewChild,
  TemplateRef,
  OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import localeEs from "@angular/common/locales/es";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EventService } from "../../core/services/event.service";
import { Event as EventModel } from "../../core/models/event.model";
import {
  CalendarModule,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from "angular-calendar";

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  },
  green: {
    primary: "#10b981",
    secondary: "#D1FAE5"
  },
  purple: {
    primary: "#6366f1",
    secondary: "#E0E7FF"
  }
};

registerLocaleData(localeEs);

@Component({
  selector: "app-events",
  templateUrl: "./events.html",
  styleUrls: ["./events.scss"],
  imports: [
    CommonModule,
    CalendarModule,
    NgbProgressbarModule,
    // otros módulos necesarios
  ]
})
export class Events implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;

  readonly CalendarView = CalendarView;

  view: CalendarView = CalendarView.Month;

  viewDate = new Date();

  modalData: { action: string; event: CalendarEvent } | undefined;
  loading: boolean = true;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Editar",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        if (event.meta?.eventId) {
          this.router.navigate(['/events/edit', event.meta.eventId]);
        }
      }
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Eliminar",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        if (confirm('¿Está seguro de eliminar este evento?')) {
          this.deleteEventById(event.meta?.eventId);
        }
      }
    }
  ];

  refresh: Subject<void> = new Subject<void>();

  activeDayIsOpen: boolean = true;
  openDayEvents: CalendarEvent[] = [];
  openDayDate: Date | null = null;

  events: CalendarEvent[] = [];

  constructor(
    private modal: NgbModal,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents({ is_active: true }).subscribe({
      next: (response) => {
        this.events = this.transformEventsToCalendar(response.results);
        this.loading = false;
        this.refresh.next();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  transformEventsToCalendar(events: EventModel[]): CalendarEvent[] {
    const calendarEvents: CalendarEvent[] = [];

    events.forEach(event => {
      const color = this.getColorByStatus(event.status);
      const startDate = new Date(event.start_datetime);
      const endDate = event.end_datetime ? new Date(event.end_datetime) : startDate;

      // Si el evento NO es recurrente o es 'none', agregar como evento único
      if (!event.recurrence_type || event.recurrence_type === 'none') {
        calendarEvents.push({
          start: startDate,
          end: endDate,
          title: event.title,
          color: color,
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: false,
            afterEnd: false
          },
          draggable: false,
          meta: {
            eventId: event.id,
            description: event.description,
            location: event.location || event.facility_name || 'Sin ubicación',
            status: event.status,
            organizer: event.organizer_name,
            requiresRegistration: event.requires_registration,
            capacity: event.capacity,
            hasCost: event.has_cost,
            costAmount: event.cost_amount
          }
        });
      } else {
        // Para eventos recurrentes, expandir las ocurrencias
        const occurrences = this.expandRecurringEvent(event);
        occurrences.forEach(occurrence => {
          calendarEvents.push({
            start: occurrence.start,
            end: occurrence.end,
            title: event.title,
            color: color,
            actions: this.actions,
            allDay: false,
            resizable: {
              beforeStart: false,
              afterEnd: false
            },
            draggable: false,
            meta: {
              eventId: event.id,
              description: event.description,
              location: event.location || event.facility_name || 'Sin ubicación',
              status: event.status,
              organizer: event.organizer_name,
              requiresRegistration: event.requires_registration,
              capacity: event.capacity,
              hasCost: event.has_cost,
              costAmount: event.cost_amount,
              isRecurring: true
            }
          });
        });
      }
    });

    return calendarEvents;
  }

  expandRecurringEvent(event: EventModel): { start: Date; end: Date }[] {
    const occurrences: { start: Date; end: Date }[] = [];
    const startDate = new Date(event.start_datetime);
    const endDate = event.recurrence_end_date
      ? new Date(event.recurrence_end_date)
      : addDays(startDate, 365); // Default: 1 año si no hay fecha fin

    console.log('=== EXPANDIENDO EVENTO RECURRENTE ===');
    console.log('Título:', event.title);
    console.log('Tipo recurrencia:', event.recurrence_type);
    console.log('Días de semana:', event.recurrence_days_of_week);
    console.log('Fecha inicio:', startDate);
    console.log('Fecha fin:', endDate);

    // Extraer hora de inicio y fin del evento original
    const eventStartTime = startDate.getHours() * 60 + startDate.getMinutes();
    const eventEndTime = event.end_datetime
      ? new Date(event.end_datetime).getHours() * 60 + new Date(event.end_datetime).getMinutes()
      : eventStartTime + 60;

    console.log('Hora inicio (minutos):', eventStartTime);
    console.log('Hora fin (minutos):', eventEndTime);

    // Para eventos semanales con días específicos
    if (event.recurrence_type === 'weekly' && event.recurrence_days_of_week) {
      const daysOfWeek = event.recurrence_days_of_week.split(',').map(d => parseInt(d.trim()));
      console.log('Días de semana parseados:', daysOfWeek);

      let currentDate = new Date(startDate);
      currentDate.setHours(0, 0, 0, 0);

      let iterationCount = 0;
      while (currentDate <= endDate && iterationCount < 1000) { // Límite de seguridad
        iterationCount++;
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // Convertir domingo=0 a lunes=0

        if (daysOfWeek.includes(dayOfWeek)) {
          const occurrenceStart = new Date(currentDate);
          occurrenceStart.setHours(Math.floor(eventStartTime / 60), eventStartTime % 60, 0, 0);

          const occurrenceEnd = new Date(currentDate);
          occurrenceEnd.setHours(Math.floor(eventEndTime / 60), eventEndTime % 60, 0, 0);

          console.log(`Ocurrencia ${occurrences.length + 1}:`, occurrenceStart.toISOString(), '->', occurrenceEnd.toISOString());

          occurrences.push({
            start: occurrenceStart,
            end: occurrenceEnd
          });
        }

        currentDate = addDays(currentDate, 1);
      }

      console.log('Total ocurrencias generadas:', occurrences.length);
    }
    // Para eventos mensuales
    else if (event.recurrence_type === 'monthly') {
      let currentDate = new Date(startDate);
      const dayOfMonth = startDate.getDate();

      while (currentDate <= endDate) {
        const occurrenceStart = new Date(currentDate);
        occurrenceStart.setDate(dayOfMonth);
        occurrenceStart.setHours(Math.floor(eventStartTime / 60), eventStartTime % 60, 0, 0);

        const occurrenceEnd = new Date(occurrenceStart);
        occurrenceEnd.setHours(Math.floor(eventEndTime / 60), eventEndTime % 60, 0, 0);

        if (occurrenceStart <= endDate) {
          occurrences.push({
            start: occurrenceStart,
            end: occurrenceEnd
          });
        }

        // Avanzar al siguiente mes
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    // Para eventos con intervalo personalizado (anual = 12 meses)
    else if (event.recurrence_type === 'custom' && event.recurrence_interval) {
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const occurrenceStart = new Date(currentDate);
        occurrenceStart.setHours(Math.floor(eventStartTime / 60), eventStartTime % 60, 0, 0);

        const occurrenceEnd = new Date(currentDate);
        occurrenceEnd.setHours(Math.floor(eventEndTime / 60), eventEndTime % 60, 0, 0);

        occurrences.push({
          start: occurrenceStart,
          end: occurrenceEnd
        });

        // Avanzar según el intervalo (en meses)
        currentDate.setMonth(currentDate.getMonth() + event.recurrence_interval);
      }
    }

    console.log('=================================');
    return occurrences;
  }

  getColorByStatus(status: string): any {
    switch (status) {
      case 'scheduled':
        return colors.blue;
      case 'completed':
        return colors.green;
      case 'cancelled':
        return colors.red;
      case 'pending':
        return colors.yellow;
      default:
        return colors.purple;
    }
  }

  deleteEventById(eventId: number): void {
    if (!eventId) return;

    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.meta?.eventId !== eventId);
        this.refresh.next();
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        alert('Error al eliminar el evento. Por favor intente nuevamente.');
      }
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        this.openDayEvents = [];
        this.openDayDate = null;
      } else {
        this.viewDate = date;
        this.openDayEvents = [...events];
        this.openDayDate = date;
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  addEvent(): void {
    this.events = [...this.events, {
      title: "Nueva Tarea",
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
    if (view !== CalendarView.Month) {
      this.closeOpenMonthViewDay();
    }
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
    this.openDayEvents = [];
    this.openDayDate = null;
  }

  trackByEventTitle(index: number, event: CalendarEvent): string {
    return `${event.title}-${event.start?.toString() ?? index}`;
  }
}
