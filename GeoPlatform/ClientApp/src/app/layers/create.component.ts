import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LayerService } from './layer.service';

import { StyleService } from '../styles/style.service';
import { Style } from '../styles/style.model';

@Component({
  templateUrl: 'create.component.html'
})

export class LayerCreateComponent implements OnInit {
  public layerForm: FormGroup;
  files: File[];
  styles: Style[];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: LayerService,
    private styleService: StyleService) { }

  ngOnInit() {
    this.layerForm = this.formBuilder.group({
      DefaultStyle: [{ value: '' }]
    });
    this.styleService.get()
      .subscribe(res => {
        this.styles = res as Style[];
      },
        (error => {
          console.log(error);
        })
      );
  }

  public cancel() {
    this.router.navigateByUrl('/layers');
  }

  public create(layerFormValue) {
    this.service.post(layerFormValue.DefaultStyle, this.files).subscribe(() => {
      this.router.navigateByUrl('/layers');
    }, error => {
      console.log(error);
    });
  }

  filesChoose(event) {
    this.files = event.target.files;
  }
}
