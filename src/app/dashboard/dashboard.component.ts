import { Component, OnInit } from '@angular/core';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {ServerservService} from '../serverserv.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faPowerOff=faPowerOff;
  user;
  constructor(private router:Router,private serv:ServerservService,private toastService: ToastService) {
    this.serv.getUserData().subscribe((data)=>{
      // console.log(data);
      this.user=data;
    },(err)=>{
      console.log(err);
      alert(err.error.message);
      this.router.navigate(['/']);
    })
   }

  ngOnInit(): void {
  }
  signout(){
    this.serv.deleteToken();
    this.serv.removeCurrentEmail();
    this.router.navigate(['/']);
    // alert("signed out");
    this.showDanger("Signed Out");
  }
  verify(){
    if(this.user.isVerified){
      this.router.navigate(['/dashboard/shorturl']);
    }else{
      this.router.navigate(['/dashboard']);
      // alert("Verify the account to use the feature");
      this.showDanger("Verify the account to use the feature")
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
