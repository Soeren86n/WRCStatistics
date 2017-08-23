import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Message } from 'primeng/primeng';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
  msgs: Message[] = [];

  constructor(private notificationService: NotificationService) {
  }

  onErrorHandled() {
    this.msgs = [];
  }

  ngOnInit() {
    this.notificationService.errorOccurred
      .subscribe(
        (error: Message) => {
          this.msgs.push(error);
        },
      );
  }
}
