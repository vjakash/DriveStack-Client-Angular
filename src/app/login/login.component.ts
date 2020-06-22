import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {ServerservService} from '../serverserv.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginDetails;
  loader=false;
  valid=false;
  constructor(private fb:FormBuilder,private router:Router,private serv:ServerservService,private toastService: ToastService) { 
    this.loginDetails=this.fb.group({
      email:this.fb.control("",[Validators.required,Validators.email]),
      password:this.fb.control("",[Validators.required])
    })
  }

  ngOnInit(): void {
  }
  login(){
    let count=1;
    if(this.loginDetails.valid){
      this.loader=true;
      this.loginDetails.value.password=btoa(this.loginDetails.value.password);
      this.serv.login(this.loginDetails.value).subscribe(
        data=>{
        this.loader=false;
        this.showSuccess(data.message);
        this.router.navigate(['/dashboard']);
        this.serv.updateToken(data['token']);
        this.serv.updateCurrentEmail(data['email']);
        // alert(data.message);
        // console.log(data);
      },
        (error)=>{
          this.loader=false;
          this.showDanger(error.error.message);
        //  alert(error.error.message);
      }
      );
    }else{
      this.valid=true;
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
