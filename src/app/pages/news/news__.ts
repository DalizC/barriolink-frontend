import { CommonModule, registerLocaleData } from "@angular/common";
import { Component, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import localeEs from "@angular/common/locales/es";

import { Select2Data, Select2Module } from "ng-select2-component";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

registerLocaleData(localeEs);

@Component({
  selector: "app-news",
  standalone: true,
  imports: [CommonModule, FormsModule, Select2Module, CarouselModule, NgbModule],
  templateUrl: "./news.html",
  styleUrl: "./news.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class News implements DoCheck, AfterViewInit {
  active: string = 'all';

  @ViewChild('dropdownElement') dropdownElement!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  private mutationObserver?: MutationObserver;
  private menuMutationObserver?: MutationObserver;
  private classChangeCount = 0;
  private menuClassChangeCount = 0;

  private checkCounter = 0;

  ngDoCheck() {
    this.checkCounter++;
    if (this.checkCounter % 10 === 0) {
      console.log('🔄 ngDoCheck called', this.checkCounter, 'times');
    }
  }

  ngAfterViewInit() {
    // Observar cambios en las clases del dropdown principal
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.classChangeCount++;
          const element = mutation.target as HTMLElement;
          console.log('🎨 DROPDOWN DIV CLASS CHANGE #' + this.classChangeCount, {
            oldValue: mutation.oldValue,
            newValue: element.className,
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    this.mutationObserver.observe(this.dropdownElement.nativeElement, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    });

    // Observar cambios en las clases del menu dropdown (donde está la clase 'show')
    this.menuMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.menuClassChangeCount++;
          const element = mutation.target as HTMLElement;
          console.log('🎨 DROPDOWN MENU CLASS CHANGE #' + this.menuClassChangeCount, {
            oldValue: mutation.oldValue,
            newValue: element.className,
            hasShow: element.classList.contains('show'),
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    this.menuMutationObserver.observe(this.dropdownMenu.nativeElement, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.menuMutationObserver) {
      this.menuMutationObserver.disconnect();
    }
  }

  searchResultTab = [
    { value: 'all', title: 'All', icon: 'search' },
    { value: 'images', title: 'Images', icon: 'image' },
    { value: 'videos', title: 'Videos', icon: 'video' },
    { value: 'audio', title: 'Audio', icon: 'volume-2' },
    { value: 'setting', title: 'Settings', icon: 'settings' }
  ];

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

  selectedFilter: string = '';
  selectedFilters: string[] = [];
  selectedCategory: string = '';
  //selectedCategories: string[] = [];
  stagedCategories: string[] = [];

  selectedDateFrom: string | null = null;
  selectedDateTo: string | null = null;
  stagedDateFrom: string | null = null;
  stagedDateTo: string | null = null;

  selectedSortOrder: 'newest' | 'oldest' = 'newest';
  stagedSortOrder: 'newest' | 'oldest' = 'newest';

  filteredNews = [...this.news];

  // Demo data para temas
  themes = [
    {
      theme_name: "BarrioLink Community Hub",
      theme_url: "https://barriolink.local/themes/community-hub",
      description: "Plataforma integral de conexión comunitaria con herramientas colaborativas.",
      rating: 4.5,
      votes: 128,
      type: "Community Platform"
    },
    {
      theme_name: "Event Management System",
      theme_url: "https://barriolink.local/themes/events",
      description: "Sistema completo para gestión de eventos y actividades del barrio.",
      rating: 4,
      votes: 89,
      type: "Event Management"
    },
    {
      theme_name: "Facilities Booking",
      theme_url: "https://barriolink.local/themes/facilities",
      description: "Reserva de instalaciones comunitarias de forma rápida y eficiente.",
      rating: 4.8,
      votes: 156,
      type: "Booking System"
    }
  ];

  // Blog details
  blogDetails = {
    image: "assets/images/blog/blog-1.jpg",
    date: "22 Oct",
    year: "2024",
    title: "Conexión Comunitaria",
    created_by: "BarrioLink Team",
    hits: 1240
  };

  // Audio demo
  audios = [
    {
      poster: "assets/images/blog/audio-1.jpg",
      title: "Podcast: Vida en el Barrio",
      description: "Historias de nuestra comunidad",
      is_play: false,
      is_favorite: false
    },
    {
      poster: "assets/images/blog/audio-2.jpg",
      title: "Música Local",
      description: "Artistas del vecindario",
      is_play: false,
      is_favorite: false
    },
    {
      poster: "assets/images/blog/audio-3.jpg",
      title: "Charla Educativa",
      description: "Talleres comunitarios",
      is_play: false,
      is_favorite: true
    }
  ];

  // Video demo
  videos = [
    {
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Video Tour del Barrio",
      rating: 4.7,
      votes: 234,
      type: "Documentary"
    },
    {
      url: "https://www.youtube.com/embed/jNQXAC9IVRw",
      title: "Evento Comunitario 2024",
      rating: 4.5,
      votes: 189,
      type: "Event"
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
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
    this.filteredNews = [...this.news];
  }

  onFiltersChange(value: string[] | string | null): void {
    if (Array.isArray(value)) {
      this.selectedFilters = value;

      // Extraer categorías seleccionadas
      const categories = value
        .filter(v => v.startsWith('cat_'))
        .map(v => v.replace('cat_', ''))
        .map(v => v.charAt(0).toUpperCase() + v.slice(1));

      if (categories.length > 0) {
        this.selectedCategory = categories[0]; // Tomar la primera categoría
      } else {
        this.selectedCategory = '';
      }

      // Extraer orden seleccionado
      const sortFilter = value.find(v => v.startsWith('sort_'));
      if (sortFilter) {
        this.stagedSortOrder = sortFilter === 'sort_newest' ? 'newest' : 'oldest';
      }
    } else {
      this.selectedFilters = [];
    }
  }

  /*applyFilters(): void {
    this.selectedCategories = [...this.stagedCategories];
    this.selectedDateFrom = this.stagedDateFrom;
    this.selectedDateTo = this.stagedDateTo;
    this.selectedSortOrder = this.stagedSortOrder;

    const from = this.selectedDateFrom ? new Date(this.selectedDateFrom) : null;
    const to = this.selectedDateTo ? new Date(this.selectedDateTo) : null;

    const filtered = this.news.filter((item) => {
      const matchesCategory =
        !this.selectedCategory || this.selectedCategory === '' || item.category === this.selectedCategory;

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
  }*/

  onFilterChange(): void {
    if (!this.selectedFilter) {
      this.selectedCategory = '';
      this.stagedSortOrder = 'newest';
      return;
    }

    // Procesar categorías
    if (this.selectedFilter.startsWith('cat_')) {
      const category = this.selectedFilter.replace('cat_', '');
      this.selectedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Procesar orden
    if (this.selectedFilter.startsWith('sort_')) {
      this.stagedSortOrder = this.selectedFilter === 'sort_newest' ? 'newest' : 'oldest';
    }

    // Auto-aplicar filtros
    this.applyFilters();
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

  // Método para obtener audios
  getAudios() {
    return this.audios;
  }

  // Método para reproducir audio
  playAudio(audio: any): void {
    // Alternar estado de reproducción
    this.audios.forEach(a => {
      if (a !== audio) {
        a.is_play = false;
      }
    });
    audio.is_play = !audio.is_play;
    console.log(`Playing: ${audio.title}`, audio.is_play);
  }

  // Método para sanitizar URLs de iframes
  safe(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  @Output() filtersApplied = new EventEmitter<{
    categories: string[];
    order: 'asc' | 'desc';
  }>();

  categories: Select2Data = [
    {
      label: 'Contenido',
      options: [
        { value: 'design', label: 'Diseño' },
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
      ],
    },
    {
      label: 'Estado',
      options: [
        { value: 'draft', label: 'Borrador' },
        { value: 'published', label: 'Publicado' },
        { value: 'archived', label: 'Archivado' },
      ],
    },
  ];

  isFilterOpen = false;

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  categoryList = [
    { value: 'design', label: 'Diseño', selected: false },
    { value: 'frontend', label: 'Frontend', selected: false },
    { value: 'backend', label: 'Backend', selected: false },
    { value: 'marketing', label: 'Marketing', selected: false },
  ];

  selectedCategories: string[] = [];
  private selectedCategoriesSet = new Set<string>();

  trackByValue(index: number, item: any): any {
    return item.value;
  }

  onDropdownChange(isOpen: boolean): void {
    console.log(isOpen ? '🔓 DROPDOWN OPENED' : '🔒 DROPDOWN CLOSED', {
      checkCount: this.checkCounter,
      timestamp: new Date().toISOString()
    });
    if (isOpen) {
      this.checkCounter = 0; // Reset counter
    }
  }

  onCategoryChange(category: any): void {
    console.log('🔵 onCategoryChange called', {
      value: category.value,
      selected: category.selected,
      timestamp: new Date().toISOString()
    });

    if (category.selected) {
      if (!this.selectedCategoriesSet.has(category.value)) {
        this.selectedCategories.push(category.value);
        this.selectedCategoriesSet.add(category.value);
        console.log('✅ Category added:', category.value);
      }
    } else {
      if (this.selectedCategoriesSet.has(category.value)) {
        const index = this.selectedCategories.indexOf(category.value);
        if (index > -1) {
          this.selectedCategories.splice(index, 1);
        }
        this.selectedCategoriesSet.delete(category.value);
        console.log('❌ Category removed:', category.value);
      }
    }
  }

  onCategoryToggle(value: string, checked: boolean): void {
    console.log('🔵 onCategoryToggle called', {
      value,
      checked,
      timestamp: new Date().toISOString()
    });

    if (checked) {
      if (!this.selectedCategoriesSet.has(value)) {
        this.selectedCategories.push(value);
        this.selectedCategoriesSet.add(value);
        console.log('✅ Category added:', value);
      }
    } else {
      if (this.selectedCategoriesSet.has(value)) {
        const index = this.selectedCategories.indexOf(value);
        if (index > -1) {
          this.selectedCategories.splice(index, 1);
        }
        this.selectedCategoriesSet.delete(value);
        console.log('❌ Category removed:', value);
      }
    }

    console.log('Calling markForCheck...');
    this.cdr.markForCheck();
    console.log('markForCheck called');
  }

  sortOrder: 'asc' | 'desc' = 'desc';
  isSubmitting = false;

  applyFilters(): void {
    this.isSubmitting = true;
    this.filtersApplied.emit({
      categories: this.selectedCategories,
      order: this.sortOrder,
    });
    // Simula fin de proceso; en la vida real apaga el loader cuando responda tu servicio.
    setTimeout(() => (this.isSubmitting = false), 300);
  }
}
