import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StyleService } from './style.service';

@Component({
  templateUrl: 'create.component.html'
})

export class StyleCreateComponent implements OnInit {
  files: File[];

  constructor(private router: Router,
    private service: StyleService) { }

  ngOnInit() { }

  public cancel() {
    this.router.navigateByUrl('/styles');
  }

  public create() {
    this.service.post(this.files).subscribe(() => {
      this.router.navigateByUrl('/styles');
    }, error => {
      console.log(error);
    });
  }

  filesChoose(event) {
    this.files = event.target.files;
  }
}
