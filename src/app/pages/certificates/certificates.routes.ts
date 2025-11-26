import { Routes } from "@angular/router";
import { adminGuard } from "../../core/guards/auth.guard";

export const certificatesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./certificates").then((m) => m.Certificates),
    data: {
      title: "Certificaciones",
      breadcrumb: "Certificaciones",
    },
  },
  {
    path: "my-certificates",
    loadComponent: () => import("./my-certificates/my-certificates").then((m) => m.MyCertificates),
    data: {
      title: "Mis Certificados",
      breadcrumb: "Mis Certificados",
    },
  },
  {
    path: "my-requests",
    loadComponent: () => import("./my-requests/my-requests").then((m) => m.MyRequests),
    data: {
      title: "Mis Solicitudes",
      breadcrumb: "Mis Solicitudes",
    },
  },
  {
    path: "admin",
    loadComponent: () => import("./certificates-admin/certificates-admin").then((m) => m.CertificatesAdmin),
    canActivate: [adminGuard],
    data: {
      title: "Gestión de Certificaciones",
      breadcrumb: "Gestión",
    },
  },
  {
    path: "request",
    loadComponent: () => import("./certificates-request/certificates-request").then((m) => m.CertificatesRequest),
    data: {
      title: "Solicitar Certificado",
      breadcrumb: "Solicitar",
    },
  },
];