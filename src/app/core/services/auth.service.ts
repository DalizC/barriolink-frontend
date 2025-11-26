import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginCredentials, LoginResponse, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Cargar usuario desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Realiza login con email y password
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.loadCurrentUser();
        }
      })
    );
  }

  /**
   * Obtiene información del usuario autenticado
   */
  loadCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/me/`).subscribe({
      next: (user) => {
        this.setUser(user);
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.logout();
      }
    });
  }

  /**
   * Registra un nuevo usuario
   */
  register(userData: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create/`, userData);
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: 'admin' | 'manager' | 'registered'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Verifica si el usuario es admin o manager
   */
  isAdminOrManager(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'manager';
  }

  // Métodos privados

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    const token = this.getToken();

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);

        // Verificar que el token aún sea válido haciendo una petición silenciosa
        this.http.get<User>(`${this.apiUrl}/me/`).subscribe({
          next: (freshUser) => {
            // Token válido, actualizar datos del usuario si hay cambios
            this.setUser(freshUser);
          },
          error: (err) => {
            // Token inválido o expirado, limpiar sesión silenciosamente
            if (err.status === 401) {
              console.warn('Token expirado, cerrando sesión...');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              this.currentUserSubject.next(null);
              // No redirigir aquí, dejar que los guards manejen la redirección
            }
          }
        });
      } catch (e) {
        console.error('Error al parsear usuario de localStorage:', e);
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}
