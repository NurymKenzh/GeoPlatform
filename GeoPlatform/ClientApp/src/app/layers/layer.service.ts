import { Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export class LayerService {
  private baseUrl: string;
  private apiUrl = 'api/Layers/';

  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get(Name?) {
    if (Name) {
      return this.http.get(this.baseUrl + this.apiUrl + Name);
    } else {
      return this.http.get(this.baseUrl + this.apiUrl);
    }
  }

  post(defaultStyle, files: File[]) {
    const formData: FormData = new FormData();
    formData.append('DefaultStyle', defaultStyle);
    for (let i = 0; i < files.length; i++) {
      formData.append('fileKey', files[i], files[i].name);
    }
    return this.http
      .post(this.baseUrl + this.apiUrl, formData);
  }

  put(layer) {
    return this.http.put(this.baseUrl + this.apiUrl + layer.Name, layer);
  }

  delete(Name) {
    return this.http.delete(this.baseUrl + this.apiUrl + Name);
  }
}
