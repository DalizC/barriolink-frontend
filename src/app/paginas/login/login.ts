import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === '1234') {
      localStorage.setItem('user', this.username);
      localStorage.setItem('rol', 'admin');
      alert('Bienvenido Administrador');
      this.router.navigate(['/admin']); // redirige a admin
    } else if (this.username === 'vecino' && this.password === '1234') {
      localStorage.setItem('user', this.username);
      localStorage.setItem('rol', 'vecino');
      alert('Bienvenido Vecino');
      this.router.navigate(['/noticias']); // redirige a noticias
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
