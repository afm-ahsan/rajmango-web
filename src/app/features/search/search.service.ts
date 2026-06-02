import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalSearchResult } from './models/search-result.model';

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  private readonly apiUrl = `${environment.apis.default.url}/api/search`;
  private readonly storageKey = 'rm_recent_searches';
  private readonly maxRecent = 5;

  constructor(private http: HttpClient) {}

  search(term: string, maxPerSection = 5): Observable<any> {
    const params = new HttpParams()
      .set('term', term)
      .set('maxPerSection', maxPerSection);
    return this.http.get<any>(this.apiUrl, { params });
  }

  getRecentSearches(): string[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
    } catch {
      return [];
    }
  }

  saveRecentSearch(term: string): void {
    const trimmed = term.trim();
    if (!trimmed) return;
    const recent = this.getRecentSearches().filter(t => t !== trimmed);
    recent.unshift(trimmed);
    localStorage.setItem(this.storageKey, JSON.stringify(recent.slice(0, this.maxRecent)));
  }

  removeRecentSearch(term: string): void {
    const recent = this.getRecentSearches().filter(t => t !== term);
    localStorage.setItem(this.storageKey, JSON.stringify(recent));
  }

  clearRecentSearches(): void {
    localStorage.removeItem(this.storageKey);
  }
}
