import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-maindisplay',
  templateUrl: './maindisplay.component.html',
  styleUrls: ['./maindisplay.component.css'],
})
export class MaindisplayComponent implements OnInit {
  faPlus=faPlus;
  loader = true;
  userData;
  perecentUsed;
  pathToDownload='';
  fileNameToDownload='';
  clickCount=0;
  constructor(
    private router: Router,
    public serv: ServerservService,
    private toastService: ToastService
  ) {
    this.serv.updateObjectList(()=>{
      this.serv.getUserData().subscribe(
        (data) => {
          this.loader = false;
          // console.log(data);
          this.userData = data;
          this.serv.updateBucketName(data['bucketName']);
          this.serv.totalsize = parseFloat(data['totalsize']);
          this.serv.perecentUsed =
          String(
            (this.serv.currenttotal/ this.serv.totalsize) * 100
          ) + '%';
        },
        (err) => {
          console.log(err);
          // alert(err.error.message);
          this.showDanger(err.error.message);
          this.router.navigate(['/']);
        }
      );
      this.serv.getObjectList().subscribe((data)=>{
        console.log(data);
        
        let total=0;
        data.Contents.forEach((item)=>{
          total+=item.Size;
        })
        console.log(total);
        console.log(total/ 1024 / 1024 / 1024);
        this.serv.currenttotal=(total/ 1024 / 1024 / 1024).toFixed(4);
        this.perecentUsed=String((parseFloat(this.serv.currenttotal)/this.serv.totalsize)*100)+"%";
        console.log(this.perecentUsed,this.serv.currenttotal,this.serv.totalsize)
      },(err)=>{
        console.log(err);
      })
    });
    
  }
  selectFile(name){
    this.pathToDownload=`https://${localStorage.getItem('bucketName')}.s3.ap-south-1.amazonaws.com/${name}`;
    
    this.fileNameToDownload=name;
  }
  doubleClick(index){
    this.clickCount++;
    if(this.clickCount==2){
      this.router.navigate([`/dashboard/folder/${index}`]);
    }
    setTimeout(()=>{
      this.clickCount=0;
    },1000);
  }
  ngOnInit(): void {}
  showStandard(msg) {
    this.toastService.show(msg);
  }

  showSuccess(msg) {
    this.toastService.show(msg, {
      classname: 'bg-success text-light',
      delay: 2000,
    });
  }

  showDanger(msg) {
    this.toastService.show(msg, {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }
}
