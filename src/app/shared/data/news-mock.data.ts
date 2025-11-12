/**
 * Mock data for news/noticias
 * Used for development and testing before backend integration
 */

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: Date;
  author: string;
  hits: number;
  pinned: boolean;
  tags: string[];
}

export const NEWS_MOCK_DATA: NewsItem[] = [
  {
    id: 1,
    title: 'Nueva aplicación móvil para vecinos',
    description: 'Lanzamos una nueva app móvil que permitirá a los vecinos estar conectados en tiempo real con las novedades del barrio.',
    image: 'assets/images/slider/1.jpg',
    date: new Date('2024-04-15'),
    author: 'Admin',
    hits: 245,
    pinned: true,
    tags: ['angular', 'tecnología', 'comunidad']
  },
  {
    id: 2,
    title: 'Jornada de limpieza comunitaria',
    description: 'Este sábado se realizará una jornada de limpieza en la plaza principal. Invitamos a todos los vecinos a participar.',
    image: 'assets/images/blog/blog-2.jpg',
    date: new Date('2024-04-14'),
    author: 'Admin',
    hits: 189,
    pinned: true,
    tags: ['comunidad', 'evento']
  },
  {
    id: 3,
    title: 'Mejoras en iluminación del sector norte',
    description: 'Se han instalado nuevas luminarias LED en las calles del sector norte, mejorando significativamente la seguridad nocturna.',
    image: 'assets/images/slider/2.jpg',
    date: new Date('2024-04-13'),
    author: 'Municipalidad',
    hits: 312,
    pinned: false,
    tags: ['infraestructura', 'seguridad']
  },
  {
    id: 4,
    title: 'Taller de huertos urbanos',
    description: 'Aprende a crear tu propio huerto en casa. Taller gratuito para todos los vecinos este miércoles a las 18:00.',
    image: 'assets/images/blog/blog-3.jpg',
    date: new Date('2024-04-12'),
    author: 'Centro Comunitario',
    hits: 156,
    pinned: false,
    tags: ['educación', 'sustentabilidad']
  },
  {
    id: 5,
    title: 'Renovación de áreas verdes',
    description: 'El municipio anuncia la renovación completa de las áreas verdes en tres plazas del barrio con nuevas especies nativas.',
    image: 'assets/images/slider/3.jpg',
    date: new Date('2024-04-11'),
    author: 'Admin',
    hits: 278,
    pinned: false,
    tags: ['infraestructura', 'medio ambiente']
  },
  {
    id: 6,
    title: 'Feria de emprendedores locales',
    description: 'Este domingo se realizará la primera feria de emprendedores del barrio. Apoya a tus vecinos y conoce sus productos.',
    image: 'assets/images/blog/blog-5.jpg',
    date: new Date('2024-04-10'),
    author: 'Junta de Vecinos',
    hits: 423,
    pinned: false,
    tags: ['economía', 'comunidad']
  },
  {
    id: 7,
    title: 'Nuevo horario de recolección de basura',
    description: 'A partir del próximo lunes, el servicio de recolección de basura tendrá nuevos horarios. Revisa los detalles.',
    image: 'assets/images/slider/4.jpg',
    date: new Date('2024-04-09'),
    author: 'Servicios',
    hits: 512,
    pinned: false,
    tags: ['servicios', 'información']
  },
  {
    id: 8,
    title: 'Clases gratuitas de yoga en la plaza',
    description: 'Todos los martes y jueves a las 7:00 AM, clases de yoga al aire libre. No se requiere experiencia previa.',
    image: 'assets/images/blog/blog-2.jpg',
    date: new Date('2024-04-08'),
    author: 'Deportes',
    hits: 198,
    pinned: false,
    tags: ['deporte', 'salud']
  },
  {
    id: 9,
    title: 'Instalación de cámaras de seguridad',
    description: 'Se instalarán 15 nuevas cámaras de seguridad en puntos estratégicos del barrio para mayor tranquilidad de los vecinos.',
    image: 'assets/images/slider/1.jpg',
    date: new Date('2024-04-07'),
    author: 'Seguridad',
    hits: 634,
    pinned: false,
    tags: ['seguridad', 'tecnología']
  },
  {
    id: 10,
    title: 'Biblioteca comunitaria busca donaciones',
    description: 'La biblioteca está recibiendo donaciones de libros en buen estado. Ayúdanos a ampliar nuestra colección.',
    image: 'assets/images/blog/blog-3.jpg',
    date: new Date('2024-04-06'),
    author: 'Biblioteca',
    hits: 145,
    pinned: false,
    tags: ['educación', 'cultura']
  },
  {
    id: 11,
    title: 'Ciclovía temporal los domingos',
    description: 'Cada domingo se habilitará una ciclovía temporal en la avenida principal de 8:00 a 14:00 horas.',
    image: 'assets/images/slider/2.jpg',
    date: new Date('2024-04-05'),
    author: 'Tránsito',
    hits: 289,
    pinned: false,
    tags: ['deporte', 'movilidad']
  },
  {
    id: 12,
    title: 'Festival cultural de primavera',
    description: 'El próximo mes se realizará el festival cultural con presentaciones de música, danza y teatro local.',
    image: 'assets/images/blog/blog-5.jpg',
    date: new Date('2024-04-04'),
    author: 'Cultura',
    hits: 367,
    pinned: false,
    tags: ['cultura', 'evento']
  },
  {
    id: 13,
    title: 'Programa de reciclaje comunitario',
    description: 'Nuevo programa de reciclaje con puntos de recolección de papel, plástico y vidrio en ubicaciones estratégicas.',
    image: 'assets/images/slider/3.jpg',
    date: new Date('2024-04-03'),
    author: 'Medio Ambiente',
    hits: 421,
    pinned: false,
    tags: ['medio ambiente', 'sustentabilidad']
  },
  {
    id: 14,
    title: 'Vacunación antirrábica gratuita',
    description: 'Este viernes jornada de vacunación antirrábica gratuita para mascotas en el gimnasio municipal.',
    image: 'assets/images/blog/blog-2.jpg',
    date: new Date('2024-04-02'),
    author: 'Salud',
    hits: 234,
    pinned: false,
    tags: ['salud', 'mascotas']
  },
  {
    id: 15,
    title: 'Curso de computación para adultos mayores',
    description: 'Inscripciones abiertas para curso gratuito de computación básica dirigido a adultos mayores.',
    image: 'assets/images/slider/4.jpg',
    date: new Date('2024-04-01'),
    author: 'Educación',
    hits: 178,
    pinned: false,
    tags: ['educación', 'tecnología']
  },
  {
    id: 16,
    title: 'Reparación de veredas en calle principal',
    description: 'Se iniciarán trabajos de reparación de veredas en la calle principal. Se solicita precaución al transitar.',
    image: 'assets/images/blog/blog-3.jpg',
    date: new Date('2024-03-31'),
    author: 'Obras',
    hits: 267,
    pinned: false,
    tags: ['infraestructura', 'información']
  },
  {
    id: 17,
    title: 'Mercado de productores orgánicos',
    description: 'Cada sábado mercado de productores locales con frutas, verduras y productos orgánicos frescos.',
    image: 'assets/images/slider/1.jpg',
    date: new Date('2024-03-30'),
    author: 'Economía Local',
    hits: 345,
    pinned: false,
    tags: ['economía', 'sustentabilidad']
  },
  {
    id: 18,
    title: 'Campaña de adopción de mascotas',
    description: 'El refugio local organiza jornada de adopción responsable de perros y gatos este fin de semana.',
    image: 'assets/images/blog/blog-5.jpg',
    date: new Date('2024-03-29'),
    author: 'Refugio',
    hits: 456,
    pinned: false,
    tags: ['mascotas', 'comunidad']
  }
];
