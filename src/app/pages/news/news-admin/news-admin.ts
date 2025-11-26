import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { ITableConfigs, ICardToggleOptions } from '../../../shared/interface/common';
import { DataTable } from '../../../shared/components/ui/datatable/datatable';
import { CardDropdownButton } from '../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';

@Component({
  selector: 'app-news-admin',
  imports: [CommonModule, FormsModule, NgbNavModule, DataTable, NgxSpinnerModule, CardDropdownButton],
  templateUrl: './news-admin.html',
  styleUrl: './news-admin.scss'
})
export class NewsAdmin implements OnInit {
  private newsService = inject(NewsService);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  public activeTab: string = 'all';
  public searchText: string = '';
  public loading: boolean = false;
  private allData: any[] = [];

  // Opciones del menú dropdown
  public filterMenuOptions: ICardToggleOptions[] = [
    { id: 1, title: 'Exportar Excel' },
    { id: 2, title: 'Exportar PDF' },
    { id: 3, title: 'Limpiar filtros' },
  ];

  public tableConfig: ITableConfigs<any> = {
    columns: [
      { title: 'Título', field_value: 'title', sort: true },
      { title: 'Autor', field_value: 'author_name', sort: true },
      { title: 'Resumen', field_value: 'summary', sort: true },
      { title: 'Estado', field_value: 'status_badge', sort: true },
      { title: 'Categorías', field_value: 'categories_names', sort: true },
      { title: 'Fecha Creación', field_value: 'created_at', sort: true },
      { title: 'Fecha Publicación', field_value: 'published_at', sort: true },
    ],
    row_action: [
      { label: 'View', icon: 'eye', path: '/news/', action_to_perform: 'view' },
      { label: 'Edit', icon: 'edit', path: '/news/form/', action_to_perform: 'edit' },
      {
        label: 'Publish',
        icon: 'paper-plane',
        action_to_perform: 'publish',
        condition: (row: any) => row._raw.status !== 'published'
      },
      { label: 'Delete', icon: 'trash', action_to_perform: 'delete', modal: true },
    ],
    data: []
  };

  ngOnInit(): void {
    this.loadNews();
  }

  /**
   * Cargar noticias desde el API
   */
  private loadNews(status?: string): void {
    this.loading = true;
    this.spinner.show('news-table');

    const params: any = {};
    if (status) {
      params.status = status;
    }

    this.newsService.getNews(params).subscribe({
      next: (response) => {
        // Mapear noticias del API a formato de la tabla
        const newsData = response.results.map(news => ({
          id: news.id,
          title: news.title,
          author_name: news.author?.name || 'Desconocido',
          summary: this.truncateText(news.summary, 60),
          status_badge: this.formatStatus(news.status),
          categories_names: this.formatCategories(news.categories_detail),
          created_at: this.formatDateTime(news.created_at),
          published_at: news.published_at ? this.formatDateTime(news.published_at) : '-',
          // Datos adicionales para acciones
          _raw: news
        }));

        // Crear nueva referencia para detectar cambios
        this.tableConfig = {
          ...this.tableConfig,
          data: newsData
        };
        this.allData = [...newsData];
        this.loading = false;
        this.spinner.hide('news-table');
      },
      error: (error) => {
        console.error('Error al cargar noticias:', error);
        this.toastr.error('Error al cargar noticias', 'Error');
        this.loading = false;
        this.spinner.hide('news-table');
      }
    });
  }

  /**
   * Formatear fecha y hora
   */
  private formatDateTime(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatear estado con badge HTML
   */
  private formatStatus(status: string): string {
    const statusMap: { [key: string]: { class: string; label: string } } = {
      draft: { class: 'badge-light-secondary', label: 'Borrador' },
      published: { class: 'badge-light-success', label: 'Publicado' },
      archived: { class: 'badge-light-warning', label: 'Archivado' }
    };
    const mapped = statusMap[status] || { class: 'badge-light-secondary', label: status };
    return `<span class="badge ${mapped.class}">${mapped.label}</span>`;
  }

  /**
   * Formatear categorías
   */
  private formatCategories(categories: any[]): string {
    if (!categories || categories.length === 0) return '-';
    return categories.map(c => c.name).join(', ');
  }

  /**
   * Truncar texto
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Filtrar por estado (tabs)
   */
  public filterByStatus(status: string): void {
    this.activeTab = status;
    if (status === 'all') {
      this.loadNews();
    } else {
      this.loadNews(status);
    }
  }

  /**
   * Obtener conteo de noticias por estado
   */
  public getStatusCount(status: string): number {
    if (status === 'all') return this.allData.length;
    return this.allData.filter(news => news._raw.status === status).length;
  }

  /**
   * Maneja las acciones de la tabla (view, edit, delete, publish)
   */
  handleTableAction(event: any): void {
    const action = event.action_to_perform;
    const data = event.data;

    if (action === 'delete') {
      this.deleteNews(data._raw.id);
    } else if (action === 'publish') {
      this.publishNews(data._raw.id);
    }
    // Las acciones 'view' y 'edit' son manejadas por routerLink automáticamente
  }

  /**
   * Publicar noticia
   */
  public publishNews(newsId: number): void {
    if (!confirm('¿Estás seguro de que deseas publicar esta noticia?')) {
      return;
    }

    this.spinner.show('news-table');
    this.newsService.publishNews(newsId).subscribe({
      next: () => {
        this.toastr.success('Noticia publicada exitosamente', 'Éxito');
        this.loadNews(this.activeTab === 'all' ? undefined : this.activeTab);
      },
      error: (error) => {
        console.error('Error al publicar noticia:', error);
        this.toastr.error('Error al publicar noticia', 'Error');
        this.spinner.hide('news-table');
      }
    });
  }

  /**
   * Eliminar noticia
   */
  public deleteNews(newsId: number): void {
    if (!confirm('¿Estás seguro de que deseas ELIMINAR esta noticia? Esta acción no se puede deshacer.')) {
      return;
    }

    this.spinner.show('news-table');
    this.newsService.deleteNews(newsId).subscribe({
      next: () => {
        this.toastr.success('Noticia eliminada exitosamente', 'Éxito');
        this.loadNews(this.activeTab === 'all' ? undefined : this.activeTab);
      },
      error: (error) => {
        console.error('Error al eliminar noticia:', error);
        this.toastr.error('Error al eliminar noticia', 'Error');
        this.spinner.hide('news-table');
      }
    });
  }
}
