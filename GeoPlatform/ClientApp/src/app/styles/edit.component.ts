import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { StyleService } from './style.service';
import { Style } from './style.model';

@Component({
  templateUrl: 'edit.component.html'
})

export class StyleEditComponent implements OnInit {
  public styleForm: FormGroup;
  file: File;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: StyleService) { }

  ngOnInit() {
    this.styleForm = this.formBuilder.group({
      Name: [{ value: '', disabled: true }]
    });
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.service.get(name)
      .subscribe(res => {
        this.styleForm.patchValue(res as Style);
      },
        (error => {
          console.log(error);
        })
      );
  }

  public error(control: string,
    error: string) {
    return this.styleForm.controls[control].hasError(error);
  }

  public cancel() {
    this.router.navigateByUrl('/styles');
  }

  public save(styleFormValue) {
    const style: Style = {
      Name: styleFormValue.Name,
      Code: ''
    }
    this.service.put(style, this.file)
      .subscribe(() => {
        this.router.navigateByUrl('/styles');
      },
        (error => {
          console.log(error);
        })
      )
  }

  filesChoose(event) {
    this.file = event.target.files[0];
  }
}
