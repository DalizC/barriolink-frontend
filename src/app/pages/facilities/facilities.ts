import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FacilityService } from '../../core/services/facility.service';
import { Facility } from '../../core/models/facility.model';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './facilities.html',
  styleUrl: './facilities.scss'
})
export class Facilities implements OnInit {
  // UI State
  searchText: string = '';
  loading: boolean = false;
  showActiveOnly: boolean = true;
  sortOrder: 'name' | '-name' | 'capacity' | '-capacity' | 'created_at' | '-created_at' = '-created_at';

  // Data
  facilities: Facility[] = [];
  filteredFacilities: Facility[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private facilityService: FacilityService) {}

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.loading = true;

    this.facilityService.getFacilities({
      search: this.searchText || undefined,
      is_active: this.showActiveOnly ? true : undefined,
      order: this.sortOrder,
      page: this.currentPage,
      page_size: this.pageSize
    }).subscribe({
      next: (response) => {
        this.facilities = response.results;
        this.filteredFacilities = response.results;
        this.totalItems = response.count;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading facilities:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadFacilities();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadFacilities();
  }

  onActiveFilterChange(): void {
    this.currentPage = 1;
    this.loadFacilities();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFacilities();
  }

  deleteFacility(id: number, name: string): void {
    if (confirm(`¿Está seguro que desea eliminar la instalación "${name}"?`)) {
      this.facilityService.deleteFacility(id).subscribe({
        next: () => {
          this.loadFacilities();
        },
        error: (error) => {
          console.error('Error deleting facility:', error);
          alert('Error al eliminar la instalación. Solo administradores pueden eliminar instalaciones.');
        }
      });
    }
  }

  getCapacityDisplay(capacity: number | null): string {
    return capacity ? `${capacity} personas` : 'Sin límite';
  }

  getAmenitiesArray(amenities: string): string[] {
    return amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : [];
  }
}
