import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ICustomWindow extends Window {
  __custom_global_stuff: string;
}

function getWindow(): any {
  return window;
}
@Injectable({
  providedIn: 'root',
})
export class WindowRefService {
  constructor(private http: HttpClient) {}
  get nativeWindow(): ICustomWindow {
    return getWindow();
  }

  getOrderId(amount, id): Observable<any> {
    
    let data = {
      amount: amount,
      currency: 'INR',
      receipt: `rcptid_${id}`,
      payment_capture: 1,
    };
    let cred = window.btoa('key_id:key_secret');
    console.log(cred);
    return this.http.post('https://api.razorpay.com/v1/orders', data, {
      headers: new HttpHeaders({
        "Authorization": `Basic ${cred}`
      })
    });
  }

  getOrder(orderId): Observable<any> {
    let cred = window.btoa('key_id:key_secret');
    return this.http.get(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
      headers: new HttpHeaders({
        Authorization: `Basic ${cred}`,
      }),
    });
  }
}
