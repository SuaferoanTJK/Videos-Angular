import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/Video';
import { global } from './global';

@Injectable()
export class VideoService {
  public url: string;
  public token: any;
  public identity: any;

  constructor(private _http: HttpClient) {
    this.url = global.video;
  }

  upload(video: Video, token: any): Observable<any> {
    let json = JSON.stringify(video);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(`${this.url}/upload`, params, { headers });
  }

  getVideos(token: any, page: number): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', token);
    return this._http.get(`${this.url}/obtain?page=${page}`, { headers });
  }

  getVideo(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', token);
    return this._http.get(`${this.url}/detail/${id}`, { headers });
  }

  update(token: any, video: any): Observable<any> {
    let json = JSON.stringify(video);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.put(`${this.url}/update/${video.id}`, params, {
      headers,
    });
  }

  delete(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', token);
    return this._http.delete(`${this.url}/delete/${id}`, { headers });
  }
}
