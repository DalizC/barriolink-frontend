import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';

export interface NewsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: News[];
}

export interface NewsFilters {
  status?: 'draft' | 'published' | 'archived';
  category?: number;
  search?: string;
  author?: number;
  page?: number;
  page_size?: number;
}

export interface NewsCreate {
  title: string;
  content: string;
  summary: string;
  link?: string;
  image?: string;
  status?: 'draft' | 'published';
  categories: number[];
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://127.0.0.1:8000/api/news/';

  constructor(private http: HttpClient) {}

  getNews(filters?: NewsFilters): Observable<NewsListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.category) params = params.set('category', filters.category.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.author) params = params.set('author', filters.author.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.page_size) params = params.set('page_size', filters.page_size.toString());
    }

    return this.http.get<NewsListResponse>(this.apiUrl, { params });
  }

  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}${id}/`);
  }

  createNews(newsData: NewsCreate): Observable<News> {
    return this.http.post<News>(this.apiUrl, newsData);
  }

  updateNews(id: number, newsData: Partial<NewsCreate>): Observable<News> {
    return this.http.patch<News>(`${this.apiUrl}${id}/`, newsData);
  }

  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // TODO: Cambiar estos métodos a PATCH en lugar de POST para seguir convenciones REST
  // El backend actualmente usa @action(detail=True, methods=['post']) pero debería ser methods=['patch']
  publishNews(id: number): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}${id}/publish/`, {});
  }

  archiveNews(id: number): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}${id}/archive/`, {});
  }

  draftNews(id: number): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}${id}/draft/`, {});
  }

  uploadImage(id: number, imageFile: File): Observable<News> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<News>(`${this.apiUrl}${id}/upload-image/`, formData);
  }
}
