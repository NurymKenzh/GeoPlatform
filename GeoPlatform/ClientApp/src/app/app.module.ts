import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import 'hammerjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { AuthorizeInterceptor } from './authorize/authorize.interceptor';
import { AuthorizeGuard } from './authorize/authorize.guard';

import { UserService } from './users/user.service';
import { RegisterComponent } from './users/register.component';
import { LoginComponent } from './users/login.component';
import { UsersIndexComponent } from './users/index.component';
import { UsersListComponent } from './users/list.component';
import { UserDetailsComponent } from './users/details.component';
import { UserEditComponent } from './users/edit.component';

import { AdministrationComponent } from './administration/administration.component';

import { CountryService } from './countries/country.service';
import { CountriesIndexComponent } from './countries/index.component';
import { CountriesListComponent } from './countries/list.component';
import { CountryCreateComponent } from './countries/create.component';
import { CountryEditComponent } from './countries/edit.component';
import { CountryDetailsComponent } from './countries/details.component';

import { GeoServerService } from './geoserver/geoserver.service';

import { LayerService } from './layers/layer.service';
import { LayersIndexComponent } from './layers/index.component';
import { LayersListComponent } from './layers/list.component';
import { LayerCreateComponent } from './layers/create.component';
import { LayerEditComponent } from './layers/edit.component';
import { LayerDetailsComponent } from './layers/details.component';

import { StyleService } from './styles/style.service';
import { StylesIndexComponent } from './styles/index.component';
import { StylesListComponent } from './styles/list.component';
import { StyleCreateComponent } from './styles/create.component';
import { StyleEditComponent } from './styles/edit.component';
import { StyleDetailsComponent } from './styles/details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RegisterComponent,
    LoginComponent,
    UsersIndexComponent,
    UsersListComponent,
    UserDetailsComponent,
    UserEditComponent,
    AdministrationComponent,
    CountriesIndexComponent,
    CountriesListComponent,
    CountryCreateComponent,
    CountryEditComponent,
    CountryDetailsComponent,
    LayersIndexComponent,
    LayersListComponent,
    LayerCreateComponent,
    LayerEditComponent,
    LayerDetailsComponent,
    StylesIndexComponent,
    StylesListComponent,
    StyleCreateComponent,
    StyleEditComponent,
    StyleDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'users/register', component: RegisterComponent },
      { path: 'users/login', component: LoginComponent },
      { path: 'users', component: UsersIndexComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'users/:id', component: UserDetailsComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'administration', component: AdministrationComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'countries', component: CountriesIndexComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'countries/create', component: CountryCreateComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'countries/edit/:id', component: CountryEditComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'countries/:id', component: CountryDetailsComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'layers', component: LayersIndexComponent },
      { path: 'layers/create', component: LayerCreateComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'layers/edit/:name', component: LayerEditComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'layers/:name', component: LayerDetailsComponent },
      { path: 'styles', component: StylesIndexComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'styles/create', component: StyleCreateComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'styles/edit/:name', component: StyleEditComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
      { path: 'styles/:name', component: StyleDetailsComponent, canActivate: [AuthorizeGuard], data: { allowedRoles: ['Administrator'] } },
    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSelectModule
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true
    },
    CountryService,
    GeoServerService,
    LayerService,
    StyleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
