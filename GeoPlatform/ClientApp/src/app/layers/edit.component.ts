import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { LayerService } from './layer.service';
import { Layer } from './layer.model';

import { StyleService } from '../styles/style.service';
import { Style } from '../styles/style.model';

import { GeoServerService } from '../geoserver/geoserver.service';

@Component({
  templateUrl: 'edit.component.html'
})

export class LayerEditComponent implements OnInit {
  public layerForm: FormGroup;
  styles: Style[];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: LayerService,
    private styleService: StyleService,
    private geoServerService: GeoServerService) { }

  ngOnInit() {
    this.layerForm = this.formBuilder.group({
      Name: [{ value: '', disabled: true }],
      DefaultStyle: [{ value: '' }]
    });
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.service.get(name)
      .subscribe(res => {
        this.layerForm.patchValue(res as Layer);
        this.geoServerService.getWorkspace()
          .subscribe(res => {
            const geoServerWorkspace = res as string;
            if (this.layerForm.value.DefaultStyle.toString().split(':')[0] == geoServerWorkspace) {
              this.layerForm.get('DefaultStyle').setValue(this.layerForm.value.DefaultStyle.toString().split(':')[1]);
            }
            else {
              this.layerForm.get('DefaultStyle').setValue('');
            }
          },
            (error => {
              console.log(error);
            })
          );
      },
        (error => {
          console.log(error);
        })
    );
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

  public save(layerFormValue) {
    const layer: Layer = {
      Name: this.activatedRoute.snapshot.paramMap.get('name'),
      DefaultStyle: layerFormValue.DefaultStyle
    }
    this.service.put(layer)
      .subscribe(() => {
        this.router.navigateByUrl('/layers');
      },
        (error => {
          console.log(error);
        })
      )
  }
}
