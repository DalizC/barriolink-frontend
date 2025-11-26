import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDatepickerModule, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ITableConfigs, ICardToggleOptions } from '../../../shared/interface/common';
import { DataTable } from '../../../shared/components/ui/datatable/datatable';
import { CardDropdownButton } from '../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { NewsService } from '../../../core/services/news.service';
import { CategoryService } from '../../../core/services/category.service';
import { News } from '../../../core/models/news.model';
import { Category } from '../../../core/models/category.model';
import { AuthService } from '../../../core/services/auth.service';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-news',
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDatepickerModule, DataTable, NgxSpinnerModule, CardDropdownButton],
  templateUrl: './my-news.html',
  styleUrl: './my-news.scss'
})
export class MyNews implements OnInit {
  private calendar = inject(NgbCalendar);
  private formatter = inject(NgbDateParserFormatter);
  private newsService = inject(NewsService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);

  public activeTab: string = 'all';
  public searchText: string = '';
  private allData: any[] = [];
  public isLoading: boolean = false;
  public categories: Category[] = [];
  public selectedCategory: number | null = null;

  // Date range picker
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null = null;
  public toDate: NgbDate | null = null;
  public showDatePicker: boolean = false;

  // Opciones del menú dropdown
  public filterMenuOptions: ICardToggleOptions[] = [
    { id: 1, title: 'Exportar Excel' },
    { id: 2, title: 'Exportar PDF' },
    { id: 3, title: 'Limpiar filtros' },
    {
      id: 4,
      title: 'Modo compacto',
      switch: { class: 'primary', value: false }
    },
  ];

  public tableConfig: ITableConfigs<any> = {
    columns: [
      { title: 'Título', field_value: 'title', sort: true },
      { title: 'Estado', field_value: 'status', sort: true },
      { title: 'Categorías', field_value: 'categories', sort: false },
      { title: 'Fecha Publicación', field_value: 'published_at', sort: true },
      { title: 'Fecha Creación', field_value: 'created_at', sort: true },
      { title: 'Vistas', field_value: 'view_count', sort: true },
    ],
    row_action: [
      { label: 'Ver', icon: 'eye', path: '/news/' },
      { label: 'Editar', icon: 'edit', path: '/news/edit/' },
      { label: 'Eliminar', icon: 'trash' },
    ],
    data: []
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadMyNews();
  }

  /**
   * Cargar categorías desde el API
   */
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  /**
   * Cargar noticias del usuario desde el API
   */
  private loadMyNews(): void {
    this.isLoading = true;
    this.spinner.show();

    this.authService.currentUser$.subscribe(currentUser => {
      if (!currentUser) {
        console.error('Usuario no autenticado');
        this.isLoading = false;
        this.spinner.hide();
        return;
      }

      // Construir filtros para el API
      const filters: any = {
        author: currentUser.id
      };

      // Agregar filtro de categoría si está seleccionada
      if (this.selectedCategory) {
        filters.category = this.selectedCategory;
      }

      // Agregar filtro de estado si no es 'all'
      if (this.activeTab !== 'all') {
        filters.status = this.activeTab;
      }

      this.newsService.getNews(filters).subscribe({
        next: (response) => {
          // Mapear noticias del API a formato de la tabla
          const newsData = response.results.map(news => ({
            id: news.id,
            title: news.title,
            status: this.formatStatus(news.status),
            categories: news.categories_detail?.map(c => c.name).join(', ') || '-',
            published_at: news.published_at ? this.formatDate(news.published_at) : '-',
            created_at: this.formatDate(news.created_at),
            view_count: 0,
            _raw: news
          }));

          // Aplicar filtro de fecha localmente (no soportado por API)
          let filteredData = newsData;
          if (this.fromDate && this.toDate) {
            const fromDateObj = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
            const toDateObj = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
            toDateObj.setHours(23, 59, 59, 999);

            filteredData = newsData.filter(news => {
              const newsDate = new Date(news._raw.created_at);
              return newsDate >= fromDateObj && newsDate <= toDateObj;
            });
          }

          // Crear nueva referencia para detectar cambios
          this.tableConfig = {
            ...this.tableConfig,
            data: filteredData
          };
          this.allData = [...filteredData];
          this.isLoading = false;
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error al cargar noticias:', error);
          this.isLoading = false;
          this.spinner.hide();
        }
      });
    });
  }

  /**
   * Formatear fecha
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatear estado de la noticia
   */
  private formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': '<span class="badge badge-light-secondary">Borrador</span>',
      'published': '<span class="badge badge-light-success">Publicado</span>',
      'archived': '<span class="badge badge-light-danger">Archivado</span>'
    };
    return statusMap[status] || status;
  }

  constructor() {
    // Inicialización en ngOnInit
  }

  /**
   * Filtra los datos de la tabla según el status seleccionado en el tab
   * @param status - Estado a filtrar: 'all', 'draft', 'published', 'archived'
   */
  public filterByStatus(status: string): void {
    this.activeTab = status;
    this.loadMyNews(); // Recargar con filtro de servidor
  }

  /**
   * Maneja la búsqueda de noticias (filtro local)
   */
  public onSearch(): void {
    this.applyLocalFilters();
  }

  /**
   * Aplica filtros desde el servidor (botón Filtrar)
   */
  public applyServerFilters(): void {
    this.loadMyNews();
  }

  /**
   * Aplica filtros locales (solo búsqueda de texto)
   */
  private applyLocalFilters(): void {
    let filteredData = [...this.allData];

    // Filtrar por búsqueda
    if (this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filteredData = filteredData.filter(news =>
        news.title.toLowerCase().includes(searchLower) ||
        news.categories.toLowerCase().includes(searchLower)
      );
    }

    // Crear nueva referencia del tableConfig para forzar detección de cambios
    this.tableConfig = {
      ...this.tableConfig,
      data: filteredData
    };
  }

  /**
   * Obtiene el conteo de noticias por status
   * @param status - Estado a contar: 'all', 'draft', 'published', 'archived'
   * @returns Número de noticias con ese status
   */
  public getStatusCount(status: string): number {
    if (status === 'all') {
      return this.allData.length;
    }
    return this.allData.filter(news => news._raw.status === status).length;
  }

  // ===== DATE PICKER METHODS =====

  public toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  public onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.showDatePicker = false;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  public isHovered(date: NgbDate): boolean {
    return !!(
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  public isInside(date: NgbDate): boolean {
    return !!(this.toDate && date.after(this.fromDate!) && date.before(this.toDate));
  }

  public isRange(date: NgbDate): boolean {
    return (
      date.equals(this.fromDate!) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  public getDateRangeText(): string {
    if (this.fromDate && this.toDate) {
      return `${this.formatter.format(this.fromDate)} - ${this.formatter.format(this.toDate)}`;
    } else if (this.fromDate) {
      return this.formatter.format(this.fromDate);
    }
    return '';
  }

  public clearDateRange(): void {
    this.fromDate = null;
    this.toDate = null;
    this.showDatePicker = false;
  }
}
