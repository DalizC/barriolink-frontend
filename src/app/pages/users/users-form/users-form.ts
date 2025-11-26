import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './users-form.html',
  styleUrl: './users-form.scss'
})
export class UsersForm {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastrService);

  public show: boolean = false;
  public showConfirm: boolean = false;
  public registerForm: FormGroup;
  public loading: boolean = false;

  constructor() {
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard/default']);
    }

    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  passwordMatchValidator(control: any) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  showPassword() {
    this.show = !this.show;
  }

  showConfirmPassword() {
    this.showConfirm = !this.showConfirm;
  }

  register() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      this.toast.error('Por favor completa todos los campos correctamente', '', {
        positionClass: 'toast-top-right',
        closeButton: true,
        timeOut: 2000,
      });
      return;
    }

    this.loading = true;

    const registerData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.toast.success('Cuenta creada exitosamente. Por favor inicia sesión.', '', {
          positionClass: 'toast-top-right',
          closeButton: true,
          timeOut: 3000,
        });

        // Redirigir al login después de 1 segundo
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al registrar usuario:', err);

        let errorMessage = 'Error al crear la cuenta';
        if (err.status === 400) {
          if (err.error?.email) {
            errorMessage = 'Este email ya está registrado';
          } else {
            errorMessage = err.error?.message || 'Datos inválidos';
          }
        } else if (err.status === 0) {
          errorMessage = 'No se puede conectar al servidor';
        }

        this.toast.error(errorMessage, '', {
          positionClass: 'toast-top-right',
          closeButton: true,
          timeOut: 3000,
        });
      }
    });
  }
}
