import { Routes } from "@angular/router";

export const projects: Routes = [
  {
    path: "",
    children: [
      {
        path: "my-projects",
        loadComponent: () =>
          import("./my-projects/my-projects").then((m) => m.MyProjectsComponent),
        data: {
          title: "Mis Proyectos",
          breadcrumb: "Mis Proyectos",
        },
      },
      {
        path: "projects-list",
        loadComponent: () =>
          import("./projects-list/projects-list").then((m) => m.ProjectsListComponent),
        data: {
          title: "Listado de Proyectos",
          breadcrumb: "Listado de Proyectos",
        },
      },
      {
        path: "projects-create",
        loadComponent: () =>
          import("./projects-create/projects-create").then((m) => m.ProjectsCreateComponent),
        data: {
          title: "Crear Proyecto",
          breadcrumb: "Crear Proyecto",
        },
      },
    ],
  },
];
