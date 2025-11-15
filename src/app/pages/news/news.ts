import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { NewsService, NewsFilters } from "../../shared/services/news.service";
import { NewsItem, NEWS_MOCK_DATA } from "../../shared/data/news-mock.data";
import { ICardToggleOptions } from "../../shared/interface/common";
import { CardDropdownButton } from '../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgbModule, CarouselModule, CardDropdownButton],
  templateUrl: "./news.html",
  styleUrl: "./news.scss"
})
export class News implements OnInit {
  // Expose Math to template
  Math = Math;

  // UI state
  searchText: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';
  loading: boolean = false;
  viewMode: 'grid' | 'list' = 'grid';

  // Mock data (local) - used for grid rendering instead of backend while refactoring
  mockNewsItems: NewsItem[] = NEWS_MOCK_DATA;

  // Data exposed to template
  carouselItems: NewsItem[] = [];
  pinnedItems: NewsItem[] = [];
  newsList: NewsItem[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Available tags for filters (loaded dynamically)
  availableTags: string[] = [];
  options: { value: string; label: string; selected: boolean }[] = [];

  carouselOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 7000,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: true,
    dots: true,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    responsive: { 0: { items: 1 } },
  };

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  /**
   * Load all initial data: carousel, pinned, and news list
   */
  private loadAllData(): void {
    // During refactor we derive everything from mock data locally.
    // Keep service methods commented for future backend reintegration.
    this.initializeFromMock();
  }

  /**
   * Initialize data from local mock dataset (acts as backend substitute)
   */
  private initializeFromMock(): void {
    // Carousel: 5 most recent
    this.carouselItems = [...this.mockNewsItems]
      .sort((a,b) => b.date.getTime() - a.date.getTime())
      .slice(0,5);

    // Pinned: up to 2 pinned most recent
    this.pinnedItems = this.mockNewsItems
      .filter(n => n.pinned)
      .sort((a,b) => b.date.getTime() - a.date.getTime())
      .slice(0,2);

    // Tags -> options
    const tagSet = new Set<string>();
    this.mockNewsItems.forEach(n => n.tags.forEach(t => tagSet.add(t)));
    this.availableTags = Array.from(tagSet.values()).sort();
    this.options = this.availableTags.map(tag => ({
      value: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1),
      selected: false
    }));

    // Compute initial filtered list
    this.applyFilters();
  }

  /**
   * Load carousel news (5 most recent)
   */
  // Service methods retained for future use (currently unused while using local mock)
  private loadCarouselNews(): void { /* no-op during mock phase */ }

  /**
   * Load pinned news (2 most recent with pinned=true)
   */
  private loadPinnedNews(): void { /* no-op during mock phase */ }

  /**
   * Load all available tags for filter options
   */
  private loadTags(): void { /* no-op during mock phase */ }

  /**
   * Load paginated news list
   */
  private loadNewsList(): void { /* no-op during mock phase */ }

  get selectedValues(): string[] {
    return this.options
      .filter(opt => opt.selected)
      .map(opt => opt.value);
  }

  /**
   * Apply filters and reload news list
   */
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when applying filters
    this.recomputeFromMock();
  }

  /**
   * Recompute filtered + sorted + paginated list from mock dataset
   */
  private recomputeFromMock(): void {
    this.loading = true;
    // 1. Filter by search text
    const search = this.searchText.trim().toLowerCase();
    let filtered = this.mockNewsItems.filter(item => {
      const matchesSearch = !search ||
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.tags.some(t => t.toLowerCase().includes(search));
      // 2. Filter by selected tags (AND logic: item must contain all selected)
      const selected = this.selectedValues;
      const matchesTags = selected.length === 0 || selected.every(tag => item.tags.includes(tag));
      return matchesSearch && matchesTags;
    });

    // 3. Sort
    filtered.sort((a,b) => {
      const diff = a.date.getTime() - b.date.getTime();
      return this.sortOrder === 'asc' ? diff : -diff;
    });

    // 4. Pagination
    this.totalItems = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.newsList = filtered.slice(start, start + this.pageSize);
    this.loading = false;
  }

  /**
   * Refresh all data
   */
  refresh(): void {
    this.initializeFromMock();
  }

  /**
   * Toggle filters panel (placeholder for future implementation)
   */
  toggleFilters(): void {
    console.log('Toggle de panel de filtros solicitado');
    // TODO: Abrir/cerrar panel lateral o mostrar modal según diseño futuro
  }

  /**
   * Navigate to create news form
   */
  createNews(): void {
    console.log('Navegar a crear nueva noticia');
    // TODO: Implementar navegación a formulario de creación
  }

  /**
   * Edit an existing news item (placeholder for routing to edit form)
   */
  editNews(item: NewsItem): void {
    console.log('Editar noticia', item?.id);
    // TODO: Implementar navegación a formulario de edición
  }

  /**
   * Delete a news item (placeholder - confirm and remove from local list during mock phase)
   */
  deleteNews(item: NewsItem): void {
    const ok = confirm(`¿Eliminar la noticia "${item?.title}"?`);
    if (!ok) return;
    // Durante la fase mock, eliminamos del arreglo local y recomputamos
    this.mockNewsItems = this.mockNewsItems.filter(n => n.id !== item.id);
    this.applyFilters();
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.recomputeFromMock();
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Get array of page numbers for pagination
   */
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  public cardToggleOptions : ICardToggleOptions[] = [
    { id: 1, title: 'Editar', iconHtml: '<i class="fa-solid fa-pencil-square"></i>' },
    { id: 2, title: 'Eliminar', iconHtml: '<i class="fas fa-trash-alt"></i>', itemClass: 'text-danger' },
  ];
}
