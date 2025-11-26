import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event, EventRegistrationCreate } from '../../../core/models/event.model';

@Component({
  selector: 'app-events-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events-signup.html',
  styleUrl: './events-signup.scss'
})
export class EventsSignup implements OnInit {
  event: Event | null = null;
  registrationForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(+eventId);
    }
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      participant_name: ['', Validators.required],
      participant_email: ['', [Validators.required, Validators.email]],
      participant_phone: ['', Validators.required],
      notes: [''],
      terms: [false, Validators.requiredTrue],
      updates: [false]
    });
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'No se pudo cargar el evento';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid && this.event) {
      this.loading = true;
      this.error = null;

      const registration: EventRegistrationCreate = {
        participant_name: this.registrationForm.value.participant_name,
        participant_email: this.registrationForm.value.participant_email,
        participant_phone: this.registrationForm.value.participant_phone,
        notes: this.registrationForm.value.notes || ''
      };

      this.eventService.registerToEvent(this.event.id, registration).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/events/my-registrations']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.detail || 'Error al registrarse al evento';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDuration(): string {
    if (!this.event?.end_datetime) return '';
    const start = new Date(this.event.start_datetime);
    const end = new Date(this.event.end_datetime);
    const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${hours} horas`;
  }

  getAvailableSpots(): number {
    if (!this.event?.capacity) return 0;
    // TODO: Restar inscripciones confirmadas cuando tengamos ese dato del backend
    return this.event.capacity;
  }
}
