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
];