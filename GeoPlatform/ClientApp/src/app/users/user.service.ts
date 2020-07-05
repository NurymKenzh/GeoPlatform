import { Injectable, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;
  apiUrl = 'api/Users/';

  constructor(private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private router: Router) {
    this.baseUrl = baseUrl;
  }

  formRegisterModel = this.formBuilder.group(
    {
      Email: ['', Validators.email],
      Passwords: this.formBuilder.group(
        {
          Password: ['', [Validators.required, Validators.minLength(6)]],
          ConfirmPassword: ['', Validators.required]
        },
        {
          validator: this.comparePasswords
        })
    });

  register() {
    const body = {
      Email: this.formRegisterModel.value.Email,
      Password: this.formRegisterModel.value.Passwords.Password
    };
    return this.httpClient.post(this.baseUrl + this.apiUrl + 'Register', body);
  }

  login(user) {
    return this.httpClient.post(this.baseUrl + this.apiUrl + 'Login', user);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  authorizedUser() {
    return localStorage.getItem('token') != null;
  }

  getAuthorizedUserInfo() {
    return this.httpClient.get(this.baseUrl + this.apiUrl + 'GetAuthorizedUserInfo');
  }

  comparePasswords(formBuilder: FormGroup) {
    const confirmPassword = formBuilder.get('ConfirmPassword');
    if (confirmPassword.errors == null || 'passwordMismatch' in confirmPassword.errors) {
      if (formBuilder.get('Password').value != confirmPassword.value)
        confirmPassword.setErrors({ passwordMismatch: true });
      else
        confirmPassword.setErrors(null);
    }
  }
}
