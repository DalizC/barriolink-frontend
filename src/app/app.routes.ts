import { Routes } from "@angular/router";

import { content } from "./shared/routes/content.routes";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/news",
    pathMatch: "full",
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("./auth/login/login").then((m) => m.Login),
        data: {
          title: "Iniciar Sesión",
        },
      },
      {
        path: "register",
        loadComponent: () =>
          import("./pages/users/users-form/users-form").then((m) => m.UsersForm),
        data: {
          title: "Crear Cuenta",
        },
      },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    loadComponent: () =>
      import("./shared/components/layout/content/content").then(
        (m) => m.Content,
      ),
    children: content,
  },
  {
    path: "**",
    redirectTo: "",
  },
];
