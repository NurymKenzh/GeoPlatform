import { Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

export class GeoServerService {
  private baseUrl: string;
  private apiUrl = 'api/GeoServer/';

  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getURL() {
    return this.http.get(this.baseUrl + this.apiUrl + 'GetURL', { responseType: 'text' as 'json' });
  }

  public getWorkspace() {
    return this.http.get(this.baseUrl + this.apiUrl + 'GetWorkspace', { responseType: 'text' as 'json' });
  }
}
