import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Video } from 'src/app/models/Video';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'update-video',
  templateUrl: '../layout/videoForm.html',
  providers: [UserService, VideoService],
})
export class UpdateVideoComponent implements OnInit {
  public page_title: string;
  public video: Video;
  public status: any;
  public token: any;
  public identity: any;
  public url: any;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Update Video';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.video = new Video(1, this.identity.id, '', '', '', '', null, null);
    this.status = { type: '', msg: '' };
    this.url = global.video;
  }

  ngOnInit(): void {
    this.getVideo();
  }

  getVideo() {
    this._route.params.subscribe((params) => {
      const id = +params['id'];
      this._videoService.getVideo(this.token, id).subscribe(
        (response) => {
          if (response.status == 'success') {
            this.video = response.video;
          } else {
            this._router.navigate(['']);
          }
        },
        (error) => {
          this.status = { type: 'error', msg: 'Video not found' };
          console.log(error);
        }
      );
    });
  }

  onSubmit(form: any) {
    this._videoService.update(this.token, this.video).subscribe(
      (response) => {
        if (response.video) {
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
