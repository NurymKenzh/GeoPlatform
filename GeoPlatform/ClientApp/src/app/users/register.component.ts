import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.formRegisterModel.reset();
  }

  register() {
    this.userService.register().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.userService.formRegisterModel.reset();
          console.log('New user registered!');
        } else {
          res.errors.forEach(element => {
            console.log(element.description);
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
