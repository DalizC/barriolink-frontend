import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login {
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastrService);
  private authService = inject(AuthService);

  public show: boolean = false;
  public loginForm: FormGroup;
  public validate: boolean = false;
  public loading: boolean = false;
  private returnUrl: string = '/dashboard/default';

  constructor() {
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard/default']);
    }

    // Obtener URL de retorno si existe
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/dashboard/default';
    });

    this.loginForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(5)
      ]),
    });
  }

  showPassword() {
    this.show = !this.show;
  }

  login() {
    this.validate = true;

    if (this.loginForm.invalid) {
      this.toast.error("Por favor completa todos los campos correctamente", "", {
        positionClass: "toast-top-right",
        closeButton: true,
        timeOut: 2000,
      });
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).subscribe({
      next: () => {
        this.toast.success("Inicio de sesión exitoso", "", {
          positionClass: "toast-top-right",
          closeButton: true,
          timeOut: 2000,
        });

        // Esperar un momento para que se cargue el usuario
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error de login:', err);

        let errorMessage = "Error al iniciar sesión";
        if (err.status === 400 || err.status === 401) {
          errorMessage = "Email o contraseña incorrectos";
        } else if (err.status === 0) {
          errorMessage = "No se puede conectar al servidor";
        }

        this.toast.error(errorMessage, "", {
          positionClass: "toast-top-right",
          closeButton: true,
          timeOut: 3000,
        });
      }
    });
  }
}

