import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDatepickerModule, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IRecentOrders, IAttendee } from '../../../shared/interface/events/events';
import { ITableConfigs, ICardToggleOptions } from '../../../shared/interface/common';
import { DataTable } from '../../../shared/components/ui/datatable/datatable';
import { CardDropdownButton } from '../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-events-admin',
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDatepickerModule, DataTable, NgxSpinnerModule, CardDropdownButton],
  templateUrl: './events-admin.html',
  styleUrl: './events-admin.scss'
})
export class EventsAdmin {
  private calendar = inject(NgbCalendar);
  private formatter = inject(NgbDateParserFormatter);

  public activeTab: string = 'all';
  public searchText: string = '';
  private allData: IRecentOrders[] = [];

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
  public tableConfig: ITableConfigs<IRecentOrders> = {
    columns: [
      { title: 'Product Name', field_value: 'product_name', sort: true },
      { title: 'Customers', field_value: 'customer_name', sort: true },
      { title: 'Qty', field_value: 'quantity', sort: true, type: 'qty' },
      {
        title: 'Total Price',
        field_value: 'total_price',
        sort: true,
        type: 'price',
      },
      { title: 'Order Date', field_value: 'order_date', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [
      { label: 'View', path: '/events/1' },
      { label: 'Edit', icon: 'edit', path: '/events/1' },
      { label: 'Delete', icon: 'trash' },
      { label: 'Test', icon: 'trash' },
    ],
    data: [
      {
        id: 1,
        product_name: 'Festival de Verano 2025',
        product_image: 'assets/images/events/event1.jpg',
        product_id: 'EVT001',
        customer_name: 'María González',
        quantity: 45,
        total_price: '2250',
        order_date: '2025-01-15',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Festival',
        description: 'Celebración anual con música en vivo, food trucks y actividades para toda la familia. Disfruta de un día lleno de entretenimiento y diversión.',
        attendees: [
          { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '+56 9 1234 5678', registered_date: '2025-01-10', status: 'Confirmado' },
          { id: 2, name: 'María García', email: 'maria@example.com', phone: '+56 9 8765 4321', registered_date: '2025-01-11', status: 'Confirmado' },
          { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '+56 9 5555 6666', registered_date: '2025-01-12', status: 'Pendiente' },
        ]
      },
      {
        id: 2,
        product_name: 'Taller de Cocina',
        product_image: 'assets/images/events/event2.jpg',
        product_id: 'EVT002',
        customer_name: 'Juan Pérez',
        quantity: 20,
        total_price: '800',
        order_date: '2025-01-18',
        status: '<span class="badge badge-light-warning">Pendiente</span>',
        status_color: 'warning',
        category: 'Taller',
        description: 'Aprende técnicas culinarias profesionales con chefs expertos.',
      },
      {
        id: 3,
        product_name: 'Concierto de Jazz',
        product_image: 'assets/images/events/event3.jpg',
        product_id: 'EVT003',
        customer_name: 'Ana Martínez',
        quantity: 150,
        total_price: '9000',
        order_date: '2025-01-20',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Concierto',
        description: 'Una noche inolvidable con las mejores bandas de jazz de la región en un ambiente íntimo y acogedor.',
        attendees: [
          { id: 4, name: 'Ana Martínez', email: 'ana@example.com', phone: '+56 9 7777 8888', registered_date: '2025-01-15', status: 'Confirmado' },
          { id: 5, name: 'Pedro Sánchez', email: 'pedro@example.com', phone: '+56 9 3333 4444', registered_date: '2025-01-16', status: 'Confirmado' },
          { id: 6, name: 'Laura Torres', email: 'laura@example.com', phone: '+56 9 9999 0000', registered_date: '2025-01-17', status: 'Confirmado' },
          { id: 7, name: 'Diego Fernández', email: 'diego@example.com', phone: '+56 9 1111 2222', registered_date: '2025-01-18', status: 'Pendiente' },
        ]
      },
      {
        id: 4,
        product_name: 'Clase de Yoga',
        product_image: 'assets/images/events/event4.jpg',
        product_id: 'EVT004',
        customer_name: 'Carlos Rodríguez',
        quantity: 30,
        total_price: '900',
        order_date: '2025-01-22',
        status: '<span class="badge badge-light-danger">Cancelado</span>',
        status_color: 'danger',
        category: 'Deportivo',
      },
      {
        id: 5,
        product_name: 'Feria Gastronómica',
        product_image: 'assets/images/events/event5.jpg',
        product_id: 'EVT005',
        customer_name: 'Laura Fernández',
        quantity: 200,
        total_price: '8000',
        order_date: '2025-01-25',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Feria',
      },
      {
        id: 6,
        product_name: 'Torneo de Ajedrez',
        product_image: 'assets/images/events/event6.jpg',
        product_id: 'EVT006',
        customer_name: 'Pedro Sánchez',
        quantity: 32,
        total_price: '640',
        order_date: '2025-02-01',
        status: '<span class="badge badge-light-warning">Pendiente</span>',
        status_color: 'warning',
        category: 'Deportivo',
      },
      {
        id: 7,
        product_name: 'Cine al Aire Libre',
        product_image: 'assets/images/events/event7.jpg',
        product_id: 'EVT007',
        customer_name: 'Sofía López',
        quantity: 100,
        total_price: '3000',
        order_date: '2025-02-05',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Cultural',
      },
      {
        id: 8,
        product_name: 'Maratón Comunitaria',
        product_image: 'assets/images/events/event8.jpg',
        product_id: 'EVT008',
        customer_name: 'Diego Torres',
        quantity: 250,
        total_price: '12500',
        order_date: '2025-02-10',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Deportivo',
      },
      {
        id: 9,
        product_name: 'Exposición de Arte',
        product_image: 'assets/images/events/event9.jpg',
        product_id: 'EVT009',
        customer_name: 'Carmen Ruiz',
        quantity: 75,
        total_price: '3750',
        order_date: '2025-02-12',
        status: '<span class="badge badge-light-warning">Pendiente</span>',
        status_color: 'warning',
        category: 'Cultural',
      },
      {
        id: 10,
        product_name: 'Carnaval Barrial',
        product_image: 'assets/images/events/event10.jpg',
        product_id: 'EVT010',
        customer_name: 'Roberto Díaz',
        quantity: 300,
        total_price: '15000',
        order_date: '2025-02-15',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Festival',
      },
      {
        id: 11,
        product_name: 'Taller de Fotografía',
        product_image: 'assets/images/events/event11.jpg',
        product_id: 'EVT011',
        customer_name: 'Isabel Moreno',
        quantity: 15,
        total_price: '900',
        order_date: '2025-02-18',
        status: '<span class="badge badge-light-danger">Cancelado</span>',
        status_color: 'danger',
        category: 'Taller',
      },
      {
        id: 12,
        product_name: 'Noche de Karaoke',
        product_image: 'assets/images/events/event12.jpg',
        product_id: 'EVT012',
        customer_name: 'Francisco Castro',
        quantity: 60,
        total_price: '1800',
        order_date: '2025-02-20',
        status: '<span class="badge badge-light-success">Confirmado</span>',
        status_color: 'success',
        category: 'Recreativo',
      },
    ] as IRecentOrders[],
  };

  constructor(private spinner: NgxSpinnerService) {
    // Normalizar datos: agregar descripción por defecto si no existe
    this.tableConfig.data = this.tableConfig.data.map(event => ({
      ...event,
      description: event.description || '<sin descripción>'
    }));

    // Guardar datos originales
    this.allData = [...this.tableConfig.data];
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

    // Filtrar por status
    if (this.activeTab !== 'all') {
      filteredData = filteredData.filter(event => event.status_color === this.activeTab);
    }

    // Filtrar por búsqueda
    if (this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filteredData = filteredData.filter(event =>
        event.product_name.toString().toLowerCase().includes(searchLower) ||
        event.customer_name.toLowerCase().includes(searchLower) ||
        event.category.toLowerCase().includes(searchLower)
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
    return this.allData.filter(event => event.status_color === status).length;
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
    // this.eventsService.getEventAttendees(eventId).subscribe({
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

    // MOCK: Simulación de datos (remover cuando se implemente el servicio real)
    setTimeout(() => {
      const event = this.allData.find(e => e.id === eventId);
      if (event?.attendees) {
        this.attendeesCache.set(eventId, event.attendees);
      }
      this.loadingAttendees.delete(eventId);
      this.spinner.hide(`attendees-${eventId}`);
    }, 1500);
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
