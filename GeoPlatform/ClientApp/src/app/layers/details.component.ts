import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LayerService } from './layer.service';
import { Layer } from './layer.model';

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

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: LayerService) { }

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

    this.service.GeoServerService.getURLs()
      .subscribe(res => {
        this.geoServerUrl = res as string;

        let url_layer = this.geoServerUrl + 'GeoPlatform' + '/wms';
        let Source_layer = new TileWMS({
          url: url_layer,
          params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            'LAYERS': 'GeoPlatform' + ':' + name
          },
          serverType: 'geoserver'
        });
        let Layer_layer = new TileLayer({
          source: Source_layer
        });

        this.map = new Map({
          target: 'map',
          layers: [
            new TileLayer({
              source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              })
            }),
            Layer_layer
          ],
          view: new View({
            center: [7453088, 6202647],
            zoom: 4
          })
        });


      },
        (error => {
          console.log(error);
        })
      );

    
  }

  public cancel() {
    this.router.navigateByUrl('/layers');
  }
}
