import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from '../../../core/services/facility.service';
import { Facility } from '../../../core/models/facility.model';

@Component({
  selector: 'app-facilities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './facilities-form.html',
  styleUrl: './facilities-form.scss'
})
export class FacilitiesForm implements OnInit {
  facilityForm: FormGroup;
  loading: boolean = false;
  submitting: boolean = false;
  isEditMode: boolean = false;
  facilityId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private facilityService: FacilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.facilityForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      capacity: [null],
      is_active: [true],
      amenities: ['']
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.facilityId = +params['id'];
        this.loadFacility(this.facilityId);
      }
    });
  }

  loadFacility(id: number): void {
    this.loading = true;
    this.facilityService.getFacilityById(id).subscribe({
      next: (facility: Facility) => {
        this.facilityForm.patchValue({
          name: facility.name,
          description: facility.description,
          address: facility.address,
          capacity: facility.capacity,
          is_active: facility.is_active,
          amenities: facility.amenities
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading facility:', error);
        this.errorMessage = 'Error al cargar la instalación';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.facilityForm.invalid) {
      this.facilityForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const facilityData = this.facilityForm.value;

    // Convert empty capacity to null
    if (facilityData.capacity === '' || facilityData.capacity === 0) {
      facilityData.capacity = null;
    }

    const request = this.isEditMode && this.facilityId
      ? this.facilityService.updateFacility(this.facilityId, facilityData)
      : this.facilityService.createFacility(facilityData);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/facilities']);
      },
      error: (error) => {
        console.error('Error saving facility:', error);
        this.errorMessage = error.error?.detail || 'Error al guardar la instalación';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/facilities']);
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.facilityForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.facilityForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['maxLength']) return `Máximo ${field.errors['maxLength'].requiredLength} caracteres`;
    }
    return '';
  }
}

