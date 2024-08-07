import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ApiService {

  public baseUrl: any;
  constructor (private http: HttpClient, private jwtService: JwtService) {
    this.baseUrl = environment.asset_url;
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}, headers = {}): Observable<any> {
    const httpHeaders = new HttpHeaders();

    for (let i in headers) {
      console.log(i, headers, headers[i])
      httpHeaders.set(i, headers[i]);
    }
    console.log(httpHeaders)
    return this.http.post(`${environment.api_url}${path}`, JSON.stringify(body), { headers: httpHeaders })
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }

  loadData(path): Observable<any> {
    return this.http.get(`/assets/response${path}`).pipe(catchError(this.formatErrors));
  }
}
