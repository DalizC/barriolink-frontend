import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facility, FacilityCreate, FacilityUpdate } from '../models/facility.model';

export interface FacilityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Facility[];
}

export interface FacilityFilters {
  search?: string;
  capacity_min?: number;
  capacity_max?: number;
  is_active?: boolean;
  order?: string; // 'name', '-name', 'capacity', '-capacity', 'created_at', '-created_at'
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FacilityService {
  private apiUrl = 'https://chequered-hortense-homeomorphic.ngrok-free.dev/api/facilities/';

  constructor(private http: HttpClient) {}

  getFacilities(filters?: FacilityFilters): Observable<FacilityListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.capacity_min !== undefined) params = params.set('capacity_min', filters.capacity_min.toString());
      if (filters.capacity_max !== undefined) params = params.set('capacity_max', filters.capacity_max.toString());
      if (filters.is_active !== undefined) params = params.set('is_active', filters.is_active.toString());
      if (filters.order) params = params.set('order', filters.order);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.page_size) params = params.set('page_size', filters.page_size.toString());
    }

    return this.http.get<FacilityListResponse>(this.apiUrl, { params });
  }

  getFacilityById(id: number): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}${id}/`);
  }

  getFacilityBySlug(slug: string): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}${slug}/`);
  }

  createFacility(facilityData: FacilityCreate): Observable<Facility> {
    return this.http.post<Facility>(this.apiUrl, facilityData);
  }

  updateFacility(id: number, facilityData: FacilityUpdate): Observable<Facility> {
    return this.http.patch<Facility>(`${this.apiUrl}${id}/`, facilityData);
  }

  deleteFacility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
