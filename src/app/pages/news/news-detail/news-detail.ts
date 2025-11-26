import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, CarouselModule, NgbAlertModule],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss'
})
export class NewsDetail implements OnInit {
  newsId: string | null = null;
  newsItem: News | null = null;
  loading: boolean = false;
  error: string | null = null;
  showAlert: boolean = true; // Control de visibilidad de la alerta

  // Configuración de alerta (tipo y estilo)
  alertType: 'success' | 'info' | 'warning' | 'danger' = 'info';
  alertBorderClass = 'alert-light-info border-2 rounded-3';
  alertTitle = '¿Deseas editar?';
  alertText = 'Your time Over after <strong class="txt-dark">5</strong> minute';

  // Botones configurables de la alerta, mantienen el orden definido aquí
  alertActions: Array<{
    text: string;
    iconClass?: string;
    colorClass?: string; // clases de Bootstrap para el botón (p.ej. 'btn-outline-secondary')
    handler: (action: any) => void;
  }> = [
    {
      text: 'Editar',
      iconClass: '<i class="fas fa-pencil-alt"></i>',
      colorClass: 'b-r-8 btn btn-lg btn-outline-primary',
      handler: (action) => this.closeAlert()
    },
    {
      text: 'Publicar',
      iconClass: '<i class="fas fa-paper-plane"></i>',
      colorClass: 'b-r-8 btn btn-lg btn-primary',
      handler: (action) => this.closeAlert()
    },
    // Ejemplo de botón adicional (puedes editar/eliminar según sea necesario)
    // {
    //   text: 'Acción',
    //   iconClass: 'fa-solid fa-check',
    //   colorClass: 'btn-primary',
    //   handler: () => this.onAlertPrimaryAction()
    // }
  ];

  // Etiquetas calculadas para la noticia actual (deriva de categories_detail)
  get computedTags(): string[] {
    if (!this.newsItem) return [];
    return this.newsItem.categories_detail?.map(c => c.name) || [];
  }

  // Getters para facilitar el acceso en el template
  get authorName(): string {
    return (this.newsItem as any)?.author_name || 'Desconocido';
  }

  get formattedDate(): string {
    const date = this.newsItem?.published_at || this.newsItem?.created_at;
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Obtiene la URL de la imagen, priorizando 'image' sobre 'cover_image' (legacy)
  getImageUrl(news: News | null): string | null {
    if (!news) return null;
    return news.image || news.cover_image || null;
  }

  // Mapea cada tag a una clase de badge de Bootstrap
  tagBadgeClass(tag: string): string {
    const t = (tag || '').toLowerCase();
    if (['seguridad', 'seguridad vecinal'].includes(t)) return 'bg-primary';
    if (['eventos', 'eventos comunitarios', 'comunidad'].includes(t)) return 'bg-success';
    if (['avisos', 'avisos importantes'].includes(t)) return 'bg-warning text-dark';
    if (['infraestructura', 'mejoras de infraestructura'].includes(t)) return 'bg-info';
    if (['cultura', 'cultura y recreación'].includes(t)) return 'bg-secondary';
    return 'bg-light text-dark';
  }

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: true,
    dots: true,
    margin: 10,
    navSpeed: 700,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: { items: 2 },
      768: { items: 3 },
      1200: { items: 4 }
    },
  };

  carouselItems = [
    { image: 'assets/images/slider/1.jpg', title: 'Slide 1', description: 'Description for Slide 1' },
    { image: 'assets/images/slider/2.jpg', title: 'Slide 2', description: 'Description for Slide 2' },
    { image: 'assets/images/slider/3.jpg', title: 'Slide 3', description: 'Description for Slide 3' },
    { image: 'assets/images/slider/4.jpg', title: 'Slide 4', description: 'Description for Slide 4' },
    { image: 'assets/images/slider/1.jpg', title: 'Slide 1', description: 'Description for Slide 1' },
    { image: 'assets/images/slider/2.jpg', title: 'Slide 2', description: 'Description for Slide 2' },
    { image: 'assets/images/slider/3.jpg', title: 'Slide 3', description: 'Description for Slide 3' },
    { image: 'assets/images/slider/4.jpg', title: 'Slide 4', description: 'Description for Slide 4' }
  ];

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.newsId = this.route.snapshot.paramMap.get('id');
    if (this.newsId) {
      this.loadNewsDetail(+this.newsId);
    }
  }

  private loadNewsDetail(id: number): void {
    this.loading = true;
    this.error = null;

    this.newsService.getNewsById(id).subscribe({
      next: (news) => {
        this.newsItem = news;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle de noticia:', err);
        this.error = 'No se pudo cargar la noticia. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  // Cierra la alerta y remueve completamente del DOM
  closeAlert() {
    this.showAlert = false;
  }

  // Ejemplo de acción adicional
  // private onAlertPrimaryAction() {
  //   // Implementa la acción deseada
  // }
}
