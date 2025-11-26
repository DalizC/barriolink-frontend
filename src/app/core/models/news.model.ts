import { Category } from './category.model';

export interface NewsAuthor {
  id: number;
  name: string;
  email: string;
}

export interface News {
  id: number;
  tenant_id: number;
  author: NewsAuthor;
  title: string;
  content: string;
  summary: string;
  link: string | null;
  image: string | null;
  cover_image: string | null; // Deprecated, mantener por compatibilidad
  status: 'draft' | 'published' | 'archived';
  categories: number[];
  categories_detail: Category[];
  published_at: string | null;
  archived_at: string | null;
  published_by: NewsAuthor | null;
  archived_by: NewsAuthor | null;
  created_at: string;
  updated_at: string;
}