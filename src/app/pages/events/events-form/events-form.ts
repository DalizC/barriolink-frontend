import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { FacilityService } from '../../../core/services/facility.service';
import { EventCreate, EventUpdate } from '../../../core/models/event.model';
import { Facility } from '../../../core/models/facility.model';
import { CalendarEvent, CalendarView, CalendarModule } from 'angular-calendar';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CalendarModule],
  templateUrl: './events-form.html',
  styleUrl: './events-form.scss'
})
export class EventsForm implements OnInit {
  @ViewChild('calendarModal') calendarModal!: TemplateRef<any>;

  // Wizard control
  currentStep: number = 1;
  eventType: 'one-time' | 'periodic' | null = null;

  // Step 2: Recurrence properties
  recurrencePeriod: 'weekly' | 'monthly' | 'annually' | null = null;
  timesPerPeriod: number = 1;

  // Step 3: Occurrence details
  occurrences: Array<{
    day?: string;
    date?: Date;
    startTime: string;
    endTime: string;
  }> = [];
  availableDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Step 3: Date range
  startDate: Date | null = null;
  endDate: Date | null = null;
  hasEndDate: boolean = true;

  // Calendar properties
  calendarView: 'month' | 'week' | 'day' = 'month';
  calendarViewDate: Date = new Date();
  calendarEvents: CalendarEvent[] = [];
  calendarRefresh = new Subject<void>();

  // Step 3 calendar preview
  previewCalendarDays: any[] = [];
  currentMonth: Date = new Date();
  existingEvents: any[] = [];
  selectedFacility: Facility | null = null;

  eventForm!: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  facilities: Facility[] = [];
  activeTab: 'basic' | 'location' | 'options' = 'basic';
  selectedDaysOfWeek: number[] = [];
  recurrenceDaysError: string | null = null;

  daysOfWeek = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Lunes', short: 'Lun' },
    { value: 2, label: 'Martes', short: 'Mar' },
    { value: 3, label: 'Miércoles', short: 'Mié' },
    { value: 4, label: 'Jueves', short: 'Jue' },
    { value: 5, label: 'Viernes', short: 'Vie' },
    { value: 6, label: 'Sábado', short: 'Sáb' }
  ];

  get titleLength(): number {
    return this.eventForm.get('title')?.value?.length || 0;
  }

  get showDaysOfWeek(): boolean {
    const recurrenceType = this.eventForm.get('recurrence_type')?.value;
    return recurrenceType === 'weekly';
  }

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get minEndDate(): string {
    return this.startDate ? new Date(this.startDate).toISOString().split('T')[0] : this.minDate;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private facilityService: FacilityService,
    private modalService: NgbModal
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadFacilities();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = +id;
      this.loadEvent(this.eventId);
    }
  }

  initForm(): void {
    const now = new Date();
    const defaultStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const defaultEnd = new Date(defaultStart.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      location: [''],
      address: ['', Validators.maxLength(255)],
      address_url: [''],
      start_datetime: [this.formatDateTimeLocal(defaultStart), Validators.required],
      end_datetime: [this.formatDateTimeLocal(defaultEnd)],
      is_public: [true],
      is_active: [true],
      show_organizer: [true],
      facility_id: [null],
      recurrence_type: ['none'],
      recurrence_count: [null],
      recurrence_end_date: [null],
      recurrence_monthly_mode: ['day_of_month'],
      requires_registration: [false],
      auto_confirm_registration: [true],
      members_only: [false],
      capacity: [null],
      has_cost: [false],
      cost_amount: [0],
      cost_currency: ['CLP']
    });

    // Auto-fill end_datetime when start_datetime changes
    this.eventForm.get('start_datetime')?.valueChanges.subscribe(startValue => {
      if (startValue && !this.eventForm.get('end_datetime')?.value) {
        const start = new Date(startValue);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        this.eventForm.patchValue({ end_datetime: this.formatDateTimeLocal(end) }, { emitEvent: false });
      }
    });

    // Reset days of week when recurrence type changes
    this.eventForm.get('recurrence_type')?.valueChanges.subscribe(recurrenceType => {
      if (recurrenceType === 'none') {
        this.selectedDaysOfWeek = [];
        this.recurrenceDaysError = null;
        this.eventForm.patchValue({ recurrence_count: null }, { emitEvent: false });
      } else if (recurrenceType !== 'weekly') {
        this.selectedDaysOfWeek = [];
        this.recurrenceDaysError = null;
      }
    });
  }

  get maxOccurrences(): number {
    const period = this.eventForm.get('recurrence_type')?.value;
    const limits: { [key: string]: number } = {
      'daily': 364,      // Máximo 364 días (365 = siempre, sin sentido)
      'weekly': 6,       // Máximo 6 días (7 = diario)
      'monthly': 30,     // Máximo 30 días (31 = diario)
      'quarterly': 89,   // Máximo ~89 días
      'semestral': 181,  // Máximo ~181 días
      'yearly': 364      // Máximo 364 días
    };
    return limits[period] || 1;
  }

  // Wizard navigation methods
  selectEventType(type: 'one-time' | 'periodic'): void {
    this.eventType = type;

    if (type === 'periodic') {
      this.eventForm.patchValue({
        recurrence_type: 'weekly'
      });
      // Para eventos periódicos, ir al paso 2 (frecuencia)
      this.currentStep = 2;
    } else {
      this.eventForm.patchValue({
        recurrence_type: 'none'
      });
      // Para eventos de una sola vez, saltar al paso 3 e inicializar una ocurrencia
      this.occurrences = [{
        startTime: '09:00',
        endTime: '10:00'
      }];
      this.currentStep = 3;
    }
  }

  selectRecurrencePeriod(period: 'weekly' | 'monthly' | 'annually'): void {
    this.recurrencePeriod = period;
    this.eventForm.patchValue({
      recurrence_type: period
    });
  }

  initializeOccurrences(): void {
    this.occurrences = [];
    for (let i = 0; i < this.timesPerPeriod; i++) {
      this.occurrences.push({
        startTime: '09:00',
        endTime: '09:30'
      });
    }
  }

  addOccurrence(): void {
    this.occurrences.push({
      startTime: '09:00',
      endTime: '09:30'
    });
  }

  removeOccurrence(index: number): void {
    if (this.occurrences.length > 1) {
      this.occurrences.splice(index, 1);
    }
  }

  getConfiguredCount(): number {
    return this.occurrences.filter(occ => {
      if (this.recurrencePeriod === 'weekly') {
        return occ.day && occ.startTime && occ.endTime;
      }
      return occ.startTime && occ.endTime;
    }).length;
  }

  onFacilityChange(facilityId: string | number): void {
    const id = typeof facilityId === 'string' ? parseInt(facilityId, 10) : facilityId;
    const facility = this.facilities.find(f => f.id === id);
    this.selectedFacility = facility || null;
    if (facility) {
      this.eventForm.patchValue({
        location: facility.name
      });
    }
  }

  onDaySelected(): void {
    // Regenerate calendar when a day is selected
    this.generateCalendarDays();
  }

  toggleEndDate(): void {
    this.hasEndDate = !this.hasEndDate;
    if (!this.hasEndDate) {
      this.endDate = null;
    }
  }

  submitEvent(): void {
    if (this.eventForm.invalid) {
      this.showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    // Initialize with required fields
    let startDatetime = '';
    let endDatetime: string | undefined = undefined;
    let recurrenceType: string = 'none';
    let recurrenceEndDate: string | null = null;
    let recurrenceInterval: number | undefined = undefined;
    let recurrenceDaysOfWeek: string | undefined = undefined;

    if (this.eventType === 'one-time') {
      // For one-time events, use startDate and the first occurrence times
      const occurrence = this.occurrences[0];
      if (this.startDate && occurrence && occurrence.startTime && occurrence.endTime) {
        // Combine date and time
        const dateStr = this.startDate instanceof Date
          ? this.startDate.toISOString().split('T')[0]
          : this.startDate;
        startDatetime = `${dateStr}T${occurrence.startTime}:00`;
        endDatetime = `${dateStr}T${occurrence.endTime}:00`;
      } else {
        this.showNotification('Por favor configura la fecha y hora del evento', 'error');
        return;
      }
    } else if (this.eventType === 'periodic') {
      // For periodic events
      if (!this.startDate || this.occurrences.length === 0) {
        this.showNotification('Por favor configura las ocurrencias y el período del evento', 'error');
        return;
      }

      // Use the first occurrence time for start_datetime
      const firstOccurrence = this.occurrences[0];
      if (!firstOccurrence.startTime || !firstOccurrence.endTime) {
        this.showNotification('Por favor configura los horarios de las ocurrencias', 'error');
        return;
      }

      const startDateStr = this.startDate instanceof Date
        ? this.startDate.toISOString().split('T')[0]
        : this.startDate;

      startDatetime = `${startDateStr}T${firstOccurrence.startTime}:00`;

      // Set end datetime if provided
      if (this.hasEndDate && this.endDate) {
        const endDateStr = this.endDate instanceof Date
          ? this.endDate.toISOString().split('T')[0]
          : this.endDate;
        endDatetime = `${endDateStr}T${firstOccurrence.endTime}:00`;
        recurrenceEndDate = endDateStr;
      }

      // Map recurrence period to backend format
      if (this.recurrencePeriod === 'weekly') {
        recurrenceType = 'weekly';
        recurrenceInterval = 1;
        // Convert selected days to comma-separated string (0=Monday, 6=Sunday)
        const daysMap: { [key: string]: number } = {
          'Lunes': 0, 'Martes': 1, 'Miércoles': 2, 'Jueves': 3,
          'Viernes': 4, 'Sábado': 5, 'Domingo': 6
        };
        const selectedDays = this.occurrences
          .filter(occ => occ.day)
          .map(occ => daysMap[occ.day!])
          .filter(day => day !== undefined)
          .sort()
          .join(',');
        recurrenceDaysOfWeek = selectedDays || '0';
      } else if (this.recurrencePeriod === 'monthly') {
        recurrenceType = 'monthly';
        recurrenceInterval = 1;
      } else if (this.recurrencePeriod === 'annually') {
        recurrenceType = 'custom';
        recurrenceInterval = 12; // 12 months = annually
      }
    }

    // Build the event payload
    const eventData: EventCreate = {
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      location: this.eventForm.value.location,
      facility_id: this.selectedFacility?.id || null,
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      is_public: true,
      members_only: false,
      requires_registration: false,
      auto_confirm_registration: true,
      recurrence_type: recurrenceType,
      recurrence_end_date: recurrenceEndDate,
      recurrence_interval: recurrenceInterval,
      recurrence_days_of_week: recurrenceDaysOfWeek
    };

    // Log del payload antes de enviar
    console.log('=== DATOS DEL EVENTO A ENVIAR ===');
    console.log('Event Type:', this.eventType);
    console.log('Payload completo:', JSON.stringify(eventData, null, 2));
    console.log('=================================');

    // Submit to backend
    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        console.log('Event created successfully:', response);
        this.showNotification('¡Evento creado exitosamente!', 'success');
        setTimeout(() => {
          this.router.navigate(['/events']);
        }, 1500);
      },
      error: (error) => {
        console.error('=== ERROR AL CREAR EVENTO ===');
        console.error('Error completo:', error);
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
        console.error('=============================');
        const errorMessage = error.error?.detail || error.error?.message || 'Error al crear el evento. Por favor intenta nuevamente.';
        this.showNotification(errorMessage, 'error');
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    notification.innerHTML = `
      <strong>${icon}</strong> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 150);
    }, 5000);
  }

  nextStep(): void {
    // Validaciones antes de avanzar
    if (this.currentStep === 1 && !this.eventType) {
      return; // No puede avanzar sin tipo de evento
    }

    if (this.currentStep === 2 && !this.recurrencePeriod) {
      return; // No puede avanzar sin período de recurrencia
    }

    if (this.currentStep === 3 && this.getConfiguredCount() === 0) {
      return; // No puede avanzar sin al menos una ocurrencia configurada
    }

    // Inicializar occurrences al pasar del paso 2 al 3
    if (this.currentStep === 2 && this.recurrencePeriod) {
      this.initializeOccurrences();
      this.loadExistingEvents();
    }

    if (this.currentStep < 5) {
      this.currentStep++;

      // Generar calendario al entrar al paso 3 (solo para eventos periódicos)
      if (this.currentStep === 3 && this.eventType === 'periodic') {
        setTimeout(() => this.generateCalendarDays(), 0);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      // Si estamos en el paso 3 y es un evento de una sola vez, volver al paso 1
      if (this.currentStep === 3 && this.eventType === 'one-time') {
        this.currentStep = 1;
      } else {
        this.currentStep--;
      }
    }
  }

  goToStep(step: number): void {
    // Prevenir acceso al paso 2 si es evento de una sola vez
    if (step === 2 && this.eventType === 'one-time') {
      return;
    }

    // Allow navigation to previous steps or the next immediate step
    if (step < this.currentStep || step === this.currentStep + 1) {
      // Validate current step before moving forward
      if (step > this.currentStep) {
        if (this.currentStep === 1 && !this.eventType) {
          return; // Cannot proceed without event type
        }
        if (this.currentStep === 2 && !this.recurrencePeriod) {
          return; // Cannot proceed without recurrence period
        }
        if (this.currentStep === 3 && this.getConfiguredCount() === 0) {
          return; // Cannot proceed without at least one configured occurrence
        }
      }

      this.currentStep = step;

      // Initialize data when entering certain steps
      if (step === 3 && this.eventType === 'periodic') {
        this.initializeOccurrences();
        this.loadExistingEvents();
        setTimeout(() => this.generateCalendarDays(), 100);
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }

  viewCalendar(): void {
    // Load events for calendar modal
    this.eventService.getEvents({ page_size: 100, is_active: true }).subscribe({
      next: (response) => {
        this.calendarEvents = response.results.map(event => ({
          start: new Date(event.start_datetime),
          end: event.end_datetime ? new Date(event.end_datetime) : undefined,
          title: event.title,
          color: {
            primary: '#6366f1',
            secondary: '#e0e7ff'
          },
          meta: {
            id: event.id,
            description: event.description,
            location: event.location
          }
        }));
        this.calendarRefresh.next();
      },
      error: (error) => {
        console.error('Error loading calendar events:', error);
      }
    });

    // Open modal
    this.modalService.open(this.calendarModal, { size: 'xl' });
  }

  setCalendarView(view: 'month' | 'week' | 'day'): void {
    this.calendarView = view;
  }

  loadExistingEvents(): void {
    this.eventService.getEvents({ page_size: 100, is_active: true }).subscribe({
      next: (response) => {
        this.existingEvents = response.results || [];
        this.generateCalendarDays();
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.existingEvents = [];
      }
    });
  }

  generateCalendarDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get starting day of week (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();

    // Get number of days in month
    const daysInMonth = lastDay.getDate();

    // Calculate days from previous month to show
    const prevMonthDays = startingDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    this.previewCalendarDays = [];

    // Add days from previous month
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      this.previewCalendarDays.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        isSelected: false,
        hasExistingEvent: false
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = this.getDayNameFromDate(date);
      const isSelected = this.isDaySelectedInOccurrences(dayName);
      const hasExistingEvent = this.hasEventOnDate(date);

      this.previewCalendarDays.push({
        date: date,
        isCurrentMonth: true,
        isSelected: isSelected,
        hasExistingEvent: hasExistingEvent
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - this.previewCalendarDays.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      this.previewCalendarDays.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isSelected: false,
        hasExistingEvent: false
      });
    }
  }

  getDayNameFromDate(date: Date): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  }

  isDaySelectedInOccurrences(dayName: string): boolean {
    return this.occurrences.some(occ => occ.day === dayName);
  }

  hasEventOnDate(date: Date): boolean {
    return this.existingEvents.some(event => {
      const eventDate = new Date(event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  changeMonth(direction: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + direction,
      1
    );
    this.generateCalendarDays();
  }

  getWeeksArray(): any[][] {
    const weeks: any[][] = [];
    for (let i = 0; i < this.previewCalendarDays.length; i += 7) {
      weeks.push(this.previewCalendarDays.slice(i, i + 7));
    }
    return weeks;
  }

  loadFacilities(): void {
    this.facilityService.getFacilities({ is_active: true, page_size: 100 }).subscribe({
      next: (response) => {
        this.facilities = response.results;
      },
      error: (error) => {
        console.error('Error loading facilities:', error);
      }
    });
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          location: event.location,
          address: event.address,
          address_url: event.address_url,
          start_datetime: this.formatDateTimeLocal(new Date(event.start_datetime)),
          end_datetime: event.end_datetime ? this.formatDateTimeLocal(new Date(event.end_datetime)) : null,
          is_public: event.is_public,
          is_active: event.is_active,
          show_organizer: true, // Default true, backend no lo soporta aún
          facility_id: event.facility_id,
          recurrence_type: event.recurrence_type,
          recurrence_end_date: event.recurrence_end_date,
          recurrence_count: event.recurrence_count,
          recurrence_monthly_mode: event.recurrence_monthly_mode,
          requires_registration: event.requires_registration,
          auto_confirm_registration: event.auto_confirm_registration,
          members_only: event.members_only,
          capacity: event.capacity,
          has_cost: event.has_cost,
          cost_amount: event.cost_amount,
          cost_currency: event.cost_currency
        });

        // Load days of week if recurrence_days_of_week exists
        if (event.recurrence_days_of_week) {
          this.selectedDaysOfWeek = JSON.parse(event.recurrence_days_of_week);
        }

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el evento';
        this.loading = false;
      }
    });
  }  onSubmit(): void {
    if (this.eventForm.valid) {
      // Validate days of week if required
      if (this.showDaysOfWeek && this.selectedDaysOfWeek.length === 0) {
        this.recurrenceDaysError = 'Selecciona al menos un día de la semana';
        return;
      }

      this.loading = true;
      this.error = null;
      this.recurrenceDaysError = null;

      const formValue = { ...this.eventForm.value };

      // Remove show_organizer (frontend only, backend doesn't support it yet)
      delete formValue.show_organizer;

      // Convert empty capacity to null
      if (!formValue.capacity) {
        formValue.capacity = null;
      }

      // Convert empty facility_id to null
      if (!formValue.facility_id) {
        formValue.facility_id = null;
      }

      // Convert datetime-local format to ISO
      formValue.start_datetime = new Date(formValue.start_datetime).toISOString();
      if (formValue.end_datetime) {
        formValue.end_datetime = new Date(formValue.end_datetime).toISOString();
      }

      // Add recurrence_days_of_week if applicable
      if (this.showDaysOfWeek && this.selectedDaysOfWeek.length > 0) {
        formValue.recurrence_days_of_week = JSON.stringify(this.selectedDaysOfWeek);
      } else {
        formValue.recurrence_days_of_week = null;
      }

      if (this.isEditMode && this.eventId) {
        const eventUpdate: EventUpdate = formValue;
        this.eventService.updateEvent(this.eventId, eventUpdate).subscribe({
          next: () => {
            this.router.navigate(['/events/my-events']);
          },
          error: (error) => {
            this.error = error.error?.detail || 'Error al actualizar el evento';
            this.loading = false;
          }
        });
      } else {
        const eventCreate: EventCreate = formValue;
        this.eventService.createEvent(eventCreate).subscribe({
          next: () => {
            this.router.navigate(['/events/my-events']);
          },
          error: (error) => {
            this.error = error.error?.detail || 'Error al crear el evento';
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }

  isDaySelected(dayValue: number): boolean {
    return this.selectedDaysOfWeek.includes(dayValue);
  }

  onDayToggle(dayValue: number): void {
    const index = this.selectedDaysOfWeek.indexOf(dayValue);
    if (index > -1) {
      this.selectedDaysOfWeek.splice(index, 1);
    } else {
      this.selectedDaysOfWeek.push(dayValue);
    }
    this.selectedDaysOfWeek.sort((a, b) => a - b);
    this.recurrenceDaysError = null;
  }

  getMinRecurrenceEndDate(): string {
    const startDatetime = this.eventForm.get('start_datetime')?.value;
    if (startDatetime) {
      const date = new Date(startDatetime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
    }
    return '';
  }
}
