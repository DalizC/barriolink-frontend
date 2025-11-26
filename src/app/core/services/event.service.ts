import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventCreate, EventUpdate, EventRegistration, EventRegistrationCreate } from '../models/event.model';

export interface EventListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export interface EventFilters {
  status?: string;
  is_active?: boolean;
  is_public?: boolean;
  organizer?: number;
  facility?: number;
  start_date?: string;
  end_date?: string;
  requires_registration?: boolean;
  members_only?: boolean;
  search?: string;
  order?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://chequered-hortense-homeomorphic.ngrok-free.dev/api/event/';

  constructor(private http: HttpClient) {}

  getEvents(filters?: EventFilters): Observable<EventListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.is_active !== undefined) params = params.set('is_active', filters.is_active.toString());
      if (filters.is_public !== undefined) params = params.set('is_public', filters.is_public.toString());
      if (filters.organizer) params = params.set('organizer', filters.organizer.toString());
      if (filters.facility) params = params.set('facility', filters.facility.toString());
      if (filters.start_date) params = params.set('start_date', filters.start_date);
      if (filters.end_date) params = params.set('end_date', filters.end_date);
      if (filters.requires_registration !== undefined) params = params.set('requires_registration', filters.requires_registration.toString());
      if (filters.members_only !== undefined) params = params.set('members_only', filters.members_only.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.order) params = params.set('order', filters.order);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.page_size) params = params.set('page_size', filters.page_size.toString());
    }

    return this.http.get<EventListResponse>(this.apiUrl, { params });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}${id}/`);
  }

  getEventBySlug(slug: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}slug/${slug}/`);
  }

  createEvent(event: EventCreate): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: number, event: EventUpdate): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}${id}/`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Event Registration methods
  registerToEvent(eventId: number, registration: EventRegistrationCreate): Observable<EventRegistration> {
    return this.http.post<EventRegistration>(`${this.apiUrl}${eventId}/register/`, registration);
  }

  getMyRegistrations(): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(`${this.apiUrl}my-registrations/`);
  }

  cancelRegistration(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}${eventId}/cancel-registration/`, {});
  }
}
