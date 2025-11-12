import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { NewsService, NewsFilters } from "../../shared/services/news.service";
import { NewsItem } from "../../shared/data/news-mock.data";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, CarouselModule],
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

  // Data from service
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
    this.loadCarouselNews();
    this.loadPinnedNews();
    this.loadTags();
    this.loadNewsList();
  }

  /**
   * Load carousel news (5 most recent)
   */
  private loadCarouselNews(): void {
    this.newsService.getCarouselNews().subscribe({
      next: (data) => {
        this.carouselItems = data;
      },
      error: (err) => console.error('Error loading carousel news:', err)
    });
  }

  /**
   * Load pinned news (2 most recent with pinned=true)
   */
  private loadPinnedNews(): void {
    this.newsService.getPinnedNews().subscribe({
      next: (data) => {
        this.pinnedItems = data;
      },
      error: (err) => console.error('Error loading pinned news:', err)
    });
  }

  /**
   * Load all available tags for filter options
   */
  private loadTags(): void {
    this.newsService.getAllTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
        // Convert to options format for checkboxes
        this.options = tags.map(tag => ({
          value: tag,
          label: tag.charAt(0).toUpperCase() + tag.slice(1),
          selected: false
        }));
      },
      error: (err) => console.error('Error loading tags:', err)
    });
  }

  /**
   * Load paginated news list
   */
  private loadNewsList(): void {
    this.loading = true;

    const filters: NewsFilters = {
      searchText: this.searchText,
      tags: this.selectedValues,
      sortOrder: this.sortOrder
    };

    this.newsService.getNewsList(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.newsList = response.data;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading news list:', err);
        this.loading = false;
      }
    });
  }

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
    this.loadNewsList();
  }

  /**
   * Refresh all data
   */
  refresh(): void {
    this.loadAllData();
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
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadNewsList();
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
}
