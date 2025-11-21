import { Routes } from "@angular/router";

export const eventsRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./events").then((m) => m.Events),
    data: {
      title: "Eventos",
      breadcrumb: "Eventos",
    },
  },
  {
    path: "my-events",
    loadComponent: () => import("./my-events/my-events").then((m) => m.MyEvents),
    data: {
      title: "Mis Eventos",
      breadcrumb: "Mis Eventos",
    },
  },
  {
    path: "my-registrations",
    loadComponent: () => import("./my-registrations/my-registrations").then((m) => m.MyRegistrations),
    data: {
      title: "Mis Inscripciones",
      breadcrumb: "Mis Inscripciones",
    },
  },
  {
    path: "admin",
    loadComponent: () => import("./events-admin/events-admin").then((m) => m.EventsAdmin),
    data: {
      title: "Gestión de Eventos",
      breadcrumb: "Gestión",
    },
  },
  {
    path: "create",
    loadComponent: () => import("./events-form/events-form").then((m) => m.EventsForm),
    data: {
      title: "Crear Evento",
      breadcrumb: "Crear",
    },
  },
  {
    path: "edit/:id",
    loadComponent: () => import("./events-form/events-form").then((m) => m.EventsForm),
    data: {
      title: "Editar Evento",
      breadcrumb: "Editar",
    },
  },
  {
    path: ":id/signup",
    loadComponent: () => import("./events-signup/events-signup").then((m) => m.EventsSignup),
    data: {
      title: "Inscribirse al Evento",
      breadcrumb: "Inscribirse",
    },
  },
  {
    path: ":id",
    loadComponent: () => import("./events-detail/events-detail").then((m) => m.EventsDetail),
    data: {
      title: "Detalle de Evento",
      breadcrumb: "Detalle",
      hideBreadcrumbs: true,
    },
  },
];