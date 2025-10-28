import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "pages",
    data: {
      title: "sample-page",
      breadcrumb: "sample-page",
    },
    loadChildren: () =>
      import("../../components/pages/pages.routes").then((r) => r.pages),
  },
  {
    path: "projects",
    data: {
      title: "Proyectos",
      breadcrumb: "Proyectos",
    },
    loadChildren: () =>
      import("../../components/projects/projects.routes").then(
        (r) => r.projects,
      ),
  },
  {
    path: "certificates",
    loadComponent: () => import("../../components/certificates/certificates").then((m) => m.Certificates),
    data: {
      title: "Certificaciones",
      breadcrumb: "Certificaciones",
    },
  },
  {
    path: "events",
    loadComponent: () => import("../../components/events/events").then((m) => m.Events),
    data: {
      title: "Eventos",
      breadcrumb: "Eventos",
    },
  },
  {
    path: "news",
    loadComponent: () => import("../../components/news/news").then((m) => m.News),
    data: {
      title: "Noticias",
      breadcrumb: "Noticias",
    },
  },
  {
    path: "community-reservations",
    loadComponent: () => import("../../components/reservations/reservations").then((m) => m.ReservationsManage),
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
      import("../../components/sample-page/sample-pages.routes").then(
        (r) => r.samplePages,
      ),
  },
];
