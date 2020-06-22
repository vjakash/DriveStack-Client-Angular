import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';
@Component({
  selector: 'app-maindisplay',
  templateUrl: './maindisplay.component.html',
  styleUrls: ['./maindisplay.component.css'],
})
export class MaindisplayComponent implements OnInit {
  loader = true;
  userData;
  constructor(
    private router: Router,
    public serv: ServerservService,
    private toastService: ToastService
  ) {
    this.serv.getUserData().subscribe(
      (data) => {
        this.loader = false;
        // console.log(data);
        this.userData = data;
      },
      (err) => {
        console.log(err);
        // alert(err.error.message);
        this.showDanger(err.error.message);
        this.router.navigate(['/']);
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
}
