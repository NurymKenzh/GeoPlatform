import { Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export class LayerService {
  baseUrl: string;
  apiUrl = 'api/Layers';

  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get(Name?) {
    if (Name) {
      return this.http.get(this.baseUrl + this.apiUrl + '/' + Name);
    } else {
      return this.http.get(this.baseUrl + this.apiUrl);
    }
  }

  post(layer) {
    return this.http.post(this.baseUrl + this.apiUrl + '/', layer);
  }

  put(layer) {
    return this.http.put(this.baseUrl + this.apiUrl + '/' + layer.Name, layer);
  }

  delete(Name) {
    return this.http.delete(this.baseUrl + this.apiUrl + '/' + Name);
  }
}
