import { Component, OnInit } from '@angular/core';

import { GeoServerService } from '../geoserver/geoserver.service';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';

@Component({
  templateUrl: 'index.component.html'
})

export class IrrigationIndexComponent implements OnInit {
  map: Map;
  public geoServerUrl: string;
  public geoServerWorkspace: string;

  constructor(private GeoServerService: GeoServerService) { }

  ngOnInit() {
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
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }
}
