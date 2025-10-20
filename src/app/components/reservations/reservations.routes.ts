import { Routes } from "@angular/router";

export const reservationsManageRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./reservations").then((m) => m.ReservationsManage),
    data: {
      title: "Reservas Comunitarias",
      breadcrumb: "Reservas Comunitarias",
    },
  },
];