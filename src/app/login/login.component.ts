import { Component, OnInit,  OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonAPICall } from '../shared/shared.service';

/**
*             This class represents the lazy loaded LoginComponent.
*/
declare var navigator;
declare var cordova;
@Component({

  selector: 'login-cmp',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss'],
  providers: [CommonAPICall]

})

export class LoginComponent implements  OnDestroy {
  userFirstName: string;
  private path;
  type= "password";
  show = false;

  model: any = {};
  constructor(private route: Router, private _ss: CommonAPICall) {
    if (localStorage.getItem('selectedClaimClaimId') != undefined) {
          localStorage.setItem("selectedClaimClaimId", "");
        }


    var root = document.getElementsByTagName( 'html' )[0];

    root.setAttribute( 'class', 'loginPage' );

if(localStorage.getItem('welcomeUsername') != undefined){
localStorage.setItem("welcomeUsername","");
}
if(localStorage.getItem('token') != undefined){
localStorage.setItem("token","");
}
// need to replace the url code with prod url instead uat before making app live
if(localStorage.getItem('local_appUrl') == undefined){
localStorage.setItem("local_appUrl","https://myclaimwebapiuat.crawco.com/");
}
  }

ngOnDestroy(){
  var root = document.getElementsByTagName( 'html' )[0];

root.setAttribute( 'class', '' );
}
  loginService(user: string, pass: string) {
  localStorage.setItem('local_tempPassword',pass);
  console.log(localStorage.getItem('local_tempPassword'));
    ////Dynamic url code ////////
    if (user == undefined) {
      this._ss.hideLoaderShowPopup("Please Enter Username.", "Login");
      return false;
    }
if(typeof user !== "undefined"){

  localStorage.setItem('userName', user);
    var usernameSplit = user.split("@");
    var a = ""; var b = "";
    a = usernameSplit[1];

    var nameCheck = "BSI_MyClaim_Demo";
    var finalName = nameCheck.toLowerCase();
    var firstString = usernameSplit[0].toLowerCase();
    b = firstString.indexOf(finalName).toFixed(2);

  }

//Email Validation
    var atpos = user.indexOf("@");
    var dotpos = user.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=user.length) {
        this._ss.hideLoaderShowPopup("Please Enter The Email In Valid Format.", "Login");
        return false;
    }

    else if (pass == undefined || pass == '') {
      this._ss.hideLoaderShowPopup("Please Enter the Password.", "Login");
    }
    else if (user.toLowerCase() == 'akshay301090@gmail.com' || user.toLowerCase() == 'myclaimprimus@gmail.com' ||
      user.toLowerCase() == 'myclaimprimus1@gmail.com' || user.toLowerCase() == 'testingbroadspireapp@gmail.com' ||
      user.toLowerCase() == 'rmazumdar@primussoft.com' || user.toLowerCase() == 'karen.hofmann@us.crawco.com' ||
      user.toLowerCase() == 'pkindig@choosebroadspire.com' || user.toLowerCase() == "kautilya.sharma6@primussoft.com" || (b != "-1" && a == "choosebroadspire.com")) {
      localStorage.setItem('local_appUrl', 'https://myclaimwebapiuat.crawco.com/');

      var creds = 'grant_type=password&username=' + user + '&password=' + pass;

      this._ss.postService("authenticate", "", "application/x-www-form-urlencoded", creds)
        .subscribe(result => {

          localStorage.setItem('token', result.access_token);
          this.getLogindata();

        },
        error => {
          this._ss.handleError(error, "Login");
        });
    }
    else {
      localStorage.setItem('local_appUrl', 'https://myclaimwebapiuat.crawco.com/');

      var creds = 'grant_type=password&username=' + user + '&password=' + pass;

      this._ss.postService("authenticate", "", "application/x-www-form-urlencoded", creds)
        .subscribe(result => {
          localStorage.setItem('userName', user);
          localStorage.setItem('token', result.access_token);

          this.getLogindata();

        },
        error => {
          this._ss.handleError(error, "Login");
        });
    }
  }


  // getLogin data  Method
  getLogindata() {
    var token = localStorage.getItem('token');
    this._ss.getService("users/logindata", "Bearer " + token, "application/json").subscribe(res => {

      this.userFirstName = res.result.userFirstName;

      localStorage.setItem('welcomeUsername', "Hi,"+" "+res.result.userFirstName);

      localStorage.setItem('local_expiredFlag', res.result.expiredPasswordFlag);

      localStorage.setItem('local_firstTimeLogin', res.result.firstTimeLoginFlag);

      localStorage.setItem('local_eulaVersion', res.result.eulaVerion);

      localStorage.setItem('local_eulaPage', res.result.eulaPage);

      localStorage.setItem('local_updateMessage', res.result.message);

      localStorage.setItem('local_updateFlag', res.result.appUpdateReqFlag);
      if (localStorage.getItem('local_firstTimeLogin') == 'true') {
        // $state.go('access.createnewpasswordfirsttimeLogin');

        this.route.navigate(['firstTimeLogin']);
      }

      else if (localStorage.getItem('local_expiredFlag') == 'true') {
        this.route.navigate(['firstTimeLogin']);
      }
      else if (localStorage.getItem('local_eulaVersion') !== 'null') {
        // $state.go('access.eulafirsttime');
        this.route.navigate(['./newUser'])
      }
      else if (localStorage.getItem('local_updateFlag') == 'Y') {
        navigator.notification.confirm(localStorage.getItem('local_updateMessage'),this.confirmCallback,
        "Update",['OK']);
      }
      else {

        this.route.navigate(['./dashboard/claimpage']);

      }


    },  error => {
        this._ss.handleError(error, "Login");
      });
  }
// UPDATE APP METHOD
  confirmCallback(){
    if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)){
        window.open("https://itunes.apple.com/us/app/broadspires-myclaimsm-mobile/id1133987965?mt=8");
    }
    else if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Tablet/i)){
      cordova.plugins.market.open('com.broadspire.myclaim');
    }
  }


  // Forgot Password Method
  forgotPassword(user: string) {
    if (user == undefined || user == '') {
      this._ss.hideLoaderShowPopup("Please Enter the Username.", "Reset Password");

    }
    else {
      this._ss.getService("SecQuestions?userName=" + user, "", "")
        .subscribe(result => {

          localStorage.setItem('secQues', JSON.stringify(result.result.userSecQuestions));
          localStorage.setItem('userName', user);
          this.route.navigate(['./forgotPass']);
        },
        error => {
          this._ss.handleError(error, "Reset Password");
        })

    }
  }
  //----------------------------------------------------Redirect New User Page-----------------------------------------------
  newUser(){
    localStorage.setItem('local_eulaVersion',"null");
    this.route.navigate(['./newUser']);
  }
}
