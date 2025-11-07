import { Routes } from "@angular/router";

export const projects: Routes = [
  {
    path: "",
    loadComponent: () => import("./projects").then((m) => m.Projects),
    data: {
      title: "Proyectos",
      breadcrumb: "Proyectos",
    },
  },
  {
    path: "my-applications",
    loadComponent: () => import("./my-applications/my-applications").then((m) => m.MyApplications),
    data: {
      title: "Mis Postulaciones",
      breadcrumb: "Mis Postulaciones",
    },
  },
  {
    path: "admin",
    loadComponent: () => import("./projects-admin/projects-admin").then((m) => m.ProjectsAdmin),
    data: {
      title: "Gestión de Proyectos",
      breadcrumb: "Gestión",
    },
  },
  {
    path: "create",
    loadComponent: () => import("./projects-form/projects-form").then((m) => m.ProjectsForm),
    data: {
      title: "Crear Proyecto",
      breadcrumb: "Crear",
    },
  },
  {
    path: "edit/:id",
    loadComponent: () => import("./projects-form/projects-form").then((m) => m.ProjectsForm),
    data: {
      title: "Editar Proyecto",
      breadcrumb: "Editar",
    },
  },
  {
    path: ":id/apply",
    loadComponent: () => import("./projects-apply/projects-apply").then((m) => m.ProjectsApply),
    data: {
      title: "Postular a Proyecto",
      breadcrumb: "Postular",
    },
  },
  {
    path: ":id",
    loadComponent: () => import("./projects-detail/projects-detail").then((m) => m.ProjectsDetail),
    data: {
      title: "Detalle de Proyecto",
      breadcrumb: "Detalle",
    },
  },
];
