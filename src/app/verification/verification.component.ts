import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  displayData;
  email;
  loader = true;
  constructor(
    private router: Router,
    private serv: ServerservService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {
    let token = this.activatedRoute.snapshot.params.token;
    this.email = this.activatedRoute.snapshot.params.email;
    this.serv.verifyAccount(token, this.email).subscribe(
      (data) => {
        this.loader = false;
        this.displayData = data;
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
}
