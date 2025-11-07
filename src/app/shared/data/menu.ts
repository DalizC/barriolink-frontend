import { BehaviorSubject } from "rxjs";

import { IMenu } from "../interface/menu";

export const menuItems: IMenu[] = [
  {
    main_title: "General",
  },
  {
    title: "Inicio",
    icon: "home",
    type: "link",
    path: "/home",
    active: false,
    level: 1,
  },
  {
    title: "Noticias",
    icon: "blog",
    type: "link",
    level: 1,
    children: [
      { path: "/news", title: "Ver Noticias", type: "link" },
      { path: "/news/create", title: "Publicar Noticia", type: "link" },
      {
        title: "Mis Noticias",
        id: "my-news",
        type: "sub",
        level: 2,
        active: false,
        children: [
          { path: "/news/my-news", title: "Ver Mis Noticias", type: "link" },
        ],
      },
      {
        title: "Administrar Noticias",
        id: "admin-news",
        type: "sub",
        level: 2,
        active: false,
        children: [
          { path: "/news/admin", title: "Ver Todas las Noticias", type: "link" },
        ],
      },
    ],
  },
  {
    title: "Eventos",
    icon: "calendar",
    type: "link",
    active: false,
    level: 1,
    children: [
      { path: "/events", title: "Ver Eventos", type: "link" },
      { path: "/events/create", title: "Publicar Evento", type: "link" },
      {
        title: "Mis Eventos",
        id: "my-events",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/events/my-events", title: "Mis Eventos Creados", type: "link"},
          { path: "/events/my-registrations", title: "Mis Inscripciones", type: "link" },
        ]
      },
      {
        title: "Administrar Eventos",
        id: "admin-events",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/events/admin", title: "Ver Todos los Eventos", type: "link" },
        ]
      },
    ],
  },
  {
    title: "Proyectos",
    icon: "form",
    type: "sub",
    active: false,
    level: 1,
    children: [
      { path: "/projects", title: "Ver Proyectos", type: "link" },
      { path: "/projects/create", title: "Crear Proyecto", type: "link" },
      {
        title: "Mis Proyectos",
        id: "my-projects",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/projects/my-applications", title: "Mis Postulaciones", type: "link" },
        ]
      },
      {
        title: "Administrar Proyectos",
        id: "admin-projects",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/projects/admin", title: "Ver Todos los Proyectos", type: "link" },
        ]
      },
    ],
  },
  {
    title: "Espacios Comunitarios",
    icon: "maps",
    type: "sub",
    active: false,
    level: 1,
    children: [
      { path: "/facilities", title: "Ver Espacios", type: "link" },
      {
        title: "Mis Reservas",
        id: "my-bookings",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/facilities/my-bookings", title: "Ver Mis Reservas", type: "link" },
        ]
      },
      {
        title: "Administrar Espacios",
        id: "admin-facilities",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/facilities/create", title: "Registrar Espacio", type: "link" },
          { path: "/facilities/admin", title: "Ver Todos los Espacios", type: "link" },
        ]
      },
    ],
  },
  {
    title: "Miembros",
    icon: "user",
    type: "link",
    level: 1,
    children: [
      { path: "/users", title: "Ver Miembros", type: "link" },
      {
        title: "Administrar Usuarios",
        id: "admin-users",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/users/create", title: "Registrar Usuario", type: "link" },
          { path: "/users/admin", title: "Ver Todos los Usuarios", type: "link" },
        ]
      },
    ],
  },
  {
    main_title: "Comunidad",
  },
  {
    title: "Certificaciones",
    icon: "award",
    type: "sub",
    active: false,
    level: 1,
    children: [
      { path: "/certificates", title: "Ver Certificados", type: "link" },
      { path: "/certificates/request", title: "Solicitar Certificado", type: "link" },
      {
        title: "Mis Certificados",
        id: "my-certificates",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/certificates/my-certificates", title: "Mis Certificados", type: "link" },
          { path: "/certificates/my-requests", title: "Mis Solicitudes", type: "link" },
        ]
      },
      {
        title: "Administrar Certificados",
        id: "admin-certificates",
        type: "sub",
        active: false,
        level: 2,
        children: [
          { path: "/certificates/admin", title: "Ver Todas las Solicitudes", type: "link" },
        ]
      },
    ],
  },
  /*{
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
  },*/
];

// Array
export const items = new BehaviorSubject<IMenu[]>(menuItems);
