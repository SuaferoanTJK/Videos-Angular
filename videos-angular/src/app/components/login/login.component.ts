import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'login',
  templateUrl: '../layout/form.html',
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: any;
  public status: any;
  public formType: string;
  public btnSubmit: string;
  public imgSectionURL: string;
  public token: any;
  public identity: any;
  public url: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Log in';
    this.status = { type: '', msg: '' };
    this.user = {};
    this.formType = 'login';
    this.btnSubmit = 'Log in';
    this.imgSectionURL = 'assets/images/auth.png';
    this.url = global.user;
  }

  ngOnInit(): void {
    this.logout();
  }

  onSubmit(form: any) {
    this._userService.login(this.user, false).subscribe(
      (response) => {
        if (response.id) {
          this.identity = response;
          this._userService.login(this.user, true).subscribe(
            (response) => {
              this.token = response;
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              this._router.navigate(['/']);
            },
            (error) => {
              this.status = { type: 'error', msg: 'Error' };
            }
          );
        } else {
          this.status = { type: 'error', msg: 'Register has failed' };
        }
      },
      (error) => {
        this.status = { type: 'error', msg: 'Error' };
      }
    );
  }

  logout() {
    this._route.params.subscribe((params) => {
      let logout = +params['sure'];
      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity = null;
        this.token = null;
        this._router.navigate(['/home']);
      }
    });
  }
}
