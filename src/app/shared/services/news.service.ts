import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { NEWS_MOCK_DATA, NewsItem } from '../data/news-mock.data';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NewsFilters {
  searchText?: string;
  tags?: string[];
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor() { }

  /**
   * Get the 5 most recent news for the carousel
   */
  getCarouselNews(): Observable<NewsItem[]> {
    // Sort by date descending and take first 5
    const carouselNews = [...NEWS_MOCK_DATA]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Simulate API delay
    return of(carouselNews).pipe(delay(300));
  }

  /**
   * Get the 2 most recent pinned news for side cards
   */
  getPinnedNews(): Observable<NewsItem[]> {
    // Filter pinned, sort by date descending, take first 2
    const pinnedNews = [...NEWS_MOCK_DATA]
      .filter(news => news.pinned === true)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 2);

    // Simulate API delay
    return of(pinnedNews).pipe(delay(300));
  }

  /**
   * Get paginated news list with optional filters
   * @param page Page number (1-based)
   * @param pageSize Number of items per page
   * @param filters Optional filters (search text, tags, sort order)
   */
  getNewsList(
    page: number = 1,
    pageSize: number = 10,
    filters?: NewsFilters
  ): Observable<PaginatedResponse<NewsItem>> {
    let filteredNews = [...NEWS_MOCK_DATA];

    // Apply search filter
    if (filters?.searchText && filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase();
      filteredNews = filteredNews.filter(news =>
        news.title.toLowerCase().includes(searchLower) ||
        news.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply tags filter
    if (filters?.tags && filters.tags.length > 0) {
      filteredNews = filteredNews.filter(news =>
        news.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    // Apply sort order
    const sortOrder = filters?.sortOrder || 'desc';
    filteredNews.sort((a, b) => {
      const comparison = b.date.getTime() - a.date.getTime();
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    // Calculate pagination
    const total = filteredNews.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredNews.slice(startIndex, endIndex);

    const response: PaginatedResponse<NewsItem> = {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages
    };

    // Simulate API delay
    return of(response).pipe(delay(500));
  }

  /**
   * Get a single news item by ID
   */
  getNewsById(id: number): Observable<NewsItem | undefined> {
    const news = NEWS_MOCK_DATA.find(item => item.id === id);
    return of(news).pipe(delay(300));
  }

  /**
   * Get all available tags (for filter dropdown)
   */
  getAllTags(): Observable<string[]> {
    const allTags = NEWS_MOCK_DATA
      .flatMap(news => news.tags)
      .filter((tag, index, self) => self.indexOf(tag) === index)
      .sort();

    return of(allTags).pipe(delay(200));
  }
}
