import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateService } from '../../../core/services/certificate.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-certificates-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certificates-request.html',
  styleUrl: './certificates-request.scss'
})
export class CertificatesRequest implements OnInit {
  certificateForm!: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  currentUser: User | null = null;
  isAuthenticated = false;
  createdCertificateId: number | null = null;
  showActions = false;
  sendingEmail = false;

  certificateTypes = [
    { value: 'residence', label: 'Certificado de Residencia' }
  ];

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.initForm();
    });
  }

  initForm(): void {
    this.certificateForm = this.fb.group({
      certificate_type: ['residence', Validators.required],
      full_name: [
        { value: this.currentUser?.name || '', disabled: this.isAuthenticated },
        Validators.required
      ],
      address: [
        { value: '', disabled: false },
        Validators.required
      ],
      email: [
        this.currentUser?.email || '',
        [Validators.required, Validators.email]
      ]
    });
  }

  onSubmit(): void {
    if (this.certificateForm.invalid) {
      Object.keys(this.certificateForm.controls).forEach(key => {
        this.certificateForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    // Obtener valores incluso de campos deshabilitados
    const formValue = this.certificateForm.getRawValue();

    this.certificateService.requestCertificate(formValue).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message || '✅ Certificado generado exitosamente.';
        this.createdCertificateId = response.certificate_id || null;
        this.showActions = true;

        // No resetear el form para que el usuario vea sus datos
      },
      error: (error) => {
        this.loading = false;
        console.error('Error requesting certificate:', error);
        this.errorMessage = error.error?.message || error.error?.detail || 'Error al generar el certificado. Por favor intenta nuevamente.';
      }
    });
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  downloadCertificate(): void {
    if (!this.createdCertificateId) return;

    this.loading = true;
    this.certificateService.downloadPdf(this.createdCertificateId).subscribe({
      next: (blob) => {
        this.loading = false;
        // Crear URL del blob y forzar descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificado_${this.createdCertificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error downloading certificate:', error);
        this.errorMessage = 'Error al descargar el certificado. Por favor intenta nuevamente.';
      }
    });
  }

  sendCertificateEmail(): void {
    if (!this.createdCertificateId) return;

    const email = this.certificateForm.get('email')?.value;
    if (!email) {
      this.errorMessage = 'Por favor ingresa un email válido.';
      return;
    }

    this.sendingEmail = true;
    this.errorMessage = null;

    this.certificateService.sendEmail(this.createdCertificateId, email).subscribe({
      next: (response) => {
        this.sendingEmail = false;
        this.successMessage = '📧 Certificado enviado exitosamente a ' + email;
      },
      error: (error) => {
        this.sendingEmail = false;
        console.error('Error sending email:', error);
        this.errorMessage = error.error?.detail || 'Error al enviar el email. Por favor intenta nuevamente.';
      }
    });
  }

  resetForm(): void {
    this.certificateForm.reset({
      certificate_type: 'residence',
      full_name: this.currentUser?.name || '',
      address: '',
      email: this.currentUser?.email || ''
    });
    this.createdCertificateId = null;
    this.showActions = false;
    this.successMessage = null;
    this.errorMessage = null;
  }
}

