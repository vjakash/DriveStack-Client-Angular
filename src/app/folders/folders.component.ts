import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
})
export class FoldersComponent implements OnInit {
  faPlus = faPlus;
  loader = true;
  userData;
  perecentUsed;
  pathToDownload = '';
  fileNameToDownload = '';
  clickCount = 0;
  index;
  folder;
  folderTodelete='';
  constructor(
    private router: Router,
    public serv: ServerservService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {
    this.serv.updateObjectList(()=>{
      this.index = this.activatedRoute.snapshot.params.index;
      this.serv.getUserData().subscribe(
        (data) => {
          this.userData = data;
          this.serv.updateBucketName(data['bucketName']);
          console.log(data['totalsize'])
          this.serv.totalsize = parseFloat(data['totalsize']);
          this.serv.perecentUsed =
          String(
            (this.serv.currenttotal/ this.serv.totalsize) * 100
          ) + '%';
          console.log( this.serv.totalsize,this.serv.perecentUsed )
          if(this.index.length>1){
            for(let i of this.index.split("")){
              this.serv.getSubfolders(this.serv.objectList[parseInt(i)].url,()=>{
                this.loader=false
               console.log("inside folder");
               console.log(this.serv.objectList)
               if(this.serv.objectList.length!=0){
                  this.folder=[...this.serv.objectList[0].folders].join("/")
               }
              });
            }
          }else{
            this.serv.getSubfolders(this.serv.objectList[this.index].url,()=>{
              this.loader=false
             console.log("inside folder");
             console.log(this.serv.objectList)
             if(this.serv.objectList.length!=0){
                this.folder=[...this.serv.objectList[0].folders].join("/")
             }
            });
          }
          
        },
        (err) => {
          console.log(err);
          // alert(err.error.message);
          this.showDanger(err.error.message);
          this.router.navigate(['/']);
        }
      );
    });
   
  }
  selectFile(folders,name) {
    let folder=[...folders].join('/');
    this.folderTodelete=[...folders].join('/');
    this.pathToDownload = `https://${localStorage.getItem(
      'bucketName'
    )}.s3.ap-south-1.amazonaws.com/${folder}/${name}`;

    this.fileNameToDownload = name;
  }
  doubleClick(index) {
    this.clickCount++;
    if(this.clickCount==2){
      this.router.navigate([`/dashboard/folder/${this.index }${index}`]);
    }
    setTimeout(()=>{
      this.clickCount=0;
    },1000);
  }
  delete(name){
    console.log(name);
    this.serv.delete(`${this.folderTodelete}/${name}`).subscribe((data)=>{
      this.showSuccess(data.message);
      this.serv.updateObjectList(()=>{
        this.index = this.activatedRoute.snapshot.params.index;
        this.serv.getUserData().subscribe(
          (data) => {
            this.userData = data;
            this.serv.updateBucketName(data['bucketName']);
            console.log(data['totalsize'])
            this.serv.totalsize = parseFloat(data['totalsize']);
            this.serv.perecentUsed =
            String(
              (this.serv.currenttotal/ this.serv.totalsize) * 100
            ) + '%';
            console.log( this.serv.totalsize,this.serv.perecentUsed )
            if(this.index.length>1){
              for(let i of this.index.split("")){
                this.serv.getSubfolders(this.serv.objectList[parseInt(i)].url,()=>{
                  this.loader=false
                 console.log("inside folder");
                 console.log(this.serv.objectList)
                 if(this.serv.objectList.length!=0){
                    this.folder=[...this.serv.objectList[0].folders].join("/")
                 }
                });
              }
            }else{
              this.serv.getSubfolders(this.serv.objectList[this.index].url,()=>{
                this.loader=false
               console.log("inside folder");
               console.log(this.serv.objectList)
               if(this.serv.objectList.length!=0){
                  this.folder=[...this.serv.objectList[0].folders].join("/")
               }
              });
            }
            
          },
          (err) => {
            console.log(err);
            // alert(err.error.message);
            this.showDanger(err.error.message);
            this.router.navigate(['/']);
          }
        );
      });
    },(err)=>{
      console.log(err)
    })
  }
  ngOnInit(): void {
    
  }
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
