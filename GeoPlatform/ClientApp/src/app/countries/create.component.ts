import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CountryService } from './country.service';
import { Country } from './country.model';

@Component({
  templateUrl: 'create.component.html'
})

export class CountryCreateComponent implements OnInit {
  public countryForm: FormGroup;

  constructor(private router: Router,
    private service: CountryService) { }

  ngOnInit() {
    this.countryForm = new FormGroup({
      NameEN: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      NamePL: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      Code: new FormControl('', [Validators.required, Validators.maxLength(2)])
    });
  }

  public error(control: string,
    error: string) {
    return this.countryForm.controls[control].hasError(error);
  }

  public cancel() {
    this.router.navigateByUrl('/countries');
  }

  public create(countryFormValue) {
    if (this.countryForm.valid) {
      const country: Country = {
        Id: 0,
        NameEN: countryFormValue.NameEN,
        NamePL: countryFormValue.NamePL,
        Name: '',
        Code: countryFormValue.Code
      }
      this.service.post(country)
        .subscribe(() => {
          this.router.navigateByUrl('/countries');
        },
          (error => {
            console.log(error);
          })
        )
    }
  }
}
