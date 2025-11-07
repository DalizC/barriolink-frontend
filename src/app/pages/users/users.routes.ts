import { Routes } from "@angular/router";

export const usersRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./users").then((m) => m.Users),
    data: {
      title: "Usuarios",
      breadcrumb: "Usuarios",
    },
  },
  {
    path: "admin",
    loadComponent: () => import("./users-admin/users-admin").then((m) => m.UsersAdmin),
    data: {
      title: "Gestión de Usuarios",
      breadcrumb: "Gestión",
    },
  },
  {
    path: "create",
    loadComponent: () => import("./users-form/users-form").then((m) => m.UsersForm),
    data: {
      title: "Crear Usuario",
      breadcrumb: "Crear",
    },
  },
  {
    path: "edit/:id",
    loadComponent: () => import("./users-form/users-form").then((m) => m.UsersForm),
    data: {
      title: "Editar Usuario",
      breadcrumb: "Editar",
    },
  },
  {
    path: ":id",
    loadComponent: () => import("./users-detail/users-detail").then((m) => m.UsersDetail),
    data: {
      title: "Detalle de Usuario",
      breadcrumb: "Detalle",
    },
  },
];
