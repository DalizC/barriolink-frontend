import { BehaviorSubject } from "rxjs";

import { IMenu } from "../interface/menu";

export const menuItems: IMenu[] = [
  {
    main_title: "General",
  },
  {
    title: "Dashboard",
    icon: "home",
    type: "link",
    bookmark: true,
    path: "/pages/dashboard",
    level: 1,
  },
  {
    main_title: "Gestión de Servicios",
  },
  {
    title: "Proyectos",
    icon: "folder",
    type: "link",
    bookmark: true,
    path: "/pages/projects",
    level: 1,
  },
  {
    title: "Reservaciones",
    icon: "calendar",
    type: "link",
    bookmark: true,
    path: "/pages/reservations",
    level: 1,
  },
  {
    title: "Usuarios",
    icon: "users",
    type: "link",
    bookmark: true,
    path: "/pages/users",
    level: 1,
  },
  {
    title: "Servicios",
    icon: "settings",
    type: "link",
    bookmark: true,
    path: "/pages/services",
    level: 1,
  },
  {
    main_title: "Comunidad",
  },
  {
    title: "Certificaciones",
    icon: "award",
    type: "link",
    bookmark: true,
    path: "/certificates",
    level: 1,
  },
  {
    title: "Eventos",
    icon: "calendar",
    type: "link",
    bookmark: true,
    path: "/events",
    level: 1,
  },
  {
    title: "Noticias",
    icon: "file-text",
    type: "link",
    bookmark: true,
    path: "/news",
    level: 1,
  },
  {
    title: "Proyectos",
    icon: "tool",
    type: "link",
    bookmark: true,
    path: "/projects",
    level: 1,
  },
  {
    title: "Reservas Comunitarias",
    icon: "bookmark",
    type: "link",
    bookmark: true,
    path: "/community-reservations",
    level: 1,
  },
  {
    main_title: "Ejemplos",
  },
  {
    title: "Sample Pages",
    icon: "layers",
    type: "sub",
    active: false,
    level: 1,
    children: [
      { path: "/pages/sample-page1", title: "Sample-page1", type: "link" },
      { path: "/pages/sample-page2", title: "Sample-page2", type: "link" },
    ],
  },
  {
    title: "Sample-page",
    icon: "support-tickets",
    type: "link",
    bookmark: false,
    path: "/sample-page",
    level: 1,
  },
];

// Array
export const items = new BehaviorSubject<IMenu[]>(menuItems);
