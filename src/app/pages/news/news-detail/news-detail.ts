import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss'
})
export class NewsDetail implements OnInit {
  newsId: string | null = null;
  newsItem: any = null;

  // Etiquetas calculadas para la noticia actual (deriva de newsItem.tags o de category/status)
  get computedTags(): string[] {
    if (!this.newsItem) return [];
    const base: string[] = Array.isArray(this.newsItem.tags) && this.newsItem.tags.length
      ? this.newsItem.tags
      : [this.newsItem.category, this.newsItem.status];
    // Normaliza: elimina falsos, trim y evita duplicados (case-insensitive)
    const seen = new Set<string>();
    return base
      .filter(Boolean)
      .map((t: string) => String(t).trim())
      .filter((t: string) => {
        const key = t.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return t.length > 0;
      });
  }

  // Mapea cada tag a una clase de badge de Bootstrap
  tagBadgeClass(tag: string): string {
    const t = (tag || '').toLowerCase();
    // Mapeo simple; ajusta según tu paleta/semántica
    if (['seguridad', 'security'].includes(t)) return 'bg-primary';
    if (['comunidad', 'community'].includes(t)) return 'bg-success';
    if (['anuncio', 'aviso', 'scheduled', 'programado'].includes(t)) return 'bg-warning text-dark';
    if (['infraestructura', 'infrastructure'].includes(t)) return 'bg-info';
    if (['servicios', 'services'].includes(t)) return 'bg-secondary';
    if (['publicado', 'published'].includes(t)) return 'bg-success';
    if (['borrador', 'draft'].includes(t)) return 'bg-secondary';
    if (['urgente', 'important', 'alerta'].includes(t)) return 'bg-danger';
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

  // Array de noticias (temporalmente aquí, luego podrías usar un servicio)
  readonly news = [
    {
      id: 1,
      title: "Nuevo Sistema de Seguridad",
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut libero libero. Aliquam dictum nibh non sapien efficitur, vel auctor lacus consequat. Suspendisse potenti. Donec pretium consequat libero, in bibendum arcu feugiat at. Pellentesque aliquam augue sem, eget lacinia nibh tempor in. Proin congue lectus turpis, a fringilla arcu congue sed. Mauris eu eros finibus enim viverra interdum vel a magna. Donec vitae risus pulvinar, tincidunt risus ac, pharetra ante. Nullam blandit tortor est, non placerat erat condimentum non. Integer vel malesuada est. Quisque congue augue justo, id placerat dolor ultrices eget. Praesent at velit accumsan, egestas est eu, pharetra felis.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut libero libero. Aliquam dictum nibh non sapien efficitur, vel auctor lacus consequat. Suspendisse potenti. Donec pretium consequat libero, in bibendum arcu feugiat at. Pellentesque aliquam augue sem, eget lacinia nibh tempor in. Proin congue lectus turpis, a fringilla arcu congue sed. Mauris eu eros finibus enim viverra interdum vel a magna. Donec vitae risus pulvinar, tincidunt risus ac, pharetra ante. Nullam blandit tortor est, non placerat erat condimentum non. Integer vel malesuada est. Quisque congue augue justo, id placerat dolor ultrices eget. Praesent at velit accumsan, egestas est eu, pharetra felis.",
      author: "Administrador",
      date: "2024-10-18",
      category: "Seguridad",
      status: "Publicado",
      image: "assets/images/blog/blog-2.jpg",
      tags: ["Seguridad", "Anuncio"]
    },
    {
      id: 2,
      title: "Mejoras en el Alumbrado Público",
      summary: "Reemplazo de luminarias LED en toda la zona residencial.",
      content: "Como parte del plan de modernización urbana...",
      author: "María García",
      date: "2024-10-15",
      category: "Infraestructura",
      status: "Publicado",
      image: "assets/images/blog/blog-2.jpg",
      tags: ["Infraestructura", "Comunidad"]
    },
    {
      id: 3,
      title: "Próximo Corte de Agua Programado",
      summary: "Mantenimiento de la red de agua potable el próximo fin de semana.",
      content: "La empresa de servicios públicos anuncia...",
      author: "Carlos López",
      date: "2024-10-20",
      category: "Servicios",
      status: "Borrador",
      image: "assets/images/blog/blog-3.jpg",
      tags: ["Servicios", "Programado"]
    },
    {
      id: 4,
      title: "Feria Gastronómica Comunitaria",
      summary: "Los emprendedores locales se reúnen para compartir sabores.",
      content: "La feria contará con más de 40 stands de comida...",
      author: "Ana Torres",
      date: "2024-10-22",
      category: "Comunidad",
      status: "Programado",
      image: "assets/images/blog/blog-4.jpg",
      tags: ["Comunidad", "Anuncio"]
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.newsId = this.route.snapshot.paramMap.get('id');
    if (this.newsId) {
      this.newsItem = this.news.find(n => n.id === +this.newsId!);
    }
  }
}
