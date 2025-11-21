import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-events-detail',
  standalone: true,
  imports: [CommonModule, NgbAlertModule],
  templateUrl: './events-detail.html',
  styleUrl: './events-detail.scss'
})
export class EventsDetail implements OnInit {
  eventId: string | null = null;
  eventItem: any = null;
  showAlert: boolean = true;

  alertType: 'success' | 'info' | 'warning' | 'danger' = 'info';
  alertBorderClass = 'alert-light-info border-2 rounded-3';
  alertTitle = '¿Deseas inscribirte?';
  alertText = 'Quedan <strong class="txt-dark">2</strong> cupos disponibles';

  alertActions: Array<{
    text: string;
    iconClass?: string;
    colorClass?: string;
    handler: (action: any) => void;
  }> = [
      {
        text: 'Inscribirme',
        iconClass: '<i class="fas fa-check"></i>',
        colorClass: 'b-r-8 btn btn-lg btn-primary',
        handler: (action) => this.closeAlert()
      },
      {
        text: 'Cancelar',
        iconClass: '<i class="fas fa-times"></i>',
        colorClass: 'b-r-8 btn btn-lg btn-outline-primary',
        handler: (action) => this.closeAlert()
      }
    ];

  get computedTags(): string[] {
    if (!this.eventItem) return [];
    const base: string[] = Array.isArray(this.eventItem.tags) && this.eventItem.tags.length
      ? this.eventItem.tags
      : [this.eventItem.category, this.eventItem.status];

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

  tagBadgeClass(tag: string): string {
    const t = (tag || '').toLowerCase();
    if (['seguridad', 'security'].includes(t)) return 'bg-primary';
    if (['comunidad', 'community', 'comunitario'].includes(t)) return 'bg-success';
    if (['anuncio', 'aviso', 'scheduled', 'programado'].includes(t)) return 'bg-warning text-dark';
    if (['infraestructura', 'infrastructure'].includes(t)) return 'bg-info';
    if (['servicios', 'services', 'comercial'].includes(t)) return 'bg-secondary';
    if (['publicado', 'published'].includes(t)) return 'bg-success';
    if (['borrador', 'draft'].includes(t)) return 'bg-secondary';
    if (['urgente', 'important', 'alerta'].includes(t)) return 'bg-danger';
    if (['voluntariado'].includes(t)) return 'bg-info';
    return 'bg-light text-dark';
  }

  // Mock data extended from events.ts structure to support detail view
  readonly events = [
    {
      id: 1,
      title: "Reunión Vecinal",
      summary: "Reunión mensual del barrio para discutir temas de seguridad y mejoras.",
      content: "La reunión mensual del barrio se llevará a cabo en la Plaza Central. Discutiremos los avances en seguridad, las nuevas luminarias y propuestas para el parque. ¡Tu participación es importante!",
      author: "Junta de Vecinos",
      date: "2025-10-25",
      time: "19:00",
      category: "Comunitario",
      status: "Programado",
      image: "assets/images/blog/blog-2.jpg",
      tags: ["Comunitario", "Reunión"],
      meta: {
        description: "Reunión mensual del barrio",
        location: "Plaza Central",
        category: "Comunitario",
      },
    },
    {
      id: 2,
      title: "Feria de Servicios",
      summary: "Muestra de servicios locales y emprendimientos.",
      content: "Ven a conocer los servicios y productos que ofrecen tus vecinos. Habrá stands de comida, artesanías y servicios profesionales. Una excelente oportunidad para apoyar el comercio local.",
      author: "Comité de Desarrollo",
      date: "2025-11-05",
      time: "10:00",
      category: "Comercial",
      status: "Programado",
      image: "assets/images/blog/blog-3.jpg",
      tags: ["Comercial", "Feria"],
      meta: {
        description: "Muestra de servicios locales",
        location: "Centro Comunitario",
        category: "Comercial",
      },
    },
    {
      id: 3,
      title: "Limpieza del Parque",
      summary: "Jornada de limpieza voluntaria para recuperar nuestro parque.",
      content: "Únete a nosotros para limpiar y embellecer el Parque Barrial. Trae guantes y muchas ganas de ayudar. Nosotros proveeremos bolsas y herramientas básicas.",
      author: "Grupo Ecológico",
      date: "2025-10-30",
      time: "08:00",
      category: "Voluntariado",
      status: "Programado",
      image: "assets/images/blog/blog-4.jpg",
      tags: ["Voluntariado", "Limpieza"],
      meta: {
        description: "Jornada de limpieza voluntaria",
        location: "Parque Barrial",
        category: "Voluntariado",
      },
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // For testing purposes, if no ID is present, default to the first event
    this.eventId = this.route.snapshot.paramMap.get('id') || '1';
    if (this.eventId) {
      this.eventItem = this.events.find(n => n.id === +this.eventId!);
    }
  }

  closeAlert() {
    this.showAlert = false;
  }
}
