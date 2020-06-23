import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { VerificationComponent } from './verification/verification.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { LoginguardGuard } from './loginguard.guard';
import { MaindisplayComponent } from './maindisplay/maindisplay.component';
import { FoldersComponent } from './folders/folders.component';
import { SubfolderComponent } from './subfolder/subfolder.component';
import { UpgradeComponent } from './upgrade/upgrade.component';


const routes: Routes = [{
  path:"",
  component:LoginComponent,
  canActivate:[LoginguardGuard]
},{
  path:"register",
  component:RegisterComponent
},{
  path:"forgot",
  component:ForgotComponent
},{
  path:"resetpassword/:token/:email",
  component:ResetpassComponent,
  // canActivate:[ResetpageGuard]
},{
  path:"verifyaccount/:token/:email",
  component:VerificationComponent,
},{
  path:"dashboard",
  component:DashboardComponent,
  canActivate:[AuthGuard],
  children:[{
    path:'',
    component:MaindisplayComponent
  },
  {
    path:'folder/:index/:name',
    component:FoldersComponent
  },{
    path:'subfolder/:index/:name',
    component:SubfolderComponent
  },{
    path:'upgrade',
    component:UpgradeComponent
  }
]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
