import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LayerService } from './layer.service';
import { Layer } from './layer.model';

import { GeoServerService } from '../geoserver/geoserver.service';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';

@Component({
  templateUrl: 'details.component.html'
})

export class LayerDetailsComponent implements OnInit {
  public layer: Layer;
  map: Map;
  public geoServerUrl: string;
  public geoServerWorkspace: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: LayerService,
    private GeoServerService: GeoServerService) { }

  ngOnInit() {
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.service.get(name)
      .subscribe(res => {
        this.layer = res as Layer;
      },
        (error => {
          console.log(error);
        })
      );

    this.GeoServerService.getURL()
      .subscribe(res => {
        this.geoServerUrl = res as string;
        this.olmap();
      },
        (error => {
          console.log(error);
        })
      );

    this.GeoServerService.getWorkspace()
      .subscribe(res => {
        this.geoServerWorkspace = res as string;
        this.olmap();
      },
        (error => {
          console.log(error);
        })
      );
  }

  private olmap() {
    if (this.geoServerUrl == null || this.geoServerWorkspace == null) {
      return;
    }
    const name = this.activatedRoute.snapshot.paramMap.get('name'),
      url = this.geoServerUrl + this.geoServerWorkspace + '/wms',
      source = new TileWMS({
        url: url,
        params: {
          'FORMAT': 'image/png',
          'VERSION': '1.1.1',
          tiled: true,
          'LAYERS': this.geoServerWorkspace + ':' + name
        },
        serverType: 'geoserver'
      }),
      layer = new TileLayer({
      source: source
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        layer
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }

  public cancel() {
    this.router.navigateByUrl('/layers');
  }
}
