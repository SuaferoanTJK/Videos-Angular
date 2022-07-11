import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
  public page_title: string;
  constructor() {
    this.page_title = 'Page not found';
  }

  ngOnInit(): void {}
}
