import { CommonModule, registerLocaleData } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from "@angular/core";
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
import {
  CalendarModule,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from "angular-calendar";

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
  }
};

registerLocaleData(localeEs);

@Component({
  selector: "app-events",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events.html",
  styleUrls: ["./events.scss"],
  imports: [
    CommonModule,
    CalendarModule,
    // otros módulos necesarios
  ]
})
export class Events {
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;

  readonly CalendarView = CalendarView;

  view: CalendarView = CalendarView.Month;

  viewDate = new Date();

  modalData: { action: string; event: CalendarEvent } | undefined;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Editar",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      }
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Eliminar",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      }
    }
  ];

  refresh: Subject<void> = new Subject<void>();

  activeDayIsOpen: boolean = true;
  openDayEvents: CalendarEvent[] = [];
  openDayDate: Date | null = null;

  events: CalendarEvent[] = [
    {
      start: new Date("2025-10-25T19:00:00"),
      title: "Reunión Vecinal",
      meta: {
        description: "Reunión mensual del barrio",
        location: "Plaza Central",
        category: "Comunitario",
      },
    },
    {
      start: new Date("2025-11-05T10:00:00"),
      end: new Date("2024-11-05T12:00:00"),
      title: "Feria de Servicios",
      meta: {
        description: "Muestra de servicios locales",
        location: "Centro Comunitario",
        category: "Comercial",
      },
    },
    {
      start: new Date("2025-11-05T10:00:00"),
      end: new Date("2024-11-05T12:00:00"),
      title: "Feria de Servicios",
      meta: {
        description: "Muestra de servicios locales",
        location: "Centro Comunitario",
        category: "Comercial",
      },
    },
    {
      start: new Date("2025-11-05T10:00:00"),
      end: new Date("2024-11-05T12:00:00"),
      title: "Feria de Servicios",
      meta: {
        description: "Muestra de servicios locales",
        location: "Centro Comunitario",
        category: "Comercial",
      },
    },
    {
      start: new Date("2025-11-05T10:00:00"),
      end: new Date("2024-11-05T12:00:00"),
      title: "Feria de Servicios",
      meta: {
        description: "Muestra de servicios locales",
        location: "Centro Comunitario",
        category: "Comercial",
      },
    },
    {
      start: new Date("2025-11-05T10:00:00"),
      end: new Date("2024-11-05T12:00:00"),
      title: "Feria de Servicios",
      meta: {
        description: "Muestra de servicios locales",
        location: "Centro Comunitario",
        category: "Comercial",
      },
    },
    {
      start: new Date("2025-10-30T08:00:00"),
      title: "Limpieza del Parque",
      meta: {
        description: "Jornada de limpieza voluntaria",
        location: "Parque Barrial",
        category: "Voluntariado",
      },
    },
    {
      start: new Date("2025-10-30T09:00:00"),
      title: "Limpieza del Parque 2",
      meta: {
        description: "Jornada de limpieza voluntaria",
        location: "Parque Barrial",
        category: "Voluntariado",
      },
    },
  ];

  constructor(private modal: NgbModal) {}

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
