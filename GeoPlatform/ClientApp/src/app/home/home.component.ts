import { Component } from '@angular/core';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(public userService: UserService) { }
}
