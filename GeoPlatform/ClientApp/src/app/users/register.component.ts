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
        if (res.Succeeded) {
          this.userService.formRegisterModel.reset();
          alert('New user registered!');
        } else {
          res.Errors.forEach(element => {
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
