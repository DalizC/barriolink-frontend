import { CommonModule, registerLocaleData } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import localeEs from "@angular/common/locales/es";

import { Select2Data, Select2Module } from "ng-select2-component";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

registerLocaleData(localeEs);

@Component({
  selector: "app-news",
  standalone: true,
  imports: [CommonModule, FormsModule, Select2Module, CarouselModule],
  templateUrl: "./news.html",
  styleUrl: "./news.scss",
})
export class News {
  customOptions: OwlOptions = {
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

  carouselItems = [
    { image: 'assets/images/slider/1.jpg', title: 'Slide 1', description: 'Description for Slide 1' },
    { image: 'assets/images/slider/2.jpg', title: 'Slide 2', description: 'Description for Slide 2' },
    { image: 'assets/images/slider/3.jpg', title: 'Slide 3', description: 'Description for Slide 3' },
    { image: 'assets/images/slider/4.jpg', title: 'Slide 4', description: 'Description for Slide 4' }
  ];

  readonly news = [
    {
      id: 1,
      title: "Nuevo Sistema de Seguridad",
      summary:
        "Se instalaron cámaras de seguridad en las principales calles del barrio.",
      content: "La municipalidad ha instalado un moderno sistema de videovigilancia...",
      author: "Administrador",
      date: "2024-10-18",
      category: "Seguridad",
      status: "Publicado",
      image: "assets/images/blog/blog-5.jpg"
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
      image: "assets/images/blog/blog-6.jpg"
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
      image: "assets/images/blog/blog-3.jpg"
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
      image: "assets/images/blog/blog-2.jpg"
    },
  ];

  categoryOptions: Select2Data = [];

  selectedCategories: string[] = [];
  stagedCategories: string[] = [];

  selectedDateFrom: string | null = null;
  selectedDateTo: string | null = null;
  stagedDateFrom: string | null = null;
  stagedDateTo: string | null = null;

  selectedSortOrder: 'newest' | 'oldest' = 'newest';
  stagedSortOrder: 'newest' | 'oldest' = 'newest';

  filteredNews = [...this.news];

  constructor() {
    this.categoryOptions = Array.from(new Set(this.news.map((item) => item.category))).map(
      (category) => ({
        value: category,
        label: category
      })
    );
    this.stagedCategories = [...this.selectedCategories];
    this.stagedDateFrom = this.selectedDateFrom;
    this.stagedDateTo = this.selectedDateTo;
    this.stagedSortOrder = this.selectedSortOrder;
  }

  applyFilters(): void {
    this.selectedCategories = [...this.stagedCategories];
    this.selectedDateFrom = this.stagedDateFrom;
    this.selectedDateTo = this.stagedDateTo;
    this.selectedSortOrder = this.stagedSortOrder;

    const from = this.selectedDateFrom ? new Date(this.selectedDateFrom) : null;
    const to = this.selectedDateTo ? new Date(this.selectedDateTo) : null;

    const filtered = this.news.filter((item) => {
      const matchesCategory =
        this.selectedCategories.length === 0 || this.selectedCategories.includes(item.category);

      const itemDate = new Date(item.date);
      const matchesFrom = !from || itemDate >= from;
      const matchesTo = !to || itemDate <= to;

      return matchesCategory && matchesFrom && matchesTo;
    });

    filtered.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return this.selectedSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    this.filteredNews = filtered;
  }

  onCategoriesChange(value: string[] | string | null): void {
    if (Array.isArray(value)) {
      this.stagedCategories = value;
    } else if (typeof value === "string") {
      this.stagedCategories = value ? [value] : [];
    } else {
      this.stagedCategories = [];
    }
  }

  onDateFromChange(value: string | null): void {
    this.stagedDateFrom = value && value.length > 0 ? value : null;
  }

  onDateToChange(value: string | null): void {
    this.stagedDateTo = value && value.length > 0 ? value : null;
  }

  onSortOrderChange(value: 'newest' | 'oldest'): void {
    this.stagedSortOrder = value;
  }

  clearCategory(categoryValue: string, event: MouseEvent): void {
    event.stopPropagation();
    this.stagedCategories = this.stagedCategories.filter(
      (category) => category !== categoryValue
    );
    this.stagedCategories = [...this.stagedCategories];
  }

  trackByNews(_: number, item: { id: number }): number {
    return item.id;
  }
}
