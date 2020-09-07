import { Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export class CountryService {
  private baseUrl: string;
  private apiUrl = 'api/Countries/';

  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get(Id?) {
    if (Id) {
      return this.http.get(this.baseUrl + this.apiUrl + Id);
    } else {
      return this.http.get(this.baseUrl + this.apiUrl);
    }
  }

  post(country) {
    return this.http.post(this.baseUrl + this.apiUrl, country);
  }

  put(country) {
    return this.http.put(this.baseUrl + this.apiUrl + country.Id, country);
  }

  delete(Id) {
    return this.http.delete(this.baseUrl + this.apiUrl + Id);
  }
}
