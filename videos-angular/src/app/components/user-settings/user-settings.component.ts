import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'settings',
  templateUrl: '../layout/form.html',
  providers: [UserService],
})
export class UserSettingsComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: any;
  public formType: string;
  public btnSubmit: string;
  public imgSectionURL: string;
  public token: any;
  public identity: any;
  public url: any;

  constructor(private _userService: UserService, private _router: Router) {
    this.page_title = 'Update';
    this.status = { type: '', msg: '' };
    this.formType = 'update';
    this.btnSubmit = 'Update';
    this.imgSectionURL = 'assets/images/auth.png';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User(
      this.identity.id,
      this.identity.name,
      this.identity.surname,
      this.identity.email,
      '',
      this.identity.role,
      this.identity.iat
    );
    this.url = global.user;
  }

  ngOnInit(): void {}

  onSubmit(form: any) {
    console.log(this.user);
    this._userService.update(this.user, this.token).subscribe(
      (response) => {
        if (response.user) {
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this._router.navigate(['/']);
        } else {
          this.status = { type: 'error', msg: 'Update has failed' };
        }
      },
      (error) => {
        this.status = { type: 'error', msg: 'Error' };
      }
    );
  }
}
