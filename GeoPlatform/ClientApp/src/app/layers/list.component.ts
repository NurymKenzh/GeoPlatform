import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { LayerService } from './layer.service';
import { Layer } from './layer.model';

@Component({
  selector: 'layers',
  templateUrl: 'list.component.html'
})

export class LayersListComponent implements OnInit, AfterViewInit {
  columns: string[] = ['Name', 'details-delete'];
  dataSource = new MatTableDataSource<Layer>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: LayerService) {
    this.dataSource.filterPredicate = (data: Layer, filter: string) => {
      return data.Name.toLowerCase().includes(filter);
    };
  }

  ngOnInit() {
    this.get();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public get() {
    this.service.get()
      .subscribe(res => {
        this.dataSource.data = res as Layer[];
      })
  }

  delete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.service.delete(Id)
        .subscribe(() => {
          this.get();
        },
          err => {
            console.log(err);
          })
    }
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLocaleLowerCase();
  }
}
