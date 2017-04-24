import { Component } from '@angular/core';
import { HttpModule, Response } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

import { CommonAPICall } from '../shared/shared.service';

@Component({
    selector: 'forgotPassword',
    templateUrl: 'forgotPassword.component.html',
    providers: [HttpModule, CommonAPICall]
})
export class ForgotPasswordComponent {
    secQuesObject: any;
    secQues1: string;
    secQues2: string;
    secQues3: string;

    secQuesObj: any;
    secViewShow = false;
    constructor(private _route: Router, private _commonApiCall: CommonAPICall) {
        this.secQuesObject = localStorage.getItem('secQues');
        this.secQuesObj = JSON.parse(this.secQuesObject);
        this.secQues1 = this.secQuesObj.securityquestion1;
        this.secQues2 = this.secQuesObj.securityquestion2;
        this.secQues3 = this.secQuesObj.securityquestion3;
    }
    //-----------------------------------FORGOT SECURITY ANSWER BUTTON-----------------------------
    forgotSecAns() {
        this._route.navigate(['./validateRegister']);
    }
    //-----------------------------------CANCEL SECURITY ANSWER BUTTON-----------------------------

    cancelSecAns() {
        this._route.navigate(['']);
    }
    //-------------------------------VALIDATE USER SECURITY ANSWER BUTTON-----------------------------

    ValidateUserSecurityAnswers(answer1: string, answer2: string, answer3: string) {
        if (answer1 == undefined || answer1 == '') {
            this._commonApiCall.hideLoaderShowPopup("Please Enter First Answer","Validate User Security Answer");
        }
        else if (answer2 == undefined || answer2 == '') {
            this._commonApiCall.hideLoaderShowPopup("Please Enter Second Answer","Validate User Security Answer");
        }
        else if (answer3 == undefined || answer3 == '') {
            this._commonApiCall.hideLoaderShowPopup("Please Enter Third Answer","Validate User Security Answer");
        }
        else {
            var data =
                {
                    securityAnswer1: answer1,
                    securityAnswer2: answer2,
                    securityAnswer3: answer3,
                    securityQuestion1: this.secQues1,
                    securityQuestion2: this.secQues2,
                    securityQuestion3: this.secQues3,
                    userName: localStorage.getItem('userName')
                }
            // SECURITY ANSWER MACHING SERVICE CALLED HERE.
            this._commonApiCall.postService("secAnswers", "", "application/json", data)
                .subscribe(res => {
                    if (res.result.secAnswersMatchedFlag == true) {
                        this._route.navigate(['./resetForgotPassword']);
                    }
                    this.secViewShow = true;
                },
                error => {
                    this._commonApiCall.handleError(error,"Validate User Security Answer");
                })
        }
        //END SECURITY ANSWER MACHING SERVICE
    }
}
//-----------------------------------------RESET FORGOT PASSWORD START------------------------------
@Component({
    selector: 'resetForgotPass',
    templateUrl: 'resetForgotPassword.component.html',
    providers: [CommonAPICall]
})
export class ResetForgotPasswordComponent {
  type= "password";
  show = false;
    constructor(private _commonApiCall: CommonAPICall, private _route: Router) { }
    //-------------------------------Reset Forgot button method start------------------------------
    resetForgotPassword(newPassword, reNewPassword) {
        if (newPassword == '' || newPassword == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Please Enter New Password","Reset Password");
        }
        else if (reNewPassword == '' || reNewPassword == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Please Reenter Password","Reset Password");
        }
        else if (newPassword !== reNewPassword) {
            this._commonApiCall.hideLoaderShowPopup("Passwords is not same","Reset Password");
        }
        else {
            var userName = localStorage.getItem('userName');
            var data =
                {
                    "userName": userName,
                    "newPassword": reNewPassword
                }
            this._commonApiCall.putService("users/passwords/noauth", "", "Application/json", data)
                .subscribe(res => {
                    this._commonApiCall.hideLoaderShowPopup(res.result,"Success");
                    this._route.navigate(['']);
                },
                error => {
                    this._commonApiCall.handleError(error,"Reset Password");
                })
        }
    }
    //-------------------------------Reset Forgot button method end----------------------------------

    //-------------------------------Reset Forgot cancel button method start----------------------------------

resetForgotCancel(){
  this._route.navigate(['./forgotPass']);
}
//-------------------------------Reset Forgot cancel button method end----------------------------------

}
//-----------------------------------------RESET FORGOT PASSWORD END------------------------------



//Validate Registration Info.
@Component({
    selector: 'validateRegister',
    templateUrl: 'validateRegisterComponent.html',
    providers: [HttpModule, CommonAPICall]

})
// ----------------------------------------CHANGE SECURITY ANSWER.---------------------------------------------
export class ValidateRegistrComponent {
    questions: any = [];
    checkedQues = false;
    securityAns: any;
    count: number = 0;

    firstName: string;
    lastName: string;
    email: string;
    ssn: string;
    //dob: string;
    hzc: string;
    //dol: string;
    claimNo: string;
    // dob2: string;
    // dol2: string;
    dobmonth:string;
    dobdate:string;
    dobyear:string;
    dolmonth:string;
    doldate:string;
    dolyear:string;

    //i: number;
    inputElem: any= [];
    index: any = [];


    dolImgHide = false;
    dolImg: string;

    constructor(private _commonApiCall: CommonAPICall, private _route: Router) {
        this.question();
        this.email = localStorage.getItem('userName');
    }
    question(): any {
        this._commonApiCall.getService("SecQuestions", "", "")
            .subscribe(res => {
                console.log(res);
                this.questions = res.result.secquestions;
            },
          error => {
            this._commonApiCall.handleError(error,"Security questions");
          });
    }
    // onKey(event:any){
    //   var value = event.target.value;
    //   console.log(value);
    // }
    customTrackBy(index: number, obj: any): any {
        return index;
    }
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
                console.log("Push  " + this.index.length);
                e.target.checked = false;
                document.getElementById("securityAns" + i).style.display = 'none';
                this._commonApiCall.hideLoaderShowPopup("Select not more than 3 Questions","Change User Security Info");
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

    resetNewUserInfo() {
        // Validation For All the input field.
        console.log(this.firstName);
        var numbers = /^[-+]?[0-9]+$/;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.email == "" || !re.test(this.email) || this.email == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Please fill the email in valid format","Change User Security Info");
        }
        else if (this.ssn == "" || this.ssn == undefined || this.ssn.toString().length !== 4) {
            this._commonApiCall.hideLoaderShowPopup("Please fill the 4 digit ssn in number format","Change User Security Info");
        }
        else if (this.dobmonth == "" || this.dobmonth == undefined || parseInt(this.dobmonth)>12) {
          this._commonApiCall.hideLoaderShowPopup("Invalid Month","Registration");
        }
        else if (this.dobdate == "" || this.dobdate == undefined || parseInt(this.dobdate) >31) {
          this._commonApiCall.hideLoaderShowPopup("Invalid Date","Registration");
        }
        else if (this.dobyear == "" || this.dobyear == undefined || parseInt(this.dobyear) < 1900)  {
          this._commonApiCall.hideLoaderShowPopup("Invalid Year","Registration");
        }
        else if (this.hzc == "" || this.hzc == undefined || this.hzc.toString().length!==5) {
          this._commonApiCall.hideLoaderShowPopup("Please fill the 5 digit zip code ","Registration");
        }
        else if (this.dolmonth == "" || this.dolmonth == undefined || parseInt(this.dolmonth)>12) {
          this._commonApiCall.hideLoaderShowPopup("Invalid Month","Registration");
        }
        else if (this.doldate == "" || this.doldate == undefined || parseInt(this.doldate)>31) {
          this._commonApiCall.hideLoaderShowPopup("Invalid Date","Registration");
        }
        else if (this.dolyear == "" || this.dolyear == undefined || parseInt(this.dolyear)<1900) {
          this._commonApiCall.hideLoaderShowPopup("Invalid Year","Registration");
        }
        else if (this.claimNo == "" || this.claimNo == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Please fill the claim no.","Change User Security Info");
        }
        else if (this.inputElem[this.index[0]] == "" || this.inputElem[this.index[0]] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Security answers are required","Change User Security Info");
        }
        else if (this.inputElem[this.index[1]] == "" || this.inputElem[this.index[1]] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Security answers are required","Change User Security Info");
        }
        else if (this.inputElem[this.index[2]] == "" || this.inputElem[this.index[2]] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Security answers are required","Change User Security Info");
        }
        else {
            //-----------------------------------------CHANGE DATE FORMAT------------------------------------------
            // var dob1 = this.dob.split('-');
            // var dol1 = this.dol.split('-');
            // this.dob2 = dob1[1] + "-" + dob1[2] + "-" + dob1[0];
            // this.dol2 = dol1[1] + "-" + dol1[2] + "-" + dol1[0];
            //-----------------------------------------CHANGE DATE FORMAT END------------------------------------------

            var data = {
                "username": this.email,
                "claim_Number": this.claimNo,
                "loss_Date": this.dolmonth+"-"+this.doldate+"-"+this.dolyear,
                "ssn": this.ssn,
                "date_of_Birth": this.dobmonth+"-"+this.dobdate+"-"+this.dobyear,
                "zip_Code": this.hzc,
                "securityQuestion1": this.questions[this.index[0]].question,
                "securityAnswer1": this.inputElem[this.index[0]],
                "securityQuestion2": this.questions[this.index[1]].question,
                "securityAnswer2": this.inputElem[this.index[1]],
                "securityQuestion3": this.questions[this.index[2]].question,
                "securityAnswer3": this.inputElem[this.index[2]]
            };
            this._commonApiCall.putService("user/validate", "", "application/json", data)
                .subscribe(res => {
                    this._route.navigate(['./forgotPass']);
                },
                error => {
                    this._commonApiCall.handleError(error,"Change User Security Info");
                })
        }
    }
    // Help Button Method
    help() {
        this._route.navigate(['./forgotHelp']);
    }
    goToSecAns() {
        this._route.navigate(['./forgotPass']);
    }
    //-------------------------------------GET SUPPORT DATE OF LOSS INFO API CALL-----------------------------------

    dateOfLossInfo() {
        this.dolImgHide = true;
        this._commonApiCall.getService("supportContent?Type=HelpDateOfLoss", "", "")
            .subscribe(res => {
                //console.log(res.result[0].base64);
                this.dolImg = res.result[0].base64;
            },
          error =>{
            this._commonApiCall.handleError(error,"Help Date Of Loss");
          })
    }
    close() {
        this.dolImgHide = false;
    }
    //--------------------------GET SUPPORT CLAIM NUMBER INFO API CALL---------------------
    claimNoInfo() {
        this.dolImgHide = true;
        this._commonApiCall.getService("supportContent?Type=HelpClaimNumber", "", "")
            .subscribe(res => {
                //console.log(res.result[0].base64);
                this.dolImg = res.result[0].base64;
            },
          error =>{
            this._commonApiCall.handleError(error,"Help Claim Number");
          })
    }

}

// ----------------------------------------FORGOT PASSWORD HELP.---------------------------------------------

@Component({
    selector: 'help',
    templateUrl: 'forgotHelp.component.html',
    providers: [HttpModule, CommonAPICall]
})
export class ForgotHelpComponent {
    name: string;
    email: string;
    subject: string;
    telephone: string;
    claimNm: string;
    canIHelp: string;
    constructor(private _route: Router, private _commonApiCall: CommonAPICall) {
        //-------------------------------------GET SUPPORT SUBJECT API CALL-----------------------------------
        this._commonApiCall.getService("supportContent?Type=HelpSubject", "", "")
            .subscribe(res => {
                this.subject = res.result[0].base64;
            },
          error =>{
            this._commonApiCall.handleError(error,"Help Subject");
          })
    }
    ngOnInit(){
      this.supportContent();
    }
  supportContent(){
    //-------------------------------------GET SUPPORT SUBJECT API CALL-----------------------------------
    this._commonApiCall.getService("supportContent?Type=HelpSubject", "", "")
      .subscribe(res => {
        this.subject = res.result[0].base64;
      },
    error =>{
      this._commonApiCall.handleError(error,"Help Subject");
    })
    //-------------------------------------GET SUPPORT EMAIL API CALL-----------------------------------

      this._commonApiCall.getService("supportContent?Type=HelpSupportEmail","","")
      .subscribe(res => {
        this.email = res.result[0].base64;
      },
    error =>{
      this._commonApiCall.handleError(error,"Help Email");
    })
  }

    // HELP VALIDTAION
    helpSend() {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.name == undefined || this.name == '') {
            this._commonApiCall.hideLoaderShowPopup("Enter Name","Support Center");
        }
        else if (this.email == undefined || this.email == ''||!re.test(this.email)) {
            this._commonApiCall.hideLoaderShowPopup("Enter Email in valid format.","Support Center");
        }
        else if (this.subject == undefined || this.subject == '') {
            this._commonApiCall.hideLoaderShowPopup("Enter Subject","Support Center");
        }
        else if (this.telephone == undefined || this.telephone == ''||this.telephone.toString().length < 10) {
            this._commonApiCall.hideLoaderShowPopup("Contact Number should be of 10 digits.","Support Center");
        }
        else if (this.claimNm == undefined || this.claimNm == '') {
            this._commonApiCall.hideLoaderShowPopup("Enter Claim Number","Support Center");
        }
        else if (this.canIHelp == undefined || this.canIHelp == '') {
            this._commonApiCall.hideLoaderShowPopup("Enter Description How to Help you","Support Center");
        }
        else {
            //-------------------------------------GET SUPPORT EMAIL API CALL-----------------------------------

            var toEmail;
            this._commonApiCall.getService("supportContent?Type=HelpSupportEmail", "", "")
                .subscribe(res => {
                    toEmail = res.result[0].base64;
                })
            var data =
                {
                    "to_email_address": toEmail,
                    "from_email_address": this.email,
                    "subject_Text": this.subject,
                    "body_Text": "<b>" + "Claim Number: " + this.claimNm + "</b>" + "<br/><br/>" + "Hello" + "<br/><br/>"
                    + "Regards," + "<br/>" + this.name + "<br/>" + "Email: " + this.email + "<br/>" + "Phone: " + this.telephone
                }
            this._commonApiCall.postService("emails/send", "", "application/json", data)
                .subscribe(res => {
                    this._commonApiCall.hideLoaderShowPopup(res.result.email_status,"Support Center");
                    this._route.navigate(['./createNewUser']);
                },
                error => {
                    this._commonApiCall.handleError(error,"Support Center");
                })
        }

    }
    // Help Cancel Button Method
    helpCancel() {
        this._route.navigate(['./validateRegister']);
    }
}

//---------------------------------------RESET PASSWORD COMPONENT-----------------------------------

@Component({
    selector: 'resetPassword',
    templateUrl: 'resetPassword.component.html',
    providers: [HttpModule, CommonAPICall]
})
export class ResetPasswordComponent {
    constructor(private _router: Router, private _commonApiCall: CommonAPICall) { }

    ResetUserPassword(email: string, newPass: string) {
        if (email == undefined || email == '') {
            this._commonApiCall.hideLoaderShowPopup("Please fill the email id","Reset Password");
        }
        else if (newPass == undefined || newPass == '') {
            this._commonApiCall.hideLoaderShowPopup("Please fill the password","Reset Password");
        }
        else {
            var data =
                {
                    "userName": email,
                    "newPassword": newPass
                }
            this._commonApiCall.putService("users/passwords/noauth", "", "application/json", data)
                .subscribe(res => {
                    this._commonApiCall.hideLoaderShowPopup(res.result,"Reset Password");
                    this._router.navigate(['./login']);
                },
                error => {
                    this._commonApiCall.handleError(error,"Reset Password");
                })
        }
    }
}
