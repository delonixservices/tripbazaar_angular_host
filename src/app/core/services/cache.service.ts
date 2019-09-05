import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  // cache store
  private cache = new Map<string, { key: string, expired: number, response: HttpResponse<any> }>();
  // cache will expire after 15 min = 15*60*1000 ms
  private maxAge = 900000;

  constructor() { }

  put(req: HttpRequest<any>, response: HttpResponse<any>) {
    // key for setting and getting cached data
    const key = JSON.stringify(req.urlWithParams + req.body);

    const entry = { key, expired: Date.now() + this.maxAge, response };
    this.cache.set(key, entry);
  }

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const key = JSON.stringify(req.urlWithParams + req.body);
    // deleting expired cache
    this.cache.forEach((expiredEntry) => {
      if (expiredEntry.expired < Date.now()) {
        this.cache.delete(expiredEntry.key);
        console.log('expiredEntry', expiredEntry.key);
      }
    });
    // reset cache for the uri if reset-cache header is provided
    if (req.headers.get("reset-cache")) {
      this.cache.delete(key);
    }
    // Checked if there is cached data for this URI
    const cached = this.cache.get(key);
    if (!cached) return null;
    const httpResponse = cached.response;
    return httpResponse;
  }
}
