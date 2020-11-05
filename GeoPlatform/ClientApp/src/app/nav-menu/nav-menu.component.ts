import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { UserService, AuthorizedUser } from '../users/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  authorizedUser: AuthorizedUser;
  languages = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polskie' }
  ];
  currentLanguage: string;

  constructor(public userService: UserService,
    @Inject(LOCALE_ID) protected locale: string) {
    this.currentLanguage = (this.languages.filter(l => { return l.code === this.locale }).length > 0)
      ? (this.languages.filter(l => { return l.code === this.locale })[0].name)
      : (this.languages[0].name);
  }

  ngOnInit() {
    this.userService.authorizedUser$.subscribe((authorizedUser: AuthorizedUser) => {
      this.authorizedUser = authorizedUser;
    });
    if (localStorage.getItem('token')) {
      this.authorizedUser = {
        Email: this.userService.getAuthorizedUserEmail()
      };
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
