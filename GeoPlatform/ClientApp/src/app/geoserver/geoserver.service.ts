import { Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

export class GeoServerService {
  private baseUrl: string;
  private apiUrl = 'api/GeoServer/';

  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getURLs() {
    return this.http.get(this.baseUrl + this.apiUrl + 'GetURL', { responseType: 'text' as 'json' });
  }
}
