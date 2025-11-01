import { Routes } from "@angular/router";

export const newsRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./news").then((m) => m.News),
    data: {
      title: "Noticias",
      breadcrumb: "Noticias",
    },
  },
];