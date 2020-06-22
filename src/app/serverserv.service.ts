import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root',
})
export class ServerservService {
  objectList;
  totalsize;
  currenttotal;
  constructor(private http: HttpClient, private router: Router) {}
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
  updateBucketName(buketName){
    localStorage.setItem('bucketName', buketName);
  }
  removeBucketName(){
    localStorage.removeItem('bucketName');
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
  getObjectList(): Observable<any> {
    let token = this.getToken();
    return this.http.post(
      `${environment.url}/listobjects`,
      { email: localStorage.getItem('email') },
      {
        headers: new HttpHeaders({
          authorization: token,
        }),
      }
    );
  }
  uploadFile(file) {
    const contentType = file.type;
    let token = this.getToken();
    this.http.get(`${environment.url}/getkeyandsec`,{
      headers: new HttpHeaders({
        authorization: token,
      }),
    }).subscribe((data)=>{
      const bucket = new S3({
        accessKeyId: data['key'],
        secretAccessKey: data['secret'],
        region: 'Mumbai',
      });
      const params = {
        Bucket: localStorage.getItem("bucketName"),
        Key: file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: contentType
      };
      // bucket.upload(params, function (err, data) {
      //     if (err) {
      //         console.log('There was an error uploading your file: ', err);
      //         return false;
      //     }
      //     console.log('Successfully uploaded file.', data);
      //     return true;
      // });
      //for upload progress
      bucket
        .upload(params)
        .on('httpUploadProgress', function (evt) {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
        })
        .send(function (err, data) {
          if (err) {
            console.log('There was an error uploading your file: ', err);
            return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
        });
    })
    
  }
  updateObjectList(data){
    this.objectList=data;
  }
}
