import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "pages",
    data: {
      title: "sample-page",
      breadcrumb: "sample-page",
    },
    loadChildren: () =>
      import("../../pages/pages.routes").then((r) => r.pages),
  },
  {
    path: "projects",
    data: {
      title: "Proyectos",
      breadcrumb: "Proyectos",
    },
    loadChildren: () =>
      import("../../pages/projects/projects.routes").then(
        (r) => r.projects,
      ),
  },
  {
    path: "certificates",
    loadComponent: () => import("../../pages/certificates/certificates").then((m) => m.Certificates),
    data: {
      title: "Certificaciones",
      breadcrumb: "Certificaciones",
    },
  },
  {
    path: "events",
    loadComponent: () => import("../../pages/events/events").then((m) => m.Events),
    data: {
      title: "Eventos",
      breadcrumb: "Eventos",
    },
  },
  {
    path: "news",
    loadComponent: () => import("../../pages/news/news").then((m) => m.News),
    data: {
      title: "Noticias",
      breadcrumb: "Noticias",
    },
  },
  {
    path: "community-reservations",
    loadComponent: () => import("../../pages/reservations/reservations").then((m) => m.ReservationsManage),
    data: {
      title: "Reservas Comunitarias",
      breadcrumb: "Reservas Comunitarias",
    },
  },
  {
    path: "sample-page",
    data: {
      title: "sample-page",
      breadcrumb: "sample-page",
    },
    loadChildren: () =>
      import("../../pages/sample-page/sample-pages.routes").then(
        (r) => r.samplePages,
      ),
  },
];
