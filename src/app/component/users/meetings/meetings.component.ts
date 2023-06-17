import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent {
  constructor(private router: Router) {}

  public hide: boolean = true;

  createMeeting(value: number) {
    this.router.navigate(['/club/meeting/', value]);
    this.hide = false;
  }
}
