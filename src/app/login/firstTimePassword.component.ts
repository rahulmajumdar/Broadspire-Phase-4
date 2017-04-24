import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { CommonAPICall } from '../shared/shared.service';

@Component({
    selector: 'firstTimeLogin-cmp',
    templateUrl: './login.firstTimePassword.html',
    providers: [CommonAPICall]
})
export class FirstTimeLoginComponent {
  constructor(private _route: Router, private _commonApiCall: CommonAPICall) { }

  //-----------------------------------------CHANGE PASSWORD METHOD--------------------------------------
  resetUserPassword(newPassword: string, reNewPassword: string) {
      // if (oldPassword == undefined || oldPassword == '') {
      //
      //     this._commonApiCall.hideLoaderShowPopup("Enter Old Password", "Reset Password");
      // }
      if (newPassword == undefined || newPassword == '') {

          this._commonApiCall.hideLoaderShowPopup("Enter New Password", "Reset Password");
      }
      else if (reNewPassword == undefined || reNewPassword == '') {

          this._commonApiCall.hideLoaderShowPopup("Enter New Password", "Reset Password");
      }
      else {
          if (newPassword.trim() !== reNewPassword.trim()) {

              this._commonApiCall.hideLoaderShowPopup("Passwords must be same.", "Reset Password");
          }
          else {
              var token = localStorage.getItem('token');
              var data =
                  {
                      "userName": localStorage.getItem('userName'),
                      "oldPassword": localStorage.getItem('local_tempPassword'),
                      "newPassword": newPassword
                  }
              this._commonApiCall.putService("users/passwords/firsttime", "Bearer " + token, "application/json", data)
                  .subscribe(res => {

                    this._commonApiCall.hideLoaderShowPopup(res.result, "Reset Password");
                  //  this._route.navigate(['']);
                    var loginObject = new LoginComponent(this._route,this._commonApiCall);
                    loginObject.loginService(localStorage.getItem('userName'),newPassword);

                  },
                error =>{
                  this._commonApiCall.handleError(error, "Reset Password");
                })
          }
      }
}

goToLogin() {
  this._route.navigate(['']);
}
}
