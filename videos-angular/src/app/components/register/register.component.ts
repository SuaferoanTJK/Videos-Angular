import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'register',
  templateUrl: '../layout/form.html',
  providers: [UserService],
})
export class RegisterComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: any;
  public formType: string;
  public btnSubmit: string;
  public imgSectionURL: string;
  public url: any;

  constructor(private _userService: UserService, private _router: Router) {
    this.page_title = 'Register';
    this.user = new User(1, '', '', '', '', 'ROLE_USER', '');
    this.status = { type: '', msg: '' };
    this.formType = 'register';
    this.btnSubmit = 'Register';
    this.imgSectionURL = 'assets/images/auth.png';
    this.url = global.user;
  }

  ngOnInit(): void {}

  onSubmit(form: any) {
    this._userService.register(this.user).subscribe(
      (response) => {
        if (response.user) {
          this._router.navigate(['/login']);
        } else {
          this.status = { type: 'error', msg: 'Register has failed' };
        }
      },
      (error) => {
        this.status = { type: 'error', msg: 'Error' };
      }
    );
  }
}
