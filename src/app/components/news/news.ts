import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-news",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./news.html",
  styleUrl: "./news.scss",
})
export class News {
  news = [
    { 
      id: 1, 
      title: "Nuevo Sistema de Seguridad", 
      summary: "Se instalaron cámaras de seguridad en las principales calles del barrio.",
      content: "La municipalidad ha instalado un moderno sistema de videovigilancia...",
      author: "Administrador",
      date: "2024-10-18",
      category: "Seguridad",
      status: "Publicado"
    },
    { 
      id: 2, 
      title: "Mejoras en el Alumbrado Público", 
      summary: "Reemplazo de luminarias LED en toda la zona residencial.",
      content: "Como parte del plan de modernización urbana...",
      author: "María García",
      date: "2024-10-15",
      category: "Infraestructura",
      status: "Publicado"
    },
    { 
      id: 3, 
      title: "Próximo Corte de Agua Programado", 
      summary: "Mantenimiento de la red de agua potable el próximo fin de semana.",
      content: "La empresa de servicios públicos anuncia...",
      author: "Carlos López",
      date: "2024-10-20",
      category: "Servicios",
      status: "Borrador"
    },
  ];
}