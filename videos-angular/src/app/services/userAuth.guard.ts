import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  public identity: any;
  constructor(private _router: Router, private _userService: UserService) {
    this.identity = this._userService.getIdentity();
  }

  canActivate() {
    if (Object.keys(this.identity).length != 0) {
      return true;
    } else {
      this._router.navigate(['home']);
      return false;
    }
  }
}
