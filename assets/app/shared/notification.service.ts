import { EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng';

export class NotificationService {
  errorOccurred = new EventEmitter<Message>();

  handleError(error: any) {
    const errorData: Message = <Message>error;
    this.errorOccurred.emit(errorData);
  }
}
