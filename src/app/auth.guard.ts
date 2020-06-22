import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {ServerservService} from './serverserv.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router,private serv:ServerservService){}
  canActivate():boolean {
    if(this.serv.getToken()==null){
      // console.log(this.serv.getToken());
        this.router.navigate(['/']);
        alert("Login to continue to the application");
        return false;
      }else{
        return true;
      }
  }
  
}
