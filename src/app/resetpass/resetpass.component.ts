import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css'],
})
export class ResetpassComponent implements OnInit {
  newPassword;
  loader = false;
  valid = false;
  match = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serv: ServerservService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {
    console.log(
      this.activatedRoute.snapshot.params.token,
      this.activatedRoute.snapshot.params.email
    );
    this.serv
      .verifyLink(
        this.activatedRoute.snapshot.params.token,
        this.activatedRoute.snapshot.params.email
      )
      .subscribe(
        (data) => {
          let timeStamp: Date = new Date(data['timestamp']);
          let currentTimeStamp: Date = new Date();
          let diff: any = Math.abs(
            timeStamp.valueOf() - currentTimeStamp.valueOf()
          );
          console.log(diff);
          if (parseInt(data['expiry']) < diff) {
            // alert('Reset Link expired,try resting again ');
            this.showDanger('Reset Link expired,try resting again ');
            this.router.navigate(['forgot']);
          }
        },
        (err) => {
          // alert(err.error.message);
          this.showDanger(err.error.message);
          // console.log('here');
          this.router.navigate(['/']);
        }
      );
    this.newPassword = this.fb.group({
      email: this.activatedRoute.snapshot.params.email,
      token: this.activatedRoute.snapshot.params.token,
      password: this.fb.control('', [Validators.required]),
      confirm_password: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {}
  reset() {
    if (this.newPassword.valid) {
      if (
        this.newPassword.value.password ==
        this.newPassword.value.confirm_password
      ) {
        this.loader = true;
        this.newPassword.value.password = btoa(this.newPassword.value.password);
        this.newPassword.value.confirm_password = btoa(
          this.newPassword.value.confirm_password
        );
        this.serv.resetPassword(this.newPassword.value).subscribe(
          (data) => {
            this.loader = false;
            // alert(data.message + ',  Login with the new password');
            this.showSuccess(data.message + ',  Login with the new password');
            // this.clearLocalStorage();
            this.router.navigate(['/']);
          },
          (err) => {
            console.log(err);
            this.showDanger(err.error.message);
            this.loader = false;
          }
        );
      } else {
        this.match = false;
      }
    } else {
      this.valid = true;
    }
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
