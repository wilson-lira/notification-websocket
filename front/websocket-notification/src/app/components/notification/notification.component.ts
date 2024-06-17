import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Notification, NotificationService } from './notification.service';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  private ws = inject(NotificationService);

  status;
  message = model<string>('');

  constructor(private toastr: ToastrService) {
    this.status = this.ws.status;
    this.ws.NotifyEmitter.subscribe((not: Notification) => {
      switch (not.type) {
        case 'success':
          this.toastr.success(not.message, not.title);
          break;
        case 'error':
          this.toastr.error(not.message, not.title);
          break;
        case 'info':
          this.toastr.info(not.message, not.title);
          break;
        case 'warning':
          this.toastr.warning(not.message, not.title);
          break;
        default:
          break;
      }
    });
  }

  sendMessage() {
    this.ws.sendMessage(this.message());
    console.log(this.message());
  }
}
