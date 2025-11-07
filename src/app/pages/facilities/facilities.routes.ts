import { Routes } from "@angular/router";

export const facilitiesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./facilities").then((m) => m.Facilities),
    data: {
      title: "Instalaciones",
      breadcrumb: "Instalaciones",
    },
  },
  {
    path: "my-bookings",
    loadComponent: () => import("./my-bookings/my-bookings").then((m) => m.MyBookings),
    data: {
      title: "Mis Reservas",
      breadcrumb: "Mis Reservas",
    },
  },
  {
    path: "admin",
    loadComponent: () => import("./facilities-admin/facilities-admin").then((m) => m.FacilitiesAdmin),
    data: {
      title: "Gestión de Instalaciones",
      breadcrumb: "Gestión",
    },
  },
  {
    path: "create",
    loadComponent: () => import("./facilities-form/facilities-form").then((m) => m.FacilitiesForm),
    data: {
      title: "Crear Instalación",
      breadcrumb: "Crear",
    },
  },
  {
    path: "edit/:id",
    loadComponent: () => import("./facilities-form/facilities-form").then((m) => m.FacilitiesForm),
    data: {
      title: "Editar Instalación",
      breadcrumb: "Editar",
    },
  },
  {
    path: ":id/booking",
    loadComponent: () => import("./facilities-booking/facilities-booking").then((m) => m.FacilitiesBooking),
    data: {
      title: "Reservar Instalación",
      breadcrumb: "Reservar",
    },
  },
];
