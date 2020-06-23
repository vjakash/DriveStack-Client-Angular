import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';

@Component({
  selector: 'app-subfolder',
  templateUrl: './subfolder.component.html',
  styleUrls: ['./subfolder.component.css'],
})
export class SubfolderComponent implements OnInit {
  faPlus = faPlus;
  loader = true;
  userData;
  perecentUsed;
  pathToDownload = '';
  fileNameToDownload = '';
  clickCount = 0;
  index;
  folder;
  folderTodelete = '';
  selectedIndex = 0;
  public files: NgxFileDropEntry[] = [];

  constructor(
    private router: Router,
    public serv: ServerservService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {
    this.serv.updateObjectList(() => {
      this.index = this.activatedRoute.snapshot.params.index;
      this.serv.getUserData().subscribe(
        (data) => {
          this.userData = data;
          this.serv.updateBucketName(data['bucketName']);
          console.log(data['totalsize']);
          this.serv.totalsize = parseFloat(data['totalsize']);
          this.serv.perecentUsed =
            String((this.serv.currenttotal / this.serv.totalsize) * 100) + '%';
          console.log(this.serv.totalsize, this.serv.perecentUsed);
          if (this.index.includes('-')) {
            for (let i of this.index.split('-')) {
              this.serv.getSubfolders(
                this.serv.objectList[parseInt(i)].url,
                () => {
                  this.loader = false;
                  console.log('inside folder');
                  console.log(this.serv.objectList);
                  if (this.serv.objectList.length != 0) {
                    this.folder = [...this.serv.objectList[0].folders].join(
                      '/'
                    );
                  }
                }
              );
            }
          } else {
            this.serv.getSubfolders(
              this.serv.objectList[this.index].url,
              () => {
                this.loader = false;
                console.log('inside folder');
                console.log(this.serv.objectList);
                if (this.serv.objectList.length != 0) {
                  this.folder = [...this.serv.objectList[0].folders].join('/');
                }
              }
            );
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
  selectFile(folders, name) {
    let folder = [...folders].join('/');
    this.folderTodelete = [...folders].join('/');
    this.pathToDownload = `https://${localStorage.getItem(
      'bucketName'
    )}.s3.ap-south-1.amazonaws.com/${folder}/${name}`;

    this.fileNameToDownload = name;
  }
  doubleClick(folders, index, name) {
    this.clickCount++;
    this.fileNameToDownload = name;
    this.selectedIndex = index;
    this.folderTodelete = [...folders].join('/');
    if (this.clickCount == 2) {
      this.router.navigate([`/dashboard/folder/${this.index}-${index}`]);
    }
    setTimeout(() => {
      this.clickCount = 0;
    }, 1000);
  }
  delete(name) {
    console.log(name);
    if (name[name.length - 1] == '/') {
      console.log(
        this.serv.objectList[this.selectedIndex].url,
        this.selectedIndex
      );
      for (let i of this.serv.objectList[this.selectedIndex].url) {
        console.log(i.Key);
        let fileToDelete = [...i['folders']].join('/') + '/' + i.Key;
        this.serv.delete(fileToDelete).subscribe(
          (data) => {
            this.showSuccess(data.message);
            this.serv.updateObjectList(() => {
              console.log('from delete function-maindisplay' + name);
              this.serv.updateObjectList(() => {
                this.index = this.activatedRoute.snapshot.params.index;
                this.serv.getUserData().subscribe(
                  (data) => {
                    this.userData = data;
                    this.serv.updateBucketName(data['bucketName']);
                    console.log(data['totalsize']);
                    this.serv.totalsize = parseFloat(data['totalsize']);
                    this.serv.perecentUsed =
                      String(
                        (this.serv.currenttotal / this.serv.totalsize) * 100
                      ) + '%';
                    console.log(this.serv.totalsize, this.serv.perecentUsed);
                    if (this.index.includes("-")) {
                      for (let i of this.index.split('-')) {
                        console.log(this.serv.objectList[parseInt(i)]);
                        this.serv.getSubfolders(
                          this.serv.objectList[parseInt(i)].url,
                          () => {
                            this.loader = false;
                            console.log('inside folder');
                            console.log(this.serv.objectList);
                            if (this.serv.objectList.length != 0) {
                              this.folder = [
                                ...this.serv.objectList[0].folders,
                              ].join('/');
                            }
                          }
                        );
                      }
                    } else {
                      this.serv.getSubfolders(
                        this.serv.objectList[this.index].url,
                        () => {
                          this.loader = false;
                          console.log('inside folder');
                          console.log(this.serv.objectList);
                          if (this.serv.objectList.length != 0) {
                            this.folder = [
                              ...this.serv.objectList[0].folders,
                            ].join('/');
                          }
                        }
                      );
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
            });
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
    this.serv.delete(`${this.folderTodelete}/${name}`).subscribe(
      (data) => {
        console.log(`${this.folderTodelete}/${name}`);
        this.showSuccess(data.message);
        this.serv.updateObjectList(() => {
          this.index = this.activatedRoute.snapshot.params.index;
          this.serv.getUserData().subscribe(
            (data) => {
              this.userData = data;
              this.serv.updateBucketName(data['bucketName']);
              console.log(data['totalsize']);
              this.serv.totalsize = parseFloat(data['totalsize']);
              this.serv.perecentUsed =
                String((this.serv.currenttotal / this.serv.totalsize) * 100) +
                '%';
              console.log(this.serv.totalsize, this.serv.perecentUsed);
              if (this.index.includes('-')) {
                for (let i of this.index.split('-')) {
                  console.log(this.serv.objectList[parseInt(i)]);
                  this.serv.getSubfolders(
                    this.serv.objectList[parseInt(i)].url,
                    () => {
                      this.loader = false;
                      console.log('inside folder');
                      console.log(this.serv.objectList);
                      if (this.serv.objectList.length != 0) {
                        this.folder = [...this.serv.objectList[0].folders].join(
                          '/'
                        );
                      }
                    }
                  );
                }
              } else {
                this.serv.getSubfolders(
                  this.serv.objectList[this.index].url,
                  () => {
                    this.loader = false;
                    console.log('inside folder');
                    console.log(this.serv.objectList);
                    if (this.serv.objectList.length != 0) {
                      this.folder = [...this.serv.objectList[0].folders].join(
                        '/'
                      );
                    }
                  }
                );
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
      },
      (err) => {
        console.log(err);
      }
    );
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
          if(droppedFile.relativePath.includes("/")){
            this.serv.uploadFolder(
              `${this.folder}/${droppedFile.relativePath.split('/')[0]}`
            );
          }
          let key = `${this.folder}/${droppedFile.relativePath}`;
          this.serv.uploadFileDragandDrop(file, key);
          console.log('hey there', droppedFile.relativePath, this.folder);

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
      }
    }
    this.showSuccess('Files uploaded Successfully');
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
