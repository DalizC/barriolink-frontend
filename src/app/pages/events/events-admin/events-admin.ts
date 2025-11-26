import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDatepickerModule, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IRecentOrders, IAttendee } from '../../../shared/interface/events/events';
import { ITableConfigs, ICardToggleOptions } from '../../../shared/interface/common';
import { DataTable } from '../../../shared/components/ui/datatable/datatable';
import { CardDropdownButton } from '../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-events-admin',
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDatepickerModule, DataTable, NgxSpinnerModule, CardDropdownButton],
  templateUrl: './events-admin.html',
  styleUrl: './events-admin.scss'
})
export class EventsAdmin implements OnInit {
  private calendar = inject(NgbCalendar);
  private formatter = inject(NgbDateParserFormatter);
  private eventService = inject(EventService);
  private spinner = inject(NgxSpinnerService);

  public activeTab: string = 'all';
  public searchText: string = '';
  private allData: any[] = [];

  // Date range picker
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null = null;
  public toDate: NgbDate | null = null;
  public showDatePicker: boolean = false;

  // Opciones del menú dropdown
  public filterMenuOptions: ICardToggleOptions[] = [
    { id: 1, title: 'Exportar Excel' },
    { id: 2, title: 'Exportar PDF' },
    { id: 3, title: 'Limpiar filtros' },
    {
      id: 4,
      title: 'Modo compacto',
      switch: { class: 'primary', value: false }
    },
  ];

  // Cache de asistentes por evento para evitar requests duplicados
  private attendeesCache: Map<number, IAttendee[]> = new Map();
  public loadingAttendees: Set<number> = new Set();
  public loading: boolean = false;
  public attendeesTableConfig: ITableConfigs<IAttendee> = {
    columns: [
      { title: 'Nombre', field_value: 'name', sort: true },
      { title: 'Email', field_value: 'email', sort: true },
      { title: 'Teléfono', field_value: 'phone', sort: true },
      { title: 'Fecha Registro', field_value: 'registered_date', sort: true },
      { title: 'Estado', field_value: 'status', sort: true },
    ],
    data: []
  };
  public tableConfig: ITableConfigs<any> = {
    columns: [
      { title: 'Título', field_value: 'title', sort: true },
      { title: 'Ubicación', field_value: 'location', sort: true },
      { title: 'Instalación', field_value: 'facility_name', sort: true },
      { title: 'Fecha Inicio', field_value: 'start_datetime', sort: true },
      { title: 'Fecha Fin', field_value: 'end_datetime', sort: true },
      { title: 'Estado', field_value: 'status', sort: true },
      { title: 'Activo', field_value: 'is_active', sort: true },
    ],
    row_action: [
      { label: 'Ver', icon: 'eye', path: '/events/' },
      { label: 'Editar', icon: 'edit', path: '/events/edit/' },
      { label: 'Eliminar', icon: 'trash' },
    ],
    data: []
  };

  ngOnInit(): void {
    this.loadEvents();
  }

  /**
   * Cargar eventos desde el API
   */
  private loadEvents(): void {
    this.loading = true;
    this.spinner.show();
    this.eventService.getEvents().subscribe({
      next: (response) => {
        // Mapear eventos del API a formato de la tabla
        const eventData = response.results.map(event => ({
          id: event.id,
          title: event.title,
          location: event.location || '-',
          facility_name: event.facility_name || '-',
          start_datetime: this.formatDateTime(event.start_datetime),
          end_datetime: event.end_datetime ? this.formatDateTime(event.end_datetime) : '-',
          status: this.formatStatus(event.status),
          is_active: event.is_active ? '<span class="badge badge-light-success">Activo</span>' : '<span class="badge badge-light-danger">Inactivo</span>',
          // Datos adicionales para acciones
          _raw: event
        }));

        // Crear nueva referencia para detectar cambios
        this.tableConfig = {
          ...this.tableConfig,
          data: eventData
        };
        this.allData = [...eventData];
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  /**
   * Formatear fecha y hora
   */
  private formatDateTime(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatear estado del evento
   */
  private formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': '<span class="badge badge-light-secondary">Pendiente</span>',
      'scheduled': '<span class="badge badge-light-primary">Programado</span>',
      'cancelled': '<span class="badge badge-light-danger">Cancelado</span>',
      'completed': '<span class="badge badge-light-success">Completado</span>'
    };
    return statusMap[status] || status;
  }

  constructor() {
    // Inicialización en ngOnInit
  }

  /**
   * Filtra los datos de la tabla según el status seleccionado en el tab
   * @param status - Estado a filtrar: 'all', 'success', 'warning', 'danger'
   */
  public filterByStatus(status: string): void {
    this.activeTab = status;
    this.applyFilters();
  }

  /**
   * Maneja la búsqueda de eventos
   */
  public onSearch(): void {
    this.applyFilters();
  }

  /**
   * Aplica todos los filtros (status y búsqueda) a los datos
   */
  private applyFilters(): void {
    let filteredData = [...this.allData];

    // Filtrar por status (deshabilitado por ahora, tabs no implementados)
    // if (this.activeTab !== 'all') {
    //   filteredData = filteredData.filter(event => event.status === this.activeTab);
    // }

    // Filtrar por búsqueda
    if (this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filteredData = filteredData.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower) ||
        (event.facility_name && event.facility_name.toLowerCase().includes(searchLower))
      );
    }

    // Crear nueva referencia del tableConfig para forzar detección de cambios
    this.tableConfig = {
      ...this.tableConfig,
      data: filteredData
    };
  }

  /**
   * Obtiene el conteo de eventos por status
   * @param status - Estado a contar
   * @returns Número de eventos con ese status
   */
  public getStatusCount(status: string): number {
    if (status === 'all') {
      return this.allData.length;
    }
    // Deshabilitado por ahora (tabs no implementados)
    return 0;
  }

  /**
   * Obtiene los asistentes de un evento específico
   * Carga los datos desde el servidor si no están en caché
   * @param eventId - ID del evento
   * @returns Configuración de tabla con los asistentes del evento
   */
  public getAttendeesForEvent(eventId: number): ITableConfigs<IAttendee> {
    // Si no están en caché, cargarlos
    if (!this.attendeesCache.has(eventId) && !this.loadingAttendees.has(eventId)) {
      this.loadAttendees(eventId);
    }

    return {
      ...this.attendeesTableConfig,
      data: this.attendeesCache.get(eventId) || []
    };
  }

  /**
   * Carga los asistentes de un evento desde el servidor
   * @param eventId - ID del evento
   */
  private loadAttendees(eventId: number): void {
    this.loadingAttendees.add(eventId);
    this.spinner.show(`attendees-${eventId}`);

    // TODO: Implementar servicio HTTP
    // this.eventService.getEventAttendees(eventId).subscribe({
    //   next: (attendees) => {
    //     this.attendeesCache.set(eventId, attendees);
    //     this.loadingAttendees.delete(eventId);
    //     this.spinner.hide(`attendees-${eventId}`);
    //   },
    //   error: (err) => {
    //     console.error('Error cargando asistentes:', err);
    //     this.loadingAttendees.delete(eventId);
    //     this.spinner.hide(`attendees-${eventId}`);
    //   }
    // });

    // MOCK: Por ahora no hay datos de asistentes
    setTimeout(() => {
      this.attendeesCache.set(eventId, []);
      this.loadingAttendees.delete(eventId);
      this.spinner.hide(`attendees-${eventId}`);
    }, 500);
  }

  /**
   * Verifica si los asistentes de un evento están cargando
   * @param eventId - ID del evento
   * @returns true si está cargando
   */
  public isLoadingAttendees(eventId: number): boolean {
    return this.loadingAttendees.has(eventId);
  }

  /**
   * Navega a vista completa de asistentes (placeholder para implementar routing)
   * @param eventId - ID del evento
   */
  public viewAllAttendees(eventId: number): void {
    // TODO: Implementar navegación a vista detallada de asistentes
    // Ejemplo: this.router.navigate(['/events', eventId, 'attendees']);
    console.log('Ver todos los asistentes del evento:', eventId);
  }

  /**
   * Toggle del date picker
   */
  public toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  /**
   * Maneja la selección de fechas en el rango
   */
  public onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.showDatePicker = false;
      this.applyFilters();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  /**
   * Verifica si una fecha está en el rango seleccionado
   */
  public isHovered(date: NgbDate): boolean {
    return !!this.fromDate && !this.toDate && !!this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  /**
   * Verifica si una fecha está dentro del rango
   */
  public isInside(date: NgbDate): boolean {
    return !!this.toDate && date.after(this.fromDate!) && date.before(this.toDate);
  }

  /**
   * Verifica si una fecha es parte del rango (inicio, fin o dentro)
   */
  public isRange(date: NgbDate): boolean {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  /**
   * Limpia el rango de fechas seleccionado
   */
  public clearDateRange(): void {
    this.fromDate = null;
    this.toDate = null;
    this.applyFilters();
  }

  /**
   * Obtiene el texto formateado del rango de fechas
   */
  public getDateRangeText(): string {
    if (!this.fromDate) return 'Seleccionar rango';
    if (!this.toDate) return this.formatter.format(this.fromDate);
    return `${this.formatter.format(this.fromDate)} - ${this.formatter.format(this.toDate)}`;
  }
}
