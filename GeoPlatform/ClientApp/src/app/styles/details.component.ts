import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StyleService } from './style.service';
import { Style } from './style.model';

@Component({
  templateUrl: 'details.component.html'
})

export class StyleDetailsComponent implements OnInit {
  public style: Style;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: StyleService) { }

  ngOnInit() {
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.service.get(name)
      .subscribe(res => {
        this.style = res as Style;
      },
        (error => {
          console.log(error);
        })
      );
  }

  public cancel() {
    this.router.navigateByUrl('/styles');
  }
}
