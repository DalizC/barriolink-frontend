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
