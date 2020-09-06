import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LayerService } from './layer.service';

@Component({
  templateUrl: 'create.component.html'
})

export class LayerCreateComponent implements OnInit {
  files: File[];

  constructor(private router: Router,
    private service: LayerService) { }

  ngOnInit() { }

  public cancel() {
    this.router.navigateByUrl('/layers');
  }

  public create() {
    this.service.post(this.files).subscribe(() => {
      this.router.navigateByUrl('/layers');
    }, error => {
      console.log(error);
    });
  }

  filesChoose(event) {
    this.files = event.target.files;
  }
}
