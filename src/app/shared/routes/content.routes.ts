import { Routes } from "@angular/router";

export const content: Routes = [
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
    data: {
      title: "Certificaciones",
      breadcrumb: "Certificaciones",
    },
    loadChildren: () =>
      import("../../pages/certificates/certificates.routes").then((r) => r.certificatesRoutes),
  },
  {
    path: "events",
    data: {
      title: "Eventos",
      breadcrumb: "Eventos",
    },
    loadChildren: () =>
      import("../../pages/events/events.routes").then((r) => r.eventsRoutes),
  },
  {
    path: "news",
    data: {
      title: "Noticias",
      breadcrumb: "Noticias",
    },
    loadChildren: () =>
      import("../../pages/news/news.routes").then((r) => r.newsRoutes),
  },
  {
    path: "facilities",
    data: {
      title: "Instalaciones",
      breadcrumb: "Instalaciones",
    },
    loadChildren: () =>
      import("../../pages/facilities/facilities.routes").then((r) => r.facilitiesRoutes),
  },
  {
    path: "users",
    data: {
      title: "Usuarios",
      breadcrumb: "Usuarios",
    },
    loadChildren: () =>
      import("../../pages/users/users.routes").then((r) => r.usersRoutes),
  },
];
