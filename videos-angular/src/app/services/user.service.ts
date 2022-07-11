import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { global } from './global';

@Injectable()
export class UserService {
  public url: string;
  public token: any;
  public identity: any;

  constructor(private _http: HttpClient) {
    this.url = global.user;
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity') || '{}');
    if (identity && identity != 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token && token != 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  register(user: User): Observable<any> {
    let json = JSON.stringify(user);
    let params = `json=${json}`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this._http.post(`${this.url}/register`, params, { headers });
  }

  login(user: any, getToken: boolean): Observable<any> {
    if (getToken) {
      user.getToken = 'true';
    }
    let json = JSON.stringify(user);
    let params = `json=${json}`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this._http.post(`${this.url}/login`, params, { headers });
  }

  update(user: any, token: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.put(`${this.url}/update`, params, { headers });
  }
}
