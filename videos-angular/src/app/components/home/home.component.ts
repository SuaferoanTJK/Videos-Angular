import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  providers: [UserService, VideoService],
})
export class HomeComponent implements OnInit {
  public token: any;
  public identity: any;
  public videos: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  public number_pages: any;
  public total_pages: any;
  public status: any;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    private _route: ActivatedRoute
  ) {
    this.status = { type: '', msg: '' };
    this.loadUser();
    this._route.params.subscribe((params) => {
      let page = +params['page'];
      if (!page) {
        page = 1;
        this.prev_page = 1;
        this.next_page = 2;
      }
      this.getVideos(page);
    });
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
    this.loadUser();
  }

  loadUser() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getVideos(page = 1) {
    this._videoService.getVideos(this.token, page).subscribe(
      (response) => {
        this.videos = response.videos;
        this.total_pages = response.total_pages;
        let number_pages_ar = [];
        for (var i = 1; i <= response.total_pages; i++) {
          number_pages_ar.push(i);
        }
        this.number_pages = number_pages_ar;
        if (page >= 2) {
          this.prev_page = page - 1;
        } else {
          this.prev_page = 1;
        }
        if (page < response.total_pages) {
          this.next_page = page + 1;
        } else {
          this.next_page = response.total_pages;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getThumb(url: any) {
    var video, results, thumburl;
    results = url.match('[\\?&]v=([^&#]*)');
    video = results === null ? url : results[1];
    thumburl = `http://img.youtube.com/vi/${video}/maxresdefault.jpg`;
    return thumburl;
  }

  deleteVideo(id: any) {
    this._videoService.delete(this.token, id).subscribe(
      (response) => {
        this.status = { type: 'success', msg: 'Video being deleted' };
        setTimeout(() => {
          this.status = { type: '', msg: '' };
          this.getVideos();
        }, 2000);
      },
      (error) => {
        this.status = { type: 'error', msg: 'Video could not be deleted' };
      }
    );
  }
}
