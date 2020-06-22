import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServerservService {

  constructor(private http: HttpClient,private router: Router) { }
  login(data): Observable<any> {
    return this.http.post(`${environment.url}/login`, data);
  }
  register(data): Observable<any> {
    return this.http.post(`${environment.url}/register`, data);
  }
  findAccount(data): Observable<any> {
    return this.http.post(`${environment.url}/findbyemail`, data);
  }
  sendVerifictionMail(data): Observable<any> {
    return this.http.post(`${environment.url}/forgot`, data);
  }

  resetPassword(data): Observable<any> {
    return this.http.post(`${environment.url}/resetpassword`, data);
  }
  verifyLink(token, email): Observable<any> {
    console.log(token, email);
    return this.http.get(`${environment.url}/verify/${token}/${email}`);
  }
  verifyAccount(token, email): Observable<any> {
    // console.log(token,email);
    return this.http.get(`${environment.url}/accountverify/${token}/${email}`);
  }
  updateCurrentEmail(email) {
    localStorage.setItem('email', email);
  }
  removeCurrentEmail() {
    localStorage.removeItem('email');
  }
  updateToken(token) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  deleteToken() {
    localStorage.removeItem('token');
  }
  getUserData(): Observable<any> {
    let token = this.getToken();
    return this.http.post(
      `${environment.url}/getuserdata`,
      { email: localStorage.getItem('email') },
      {
        headers: new HttpHeaders({
          authorization: token,
        }),
      }
    );
  }

}
