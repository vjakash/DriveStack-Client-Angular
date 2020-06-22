import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerDetails;
  valid = false;
  loader = false;
  constructor(
    private fb: FormBuilder,
    private serv: ServerservService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerDetails = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {}
  register() {
    if (this.registerDetails.valid) {
      this.loader = true;
      // console.log(this.registerDetails.value);
      this.registerDetails.value.password = btoa(
        this.registerDetails.value.password
      );
      this.serv.register(this.registerDetails.value).subscribe(
        (data) => {
          this.loader = false;
          // alert('Registration successfull');
          this.showSuccess('Registration successfull');
          this.router.navigate(['/']);
        },
        (error) => {
          this.loader = false;
          // alert(error.error.message);
          this.showDanger(error.error.message);
        }
      );
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
