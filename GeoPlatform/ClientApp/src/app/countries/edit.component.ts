import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CountryService } from './country.service';
import { Country } from './country.model';

@Component({
  templateUrl: 'edit.component.html'
})

export class CountryEditComponent implements OnInit {
  public countryForm: FormGroup;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CountryService) { }

  ngOnInit() {
    this.countryForm = new FormGroup({
      Id: new FormControl(),
      Name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      Code: new FormControl('', [Validators.required, Validators.maxLength(2)])
    });
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.service.get(id)
      .subscribe(res => {
        this.countryForm.patchValue(res as Country);
      },
        (error => {
          console.log(error);
        })
      );
  }

  public error(control: string,
    error: string) {
    return this.countryForm.controls[control].hasError(error);
  }

  public cancel() {
    this.router.navigateByUrl('/countries');
  }

  public save(countryFormValue) {
    if (this.countryForm.valid) {
      const country: Country = {
        Id: countryFormValue.Id,
        Name: countryFormValue.Name,
        Code: countryFormValue.Code
      }
      this.service.put(country)
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
