import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServerservService } from '../serverserv.service';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-newmodal',
  templateUrl: './newmodal.component.html',
  styleUrls: ['./newmodal.component.css'],
})
export class NewmodalComponent implements OnInit {
  folder;
  closeResult = '';
  faPlus = faPlus;
  loader = false;
  selected = '';
  folderName = '';
  files = [];
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private serv: ServerservService,
    private router: Router
  ) {
    this.folder = this.serv.currentFolder;
    console.log('folder', this.folder);
  }

  ngOnInit(): void {}
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      this.files = event.target.files;
    }
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      console.log(this.closeResult);
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log(this.closeResult);
      return 'by clicking on a backdrop';
    } else {
      console.log(this.closeResult);
      return `with: ${reason}`;
    }
  }
  upload() {
    if (this.selected == 'file') {
      let totalSize = 0;
      for (let i = 0; i < this.files.length; i++) {
        totalSize += this.files[i].size;
      }
      // console.log(totalSize);
      // console.log(((totalSize / 1024 / 1024 ) +parseFloat(this.serv.currenttotal)))
      // console.log(parseFloat(this.serv.totalsize)*1024)
      // console.log(parseFloat(this.serv.totalsize)*1024)
      if (((totalSize / 1024 / 1024) + parseFloat(this.serv.currenttotal)) > (parseFloat(this.serv.totalsize)*1024)) {
        alert("File Size exceeds your storage limit");
      } else {
        if (this.folder == '') {
          for (let i = 0; i < this.files.length; i++) {
            console.log(this.files[i]);
            let key = this.files[i].name;
            this.serv.uploadFile(this.files[i], key);
          }
        } else {
          for (let i = 0; i < this.files.length; i++) {
            console.log(this.files[i]);
            let key = `${this.folder}${this.files[i].name}`;
            this.serv.uploadFile(this.files[i], key);
          }
        }
      }
    } else if (this.selected == 'folder') {
      if (this.folder == '') {
        this.serv.uploadFolder(this.folderName);
      } else {
        let folders = `${this.folder}${this.folderName}`;
        this.serv.uploadFolder(folders);
      }
    }
  }
}
