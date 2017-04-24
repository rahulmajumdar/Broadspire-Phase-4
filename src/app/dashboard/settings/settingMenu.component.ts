import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonAPICall } from '../../shared/shared.service';

@Component({
    selector: 'setting-menu',
    templateUrl: 'settingMenu.component.html'
})
export class SettingMenuComponent {

    constructor(private _route: Router) { }

    //REDIRECT CHANGE SECURITY INFO FROM SETTING-------------------------------------------------
    changeSecInfo() {
        this._route.navigate(['./dashboard/changeSecurityInfo']);
    }
    //REDIRECT RESET PASSWORD FROM SETTING--------------------------------------------------
    resetPassword() {
        this._route.navigate(['./dashboard/changeSettingPass']);
    }
    //REDIRECT RESET USER ID FROM SETTING--------------------------------------------------
    resetUserId() {
        this._route.navigate(['./dashboard/changeSettingUserId']);
    }
    //REDIRECT ABOUT THE APP FROM SETTING--------------------------------------------------
    aboutTheApp(){
      this._route.navigate(['./dashboard/aboutTheApp']);
    }
}
//---------------------------------------CHANGE SECURITY INFO IN SETTINGS-----------------------------------
@Component({
    selector: 'changeSecInfo',
    templateUrl: 'changeSecurityInfo.html',
    providers: [CommonAPICall]
})
export class ChangeSecInfoComponent {
    questions: any = [];
    //i: number;
    inputElem: any = [];
    index: any = [];
    checkedQues: boolean;
    count = 0;
    isQues = false;

    constructor(private _commonApiCall: CommonAPICall, private _route: Router) {
        this.question();
    }

    question(): any {
        this._commonApiCall.getService("SecQuestions", "", "")
            .subscribe(res => {

                this.questions = res.result.secquestions;
                this.isQues = true;
            },
          error => {
            this._commonApiCall.handleError(error,"Security questions");
          });
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }
    // --------------------------------------CHECKED VALUE METHOD START--------------------------------------------
    checkValue(e: any, i: any) {
        this.checkedQues = e.target.checked;
        //this.i = i;



        if (this.checkedQues) {
            this.index.push(i);
            console.log("Push  " + this.index.length);
            //console.log(document.getElementById("#securityAns"+i))
            this.count++;
            document.getElementById("securityAns" + i).style.display = '';
            if (this.count > 3) {
                this.count--;
                this.index.splice(this.index.indexOf(i), 1);
                console.log("Pop  " + this.index.length);
                e.target.checked = false;
                document.getElementById("securityAns" + i).style.display = 'none';
                this._commonApiCall.hideLoaderShowPopup("Select not more than 3 Questions.","Security Info");
            }

        }
        else {
          this.index.splice(this.index.indexOf(i), 1);
            console.log("Pop  " + this.index.length);
            this.count--;
            document.getElementById("securityAns" + i).style.display = 'none';
        }
        //console.log(this.count);
    }
    // --------------------------------------CHECKED VALUE METHOD END--------------------------------------------

    // --------------------------------------UPADATE SECURITY INFO METHOD--------------------------------------------
    updateSecurityInfo() {

        var token = localStorage.getItem('token');

        if (this.inputElem[this.index[0]] == "" || this.inputElem[this.index[0]] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Security answers are required","Security Info");
        }
        else if (this.inputElem[this.index[1]] == "" || this.inputElem[this.index[1]] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Security answers are required","Security Info");
        }
        else if (this.inputElem[this.index[2]] == "" || this.inputElem[this.index[2]] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Security answers are required","Security Info");
        }
        else {
            var data =
                {
                    "securityQuestion1": this.questions[this.index[0]].question,
                    "securityAnswer1": this.inputElem[this.index[0]],
                    "securityQuestion2": this.questions[this.index[1]].question,
                    "securityAnswer2": this.inputElem[this.index[1]],
                    "securityQuestion3": this.questions[this.index[2]].question,
                    "securityAnswer3": this.inputElem[this.index[2]]
                }
            this._commonApiCall.putService("secQuestionsAnswers", "Bearer " + token, "application/json", data)
                .subscribe(res => {
                  if(res.statusCode == '200'){
                    this._commonApiCall.hideLoaderShowPopup("Security questions changed successfully.","Security Info");
                  }
                  this._route.navigate(['./dashboard/settingMenu']);
                },
                error => {
                    this._commonApiCall.handleError(error,"Security Info");
                })
        }
    }
    //------------------------------------CANCEL BUTTON OF RESET SECURITY ANSWER-----------------------------
settingMenu(){
  this._route.navigate(['./dashboard/settingMenu']);
}
}

//-------------------------------------CHANGE PASSWORD INSIDE SETTINGS-----------------------------------

@Component({
    selector: 'changePass',
    templateUrl: 'changePassword.html',
    providers: [CommonAPICall]
})
export class ChangePasswordComponent {
    constructor(private _route: Router, private _commonApiCall: CommonAPICall) { }

    //-----------------------------------------CHANGE PASSWORD METHOD--------------------------------------
    resetUserPassword(oldPassword: string, newPassword: string, reNewPassword: string) {
        if (oldPassword == undefined || oldPassword == '') {
            this._commonApiCall.hideLoaderShowPopup("Enter old password","Password");
        }
        else if (newPassword == undefined || newPassword == '') {
            this._commonApiCall.hideLoaderShowPopup("Enter new password","Password");
        }
        else if (reNewPassword == undefined || reNewPassword == '') {
            this._commonApiCall.hideLoaderShowPopup("Reenter password","Password");
        }
        else {
            if (oldPassword.trim() == newPassword.trim()
                || newPassword.trim() !== reNewPassword.trim()) {
                this._commonApiCall.hideLoaderShowPopup("Passwords must be same.","Password");
            }
            else {
                var token = localStorage.getItem('token');
                var data =
                    {
                        "oldPassword": oldPassword,
                        "newPassword": newPassword
                    }
                this._commonApiCall.putService("users/passwords", "Bearer " + token, "application/json", data)
                    .subscribe(res => {
                      this._commonApiCall.hideLoaderShowPopup(res.result,"Password");
                    },
                  error =>{
                    this._commonApiCall.handleError(error,"Password");
                  })
            }
        }

    }
    //------------------------------------CANCEL BUTTON OF RESET PASSWORD-----------------------------
settingMenu(){
  this._route.navigate(['./dashboard/settingMenu']);
}
}

//-------------------------------------CHANGE USER ID INSIDE SETTINGS-----------------------------------
@Component({
  selector:'changeUserId',
  templateUrl:'changeUserId.html',
  providers:[CommonAPICall]
})
export class ChangeUserIDComponent{
  constructor(private _route:Router, private _commonApiCall:CommonAPICall){}

  //------------------------------------CHANGE USER ID METHOD----------------------------------------------
  resetUserName(newUserName:string, renewUserName:string){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(newUserName == undefined || newUserName == '' || !re.test(newUserName)){
      this._commonApiCall.hideLoaderShowPopup("Please enter valid email address","Change Email Address");
    }
    else if(renewUserName === undefined || renewUserName == '' || renewUserName !== newUserName){
      this._commonApiCall.hideLoaderShowPopup("Reentered New Email Address must match value entered in New Email Address.","Change Email Address");
    }
    else{
      var token = localStorage.getItem('token');
      var data =
      {
        "newUserName": newUserName
      }
      this._commonApiCall.putService("username","Bearer "+token, "application/json", data)
      .subscribe(res =>{
        this._commonApiCall.hideLoaderShowPopup("res.result.update_status","Change Email Address");
      },
    error =>{
      this._commonApiCall.handleError(error,"Change Email Address");
    })
    }
  }
  //------------------------------------CANCEL BUTTON OF RESET USER ID-----------------------------
settingMenu(){
this._route.navigate(['./dashboard/settingMenu']);
}
}

//------------------------------------ABOUT THE APP COMPONENT----------------------------------------
@Component({
  selector:'aboutTheApp',
  templateUrl:'aboutTheApp.html'
})
export class AboutTheAppComponent{

}
