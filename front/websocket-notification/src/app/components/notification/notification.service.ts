import { EventEmitter, Injectable, signal } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

export type Notification = {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly wsUrl = 'ws://localhost:5001';

  status = signal<string>('');

  wsSubject: WebSocketSubject<unknown>;

  NotifyEmitter: EventEmitter<Notification>;

  constructor() {
    const id = sessionStorage.getItem('id');
    const token = 'token' + id;

    const emmiter = new EventEmitter<Notification>();

    this.wsSubject = webSocket({
      url: `${this.wsUrl}/websocket?gumgatoken=${token}`,
      openObserver: {
        next: () => {
          this.status.set(`Conected: ${token}`);
        },
      },
      closeObserver: {
        next: () => {
          this.status.set('Not Conected');
        },
      },
    });

    // Converte o Subject em um Observable de mensagens
    this.wsSubject.subscribe({
      next(value: any) {
        if (value.type == 'NOTIFICATION') {
          emmiter.emit(value.payload);
        }
      },
    });

    this.NotifyEmitter = emmiter;
  }

  // Envia uma mensagem para o servidor WebSocket
  public sendMessage(messsage: string) {
    if (messsage) {
      this.wsSubject?.next({
        message: messsage,
      });
    }
  }
}
