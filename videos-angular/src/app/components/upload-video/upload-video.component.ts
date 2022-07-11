import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from 'src/app/models/Video';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'upload-video',
  templateUrl: '../layout/videoForm.html',
  providers: [UserService, VideoService],
})
export class UploadVideoComponent implements OnInit {
  public page_title: string;
  public video: Video;
  public status: any;
  public token: any;
  public identity: any;
  public url: any;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    private _router: Router
  ) {
    this.page_title = 'Upload Video';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.video = new Video(1, this.identity.id, '', '', '', '', null, null);
    this.status = { type: '', msg: '' };
    this.url = global.video;
  }

  ngOnInit(): void {}

  onSubmit(form: any) {
    this._videoService.upload(this.video, this.token).subscribe(
      (response) => {
        if (response.video) {
          this._router.navigate(['/']);
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
