import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services';

@Injectable()

export class HttpCacheInterceptor implements HttpInterceptor {

    constructor(private cacheService: CacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const cacheable = req.urlWithParams.indexOf('/search') > 0 || req.urlWithParams.indexOf('/suggest') > 0 ? true : false;

        if (cacheable) {
            const cached = this.cacheService.get(req) || null;
            if (cached) {
                console.log('Response from cache', cached);
                return of(cached);
            }
        }

        return next.handle(req).pipe(tap(((event) => {
            if (event instanceof HttpResponse && cacheable) {
                console.log('Response from server', event.url);
                this.cacheService.put(req, event);
            }
        })))
    }
}
