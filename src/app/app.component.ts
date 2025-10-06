import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 importar aquí

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], // 👈 añadir CommonModule
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  year = new Date().getFullYear();

  constructor(private router: Router) {}

  get rol(): string | null {
    return localStorage.getItem('rol');
  }

  get isLoginPage(): boolean {
    return this.router.url === '/';
  }

  logout() {
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}
