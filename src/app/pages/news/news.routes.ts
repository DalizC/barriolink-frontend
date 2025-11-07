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
  {
    path: "my-news",
    loadComponent: () => import("./my-news/my-news").then((m) => m.MyNews),
    data: {
      title: "Mis Noticias",
      breadcrumb: "Mis Noticias",
    },
  },
  {
    path: "admin",
    loadComponent: () => import("./news-admin/news-admin").then((m) => m.NewsAdmin),
    data: {
      title: "Gestión de Noticias",
      breadcrumb: "Gestión",
    },
  },
  {
    path: "create",
    loadComponent: () => import("./news-form/news-create").then((m) => m.NewsForm),
    data: {
      title: "Crear Noticia",
      breadcrumb: "Crear",
    },
  },
  {
    path: "edit/:id",
    loadComponent: () => import("./news-form/news-create").then((m) => m.NewsForm),
    data: {
      title: "Editar Noticia",
      breadcrumb: "Editar",
    },
  },
  {
    path: ":id",
    loadComponent: () => import("./news-detail/news-detail").then((m) => m.NewsDetail),
    data: {
      title: "Detalle de Noticia",
      breadcrumb: "Detalle",
    },
  },
];