import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from './user.service';
import { User } from './user.model';

@Component({
  templateUrl: 'details.component.html'
})

export class UserDetailsComponent implements OnInit {
  public user: User;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: UserService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.service.get(id)
      .subscribe(res => {
        this.user = res as User;
      },
        (error => {
          console.log(error);
        })
      );
  }

  public cancel() {
    this.router.navigateByUrl('/users');
  }
}
