import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CountryService } from './country.service';
import { Country } from './country.model';

@Component({
  templateUrl: 'details.component.html'
})

export class CountryDetailsComponent implements OnInit {
  public country: Country;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CountryService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.service.get(id)
      .subscribe(res => {
        this.country = res as Country;
      },
        (error => {
          console.log(error);
        })
      );
  }

  public cancel() {
    this.router.navigateByUrl('/countries');
  }
}
