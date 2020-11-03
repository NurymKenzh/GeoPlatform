import { Component, OnInit, ViewChild, AfterViewInit, LOCALE_ID, Inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { CountryService } from './country.service';
import { Country } from './country.model';

@Component({
  selector: 'countries',
  templateUrl: 'list.component.html'
})

export class CountriesListComponent implements OnInit, AfterViewInit {
  columns: string[] = ['Name', 'Code', 'details-edit-delete'];
  dataSource = new MatTableDataSource<Country>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: CountryService,
    private translate: TranslateService,
    @Inject(LOCALE_ID) protected locale: string) {
    this.dataSource.filterPredicate = (data: Country, filter: string) => {
      return data.Name.toLowerCase().includes(filter)
        || data.Code.toLowerCase().includes(filter);
    };
    translate.setDefaultLang(locale);
    translate.use(locale);
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
        this.dataSource.data = res as Country[];
      })
  }

  delete(Id) {
    if (confirm(this.translate.instant('AreYouSureDeleteThisRecord'))) {
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
