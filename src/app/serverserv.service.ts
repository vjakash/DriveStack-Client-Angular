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
  objectList = [];
  totalsize;
  currenttotal;
  perecentUsed="0";
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
  updateBucketName(buketName) {
    localStorage.setItem('bucketName', buketName);
  }
  removeBucketName() {
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
    this.http
      .get(`${environment.url}/getkeyandsec`, {
        headers: new HttpHeaders({
          authorization: token,
        }),
      })
      .subscribe((data) => {
        // console.log(data);
        const bucket = new S3({
          accessKeyId: data['key'],
          secretAccessKey: data['secret'],
          // region: 'us-east-1',
          region: 'ap-south-1',
        });
        const params = {
          Bucket: localStorage.getItem('bucketName'),
          // Bucket:'sample-bucket007',
          Key: file.name,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType,
        };
        bucket.upload(params, function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
            console.log('Successfully uploaded file.', data);
            return true;
        });
        //for upload progress
      //   bucket
      //     .upload(params)
      //     .on('httpUploadProgress', function (evt) {
      //       console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      //     })
      //     .send(function (err, data) {
      //       if (err) {
      //         console.log('There was an error uploading your file: ', err);
      //         return false;
      //       }
      //       console.log('Successfully uploaded file.', data);
      //       return true;
      //     });
      });
  }
  uploadFileDragandDrop(file,key) {
    const contentType = file.type;
    let token = this.getToken();
    this.http
      .get(`${environment.url}/getkeyandsec`, {
        headers: new HttpHeaders({
          authorization: token,
        }),
      })
      .subscribe((data) => {
        // console.log(data);
        const bucket = new S3({
          accessKeyId: data['key'],
          secretAccessKey: data['secret'],
          // region: 'us-east-1',
          region: 'ap-south-1',
        });
        const params = {
          Bucket: localStorage.getItem('bucketName'),
          // Bucket:'sample-bucket007',
          Key: key,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType,
        };
        bucket.upload(params, function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
            console.log('Successfully uploaded file.', data);
            return true;
        });
        //for upload progress
      //   bucket
      //     .upload(params)
      //     .on('httpUploadProgress', function (evt) {
      //       console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      //     })
      //     .send(function (err, data) {
      //       if (err) {
      //         console.log('There was an error uploading your file: ', err);
      //         return false;
      //       }
      //       console.log('Successfully uploaded file.', data);
      //       return true;
      //     });
      });
  }
  uploadFolder(folderName) {
    let token = this.getToken();
    this.http
      .get(`${environment.url}/getkeyandsec`, {
        headers: new HttpHeaders({
          authorization: token,
        }),
      })
      .subscribe((data) => {
        const bucket = new S3({
          accessKeyId: data['key'],
          secretAccessKey: data['secret'],
          // region: 'us-east-1',
          region: 'ap-south-1',
        });
        const params = {
          Bucket: localStorage.getItem('bucketName'),
          // Bucket:'sample-bucket007',
          Key: folderName + '/',
          Body: 'file',
          ACL: 'public-read',
        };
        bucket.upload(params, function (err, data) {
          if (err) {
            console.log('There was an error uploading your file: ', err);
            return false;
          }
          console.log('Successfully uploaded Folder.', data);
          return true;
        });
      });
  }
  updateObjectList(cb) {
    this.getObjectList().subscribe(
      (data) => {
        data['Contents'].forEach((item)=>{
          item.folders=[];
        })
        this.getSubfolders(data['Contents'],cb);
        let total=0;
        // console.log("data",data);
      data['Contents'].forEach((item)=>{
        // console.log(item.Size)
        if(item.Size!=undefined){
          total +=parseInt(item.Size);
        }
      })
      // console.log("total",total);
      this.currenttotal = (total / 1024 / 1024 / 1024).toFixed(4);
      // console.log(this.currenttotal);
        // return data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getSubfolders(data,cb){
    this.objectList=[];
    console.log(data);
    data.forEach((item) => {
      // console.log(item!={},item);
      if (item != {}) {
        if (item.Key[item.Key.length - 1] != '/') {
          this.objectList.push(item);
        } else {
          item.url = [];
          let size = item.Size;
          data.filter((objs, index) => {
            // console.log(objs,index);
            if (
              item.Key.split('/')[0] == objs.Key.split('/')[0] &&
              item.Key != objs.Key
            ) {
              // console.log(objs,index);
              let arr=objs.Key.split("/")
              // objs.folders.push(...item.folders);
              objs.folders.push(arr.splice(0,1)[0]);
              objs.Key=arr.join("/");
              item.url.push(objs);
              size += objs.Size;
              data[index] = {Key:''};
            }
          });
          item.Size = size;
          this.objectList.push(item);
        }
      }
    });
    console.log(this.objectList);
    cb();
  }
  delete(name):Observable<any>{
    let token = this.getToken();
    return this.http.post(
      `${environment.url}/delete`,
      { bucketName: localStorage.getItem('bucketName'),key:name },
      {
        headers: new HttpHeaders({
          authorization: token,
        }),
      }
    );
  }
}

