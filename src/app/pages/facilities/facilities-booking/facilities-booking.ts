import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent, CalendarView, CalendarModule, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameMonth, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/services/event.service';
import { FacilityService } from '../../../core/services/facility.service';
import { Event } from '../../../core/models/event.model';
import { Facility } from '../../../core/models/facility.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#28a745',
    secondary: '#D4EDDA'
  },
  purple: {
    primary: '#6f42c1',
    secondary: '#E2D9F3'
  }
};

@Component({
  selector: 'app-facilities-booking',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './facilities-booking.html',
  styleUrl: './facilities-booking.scss'
})
export class FacilitiesBooking implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen = false;
  openDayEvents: CalendarEvent[] = [];
  openDayDate: Date | null = null;
  modalData?: { action: string; event: CalendarEvent };
  loading = false;
  facilityId?: number;
  facility?: Facility;

  actions = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        const eventId = event.meta?.eventId;
        if (confirm('¿Está seguro que desea eliminar este evento?')) {
          this.deleteEventById(eventId);
        }
      }
    }
  ];

  constructor(
    private modal: NgbModal,
    private eventService: EventService,
    private facilityService: FacilityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facilityId = +id;
      this.loadFacility();
      this.loadEvents();
    }
  }

  loadFacility(): void {
    if (!this.facilityId) return;

    this.facilityService.getFacilityById(this.facilityId).subscribe({
      next: (facility) => {
        this.facility = facility;
      },
      error: (error) => {
        console.error('Error loading facility:', error);
      }
    });
  }

  loadEvents(): void {
    if (!this.facilityId) return;

    this.loading = true;
    this.eventService.getEvents({ facility: this.facilityId }).subscribe({
      next: (response) => {
        const transformedEvents = this.transformEventsToCalendar(response.results);
        this.events = transformedEvents;
        this.refresh.next();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  transformEventsToCalendar(events: Event[]): CalendarEvent[] {
    const calendarEvents: CalendarEvent[] = [];

    events.forEach(event => {
      if (event.recurrence_type !== 'none') {
        const occurrences = this.expandRecurringEvent(event);
        calendarEvents.push(...occurrences);
      } else {
        const calendarEvent: CalendarEvent = {
          start: new Date(event.start_datetime),
          end: event.end_datetime ? new Date(event.end_datetime) : undefined,
          title: event.title,
          color: this.getColorByStatus(event.status),
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          draggable: false,
          meta: {
            eventId: event.id,
            description: event.description,
            location: event.location || event.facility_name || 'Sin ubicación',
            organizer: event.organizer_name,
            status: event.status,
            capacity: event.capacity,
            hasCost: event.has_cost,
            costAmount: event.cost_amount,
            requiresRegistration: event.requires_registration,
            isRecurring: false
          }
        };
        calendarEvents.push(calendarEvent);
      }
    });

    return calendarEvents;
  }

  expandRecurringEvent(event: Event): CalendarEvent[] {
    const occurrences: CalendarEvent[] = [];
    const startDate = new Date(event.start_datetime);
    const endDate = event.end_datetime ? new Date(event.end_datetime) : undefined;
    const eventDuration = endDate ? endDate.getTime() - startDate.getTime() : 0;

    let recurrenceEndDate: Date;
    if (event.recurrence_end_date) {
      recurrenceEndDate = new Date(event.recurrence_end_date);
    } else {
      recurrenceEndDate = new Date(startDate);
      recurrenceEndDate.setFullYear(recurrenceEndDate.getFullYear() + 1);
    }

    const maxOccurrences = 100;
    let currentDate = new Date(startDate);
    let occurrenceCount = 0;

    console.log('=================================');
    console.log('Expanding recurring event:', event.title);
    console.log('Recurrence type:', event.recurrence_type);
    console.log('Start date:', startDate);
    console.log('End date for recurrence:', recurrenceEndDate);

    if (event.recurrence_type === 'weekly' || event.recurrence_type === 'biweekly') {
      const interval = event.recurrence_type === 'weekly' ? 1 : 2;
      const daysOfWeek = event.recurrence_days_of_week
        ? event.recurrence_days_of_week.split(',').map(d => parseInt(d.trim()))
        : [startDate.getDay()];

      console.log('Days of week:', daysOfWeek);
      console.log('Interval (weeks):', interval);

      while (currentDate <= recurrenceEndDate && occurrenceCount < maxOccurrences) {
        if (daysOfWeek.includes(currentDate.getDay())) {
          const occurrenceStart = new Date(currentDate);
          const occurrenceEnd = eventDuration > 0 ? new Date(occurrenceStart.getTime() + eventDuration) : undefined;

          const calendarEvent: CalendarEvent = {
            start: occurrenceStart,
            end: occurrenceEnd,
            title: event.title,
            color: this.getColorByStatus(event.status),
            actions: this.actions,
            allDay: false,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            draggable: false,
            meta: {
              eventId: event.id,
              description: event.description,
              location: event.location || event.facility_name || 'Sin ubicación',
              organizer: event.organizer_name,
              status: event.status,
              capacity: event.capacity,
              hasCost: event.has_cost,
              costAmount: event.cost_amount,
              requiresRegistration: event.requires_registration,
              isRecurring: true
            }
          };

          occurrences.push(calendarEvent);
          occurrenceCount++;
        }
        currentDate.setDate(currentDate.getDate() + (7 * interval));
      }
    } else if (event.recurrence_type === 'monthly') {
      const dayOfMonth = startDate.getDate();

      while (currentDate <= recurrenceEndDate && occurrenceCount < maxOccurrences) {
        const occurrenceStart = new Date(currentDate);
        const occurrenceEnd = eventDuration > 0 ? new Date(occurrenceStart.getTime() + eventDuration) : undefined;

        const calendarEvent: CalendarEvent = {
          start: occurrenceStart,
          end: occurrenceEnd,
          title: event.title,
          color: this.getColorByStatus(event.status),
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          draggable: false,
          meta: {
            eventId: event.id,
            description: event.description,
            location: event.location || event.facility_name || 'Sin ubicación',
            organizer: event.organizer_name,
            status: event.status,
            capacity: event.capacity,
            hasCost: event.has_cost,
            costAmount: event.cost_amount,
            requiresRegistration: event.requires_registration,
            isRecurring: true
          }
        };

        occurrences.push(calendarEvent);
        occurrenceCount++;

        currentDate.setMonth(currentDate.getMonth() + event.recurrence_interval);
        currentDate.setDate(Math.min(dayOfMonth, new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()));
      }
    } else if (event.recurrence_type === 'custom' && event.recurrence_interval > 0) {
      while (currentDate <= recurrenceEndDate && occurrenceCount < maxOccurrences) {
        const occurrenceStart = new Date(currentDate);
        const occurrenceEnd = eventDuration > 0 ? new Date(occurrenceStart.getTime() + eventDuration) : undefined;

        const calendarEvent: CalendarEvent = {
          start: occurrenceStart,
          end: occurrenceEnd,
          title: event.title,
          color: this.getColorByStatus(event.status),
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          draggable: false,
          meta: {
            eventId: event.id,
            description: event.description,
            location: event.location || event.facility_name || 'Sin ubicación',
            organizer: event.organizer_name,
            status: event.status,
            capacity: event.capacity,
            hasCost: event.has_cost,
            costAmount: event.cost_amount,
            requiresRegistration: event.requires_registration,
            isRecurring: true
          }
        };

        occurrences.push(calendarEvent);
        occurrenceCount++;

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
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  requestBooking(): void {
    // Navegar al formulario de eventos con el facility_id como query param
    this.router.navigate(['/events/create'], {
      queryParams: {
        facility: this.facilityId,
        type: 'one-time'
      }
    });
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
      title: "Nueva Reserva",
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
