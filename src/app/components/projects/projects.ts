import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-projects-manage",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./projects.html",
  styleUrl: "./projects.scss",
})
export class ProjectsManage {
  projects = [
    { id: 1, name: "Mejora Plaza Central", budget: 50000, progress: 65, manager: "Juan Pérez", status: "En Progreso" },
    { id: 2, name: "Renovación Alumbrado", budget: 30000, progress: 90, manager: "María López", status: "Casi Terminado" },
    { id: 3, name: "Parque Infantil", budget: 25000, progress: 25, manager: "Carlos García", status: "Iniciado" },
  ];
}