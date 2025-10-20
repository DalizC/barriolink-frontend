import { Routes } from "@angular/router";

export const certificatesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./certificates").then((m) => m.Certificates),
    data: {
      title: "Certificaciones",
      breadcrumb: "Certificaciones",
    },
  },
];