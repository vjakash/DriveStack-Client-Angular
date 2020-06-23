import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-maindisplay',
  templateUrl: './maindisplay.component.html',
  styleUrls: ['./maindisplay.component.css'],
})
export class MaindisplayComponent implements OnInit {
  faPlus = faPlus;
  loader = true;
  userData;
  perecentUsed;
  pathToDownload = '';
  fileNameToDownload = '';
  clickCount = 0;
  selectedIndex = 0;
  public files: NgxFileDropEntry[] = [];
  constructor(
    private router: Router,
    public serv: ServerservService,
    private toastService: ToastService
  ) {
    this.serv.updateObjectList(() => {
      this.serv.getUserData().subscribe(
        (data) => {
          this.loader = false;
          // console.log(data);
          this.userData = data;
          this.serv.updateBucketName(data['bucketName']);
          this.serv.totalsize = parseFloat(data['totalsize']);
          this.serv.perecentUsed =
            String((this.serv.currenttotal / this.serv.totalsize) * 100) + '%';
        },
        (err) => {
          console.log(err);
          // alert(err.error.message);
          this.showDanger(err.error.message);
          this.router.navigate(['/']);
        }
      );
      this.serv.getObjectList().subscribe(
        (data) => {
          console.log(data);

          let total = 0;
          data.Contents.forEach((item) => {
            total += item.Size;
          });
          console.log(total);
          console.log(total / 1024 / 1024 / 1024);
          this.serv.currenttotal = (total / 1024 / 1024 / 1024).toFixed(4);
          this.perecentUsed =
            String(
              ((parseFloat(this.serv.currenttotal) /parseFloat(this.serv.totalsize)) * 100).toPrecision(4)
            ) + '%';
          console.log(
            this.perecentUsed,
            this.serv.currenttotal,
            this.serv.totalsize
          );
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
  selectFile(name, index) {
    this.selectedIndex = index;
    this.pathToDownload = `https://${localStorage.getItem(
      'bucketName'
    )}.s3.ap-south-1.amazonaws.com/${name}`;

    this.fileNameToDownload = name;
  }
  doubleClick(index, name) {
    this.clickCount++;
    this.fileNameToDownload = name;
    this.pathToDownload="";
    this.selectedIndex = index;
    if (this.clickCount == 2) {
      this.router.navigate([`/dashboard/folder/${index}/${name}`]);
    }
    setTimeout(() => {
      this.clickCount = 0;
    }, 1000);
  }
  delete(name) {
    console.log(name);
    let ret=confirm("Do you really want to delete the file?");
    if(ret){
      if (name[name.length - 1] == '/') {
        console.log(
          this.serv.objectList[this.selectedIndex].url,
          this.selectedIndex
        );
        for (let i of this.serv.objectList[this.selectedIndex].url) {
          console.log(i.Key);
          let fileToDelete=[...i['folders']].join('/')+"/"+i.Key;
          this.serv.delete(fileToDelete).subscribe(
            (data) => {
              this.showSuccess(data.message);
              this.serv.updateObjectList(() => {
                console.log('from delete function-maindisplay' + name);
              });
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }
      this.serv.delete(name).subscribe(
        (data) => {
          this.showSuccess(data.message);
          this.serv.updateObjectList(() => {
            console.log('from delete function-maindisplay');
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
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
 
   dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          // Here you can access the real file
          if (((file.size / 1024 / 1024) + parseFloat(this.serv.currenttotal)) > (parseFloat(this.serv.totalsize)*1024)) {
            alert("Your limit is reached can't upload anymore files");
          }else{
            if(droppedFile.relativePath.includes("/")){
              this.serv.uploadFolder(droppedFile.relativePath.split('/')[0]);
            }
            this.serv.uploadFileDragandDrop(file,droppedFile.relativePath);
            console.log("hey there",droppedFile.relativePath, file);
            this.showSuccess("Files uploaded Successfully");
          }
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
 
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
        this.showSuccess("Files uploaded Successfully");
      }
    }
   
  }
 
public fileOver(event){
    console.log(event);
  }
 
public fileLeave(event){
    console.log(event);
  }
}
