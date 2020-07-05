import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  authorizedUserInfo;

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.userService.getAuthorizedUserInfo().subscribe(
        res => {
          this.authorizedUserInfo = res;
        },
        error => {
          console.log(error);
        },
      );
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
