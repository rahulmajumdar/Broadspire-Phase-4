import { Component, OnInit } from '@angular/core';
import { HttpModule, Response } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { CommonAPICall } from '../shared/shared.service';

@Component({
  selector: 'newUser',
  templateUrl: 'newUser.component.html',
  providers: [HttpModule, CommonAPICall]


})
export class NewUserComponent implements OnInit {
  eulaFlag = localStorage.getItem('local_eulaVersion');
  updatedAgreement:any = localStorage.getItem('local_eulaPage');
  agreement: any;
  eulaShow = false;
  eulaFlagNewUser:string;
  private url = "users/agreements";
  constructor(private _commonApiCall: CommonAPICall, private _route: Router) {}


  ngOnInit() {
    this.eula();
    if(this.eulaFlag !== "null"){
      this.eulaFlagNewUser == this.eulaFlag;
    }
    else{
      this.eulaFlagNewUser = "null";
    }

  }
  eula(): any {
    this._commonApiCall.getService(this.url, "", "")
      .subscribe(res => {
        this.agreement = res.result.eulaPage
        this.eulaShow = true;
      },
  error =>{
  this._commonApiCall.handleError(error,"Eula");
  });
  }
  //-------------------------------------------UPDATED I AGREE BUTTON----------------------------------------
  goToClaimInfoPage(){
    this._route.navigate(['./dashboard/claimpage']);
  }
  // Navigate to the Create New User page.
  createNewUser() {
     if(localStorage.getItem('local_eulaVersion')!='null'){
       this._route.navigate(['./dashboard/claimpage']);
     }
     else{
     this._route.navigate(['createNewUser']);

     }

  }
  goToLogin() {
    this._route.navigate(['']);
  }

}
// create new user component.
@Component({
  selector: 'createNewUser',
  templateUrl: 'createNewUser.html',
  providers: [HttpModule, CommonAPICall]
})
export class CreateNewUserComponent {
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
  dobmonth:string;
  dobdate:string;
  dobyear:string;
  dolmonth:string;
  doldate:string;
  dolyear:string;
  // dob2: string;
  // dol2: string;

  //i: number;
  inputElem: any= [];
  index: any = [];

  dolImgHide = false;
  dolImg: string;

  constructor(private _commonApiCall: CommonAPICall, private _route: Router) {
    this.question();
  }

  question(): any {
    this._commonApiCall.getService("SecQuestions", "", "")
      .subscribe(res => {
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
      console.log("push  "+i);
      console.log("indexlength  " + this.index.length);
      //console.log(document.getElementById("#securityAns"+i))
      this.count++;
      document.getElementById("securityAns" + i).style.display = '';
      if (this.count > 3) {
        this.count--;
          this.index.splice(this.index.indexOf(i),1);
        console.log("indexlength  " + this.index.length);
        e.target.checked = false;
        document.getElementById("securityAns" + i).style.display = 'none';
        this._commonApiCall.hideLoaderShowPopup("Select not more than 3 Questions","Registration");
      }
    }
    else {
      this.index.splice(this.index.indexOf(i), 1);
      console.log("pop  "+i);
      console.log("indexlength  " + this.index.length);
      this.count--;
      document.getElementById("securityAns" + i).style.display = 'none';
    }
    //console.log(this.count);
  }

  createNewUser1() {
    // Validation For All the input field.
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.firstName == "" || this.firstName == undefined) {
      this._commonApiCall.hideLoaderShowPopup("Please fill the First Name","Registration");
    }
    else if (this.lastName == "" || this.lastName == undefined) {
      this._commonApiCall.hideLoaderShowPopup("Please fill the Last Name","Registration");
    }
    else if (this.email == "" || this.email == undefined || !re.test(this.email)) {
      this._commonApiCall.hideLoaderShowPopup("Please fill the email in valid format","Registration");
    }
    else if (this.ssn == "" || this.ssn == undefined || this.ssn.toString().length!==4) {
      this._commonApiCall.hideLoaderShowPopup("Please fill the 4 digit ssn in number format","Registration");
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
      this._commonApiCall.hideLoaderShowPopup("Please fill the claim no.","Registration");
    }
    else if (this.inputElem[this.index[0]] == "" || this.inputElem[this.index[0]] == undefined) {
      this._commonApiCall.hideLoaderShowPopup("Security answers are required","Registration");
    }
    else if (this.inputElem[this.index[1]] == "" || this.inputElem[this.index[1]] == undefined) {
      this._commonApiCall.hideLoaderShowPopup("Security answers are required","Registration");
    }
    else if (this.inputElem[this.index[2]] == "" || this.inputElem[this.index[2]] == undefined) {
      this._commonApiCall.hideLoaderShowPopup("Security answers are required","Registration");
    }
    else {
      //-----------------------------------------CHANGE DATE FORMAT------------------------------------------
      // var dob1 = this.dob.split('-');
      // var dol1 = this.dol.split('-');
      // this.dob2 = dob1[1] + "-" + dob1[2] + "-" + dob1[0];
      // this.dol2 = dol1[1] + "-" + dol1[2] + "-" + dol1[0];
      //-----------------------------------------CHANGE DATE FORMAT END------------------------------------------

      var data = {
        "firstName": this.firstName,
        "lastName": this.lastName,
        "username": this.email,
        "securityQuestion1": this.questions[this.index[0]].question,
        "securityAnswer1": this.inputElem[this.index[0]],
        "securityQuestion2": this.questions[this.index[1]].question,
        "securityAnswer2": this.inputElem[this.index[1]],
        "securityQuestion3": this.questions[this.index[2]].question,
        "securityAnswer3": this.inputElem[this.index[2]],
        "ssn": this.ssn,
        "claim_Number": this.claimNo,
        "date_of_Birth": this.dobmonth+"-"+this.dobdate+"-"+this.dobyear,
        "zip_Code": this.hzc,
        "dateOfLoss": this.dolmonth+"-"+this.doldate+"-"+this.dolyear

      };

      this._commonApiCall.postService("users", "", "Application/json", data)
        .subscribe(res => {
          this._commonApiCall.hideLoaderShowPopup(res.result,"Registration");
          this._route.navigate(['']);
        },
        error => {
          this._commonApiCall.handleError(error,"Registration");
        })
    }
  }
  // Help Button Method
  help() {
    this._route.navigate(['./help']);
  }
  goToLogin() {
    this._route.navigate(['']);
  }

  //-------------------------------------GET SUPPORT DATE OF LOSS INFO API CALL-----------------------------------

  dateOfLossInfo() {

    this._commonApiCall.getService("supportContent?Type=HelpDateOfLoss", "", "")
      .subscribe(res => {
        //console.log(res.result[0].base64);
        this.dolImg = res.result[0].base64;
        this.dolImgHide = true;
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

    this._commonApiCall.getService("supportContent?Type=HelpClaimNumber", "", "")
      .subscribe(res => {
        //console.log(res.result[0].base64);
        this.dolImg = res.result[0].base64;
        this.dolImgHide = true;
      },
    error =>{
      this._commonApiCall.handleError(error,"Help Claim Number");
    })
  }

}

// Help Component
@Component({
  selector: 'help',
  templateUrl: 'help.component.html',
  providers: [HttpModule, CommonAPICall]
})
export class HelpComponent implements OnInit {
  name: string;
  email: string;
  subject: string;
  telephone: string;
  claimNm: string;
  canIHelp: string;
  constructor(private _route: Router, private _commonApiCall: CommonAPICall) {}
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
helpSend(){
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (this.name == undefined || this.name == '') {
    this._commonApiCall.hideLoaderShowPopup("Enter Name","Support Center");
  }
  else if (this.email == undefined || this.email == ''|| !re.test(this.email)) {
    this._commonApiCall.hideLoaderShowPopup("Enter Email in valid format.","Support Center");
  }
  else if (this.subject == undefined || this.subject == '') {
    this._commonApiCall.hideLoaderShowPopup("Enter Subject","Support Center");
  }
  else if (this.telephone == undefined || this.telephone == ''||this.telephone.toString().length < 10) {
    this._commonApiCall.hideLoaderShowPopup("Contact Number should be of 10 digit","Support Center");
  }
  else if (this.claimNm == undefined || this.claimNm == '') {
    this._commonApiCall.hideLoaderShowPopup("Enter Claim Number","Support Center");
  }
  else if (this.canIHelp == undefined || this.canIHelp == '') {
    this._commonApiCall.hideLoaderShowPopup("Enter Description How to Help you","Support Center");
  }
  else {
    var data =
      {
        "to_email_address": this.email,
        "from_email_address": this.email,
        "subject_Text": this.subject,
        "body_Text": "<b>" + "Claim Number: " + this.claimNm + "</b>" + "<br/><br/>" + "Hello" + "<br/><br/>"
        + "Regards," + "<br/>" + this.name + "<br/>" + "Email: " + this.email + "<br/>" + "Phone: " + this.telephone
      }
    this._commonApiCall.postService("emails/send", "", "application/json", data)
      .subscribe(res => {
        this._commonApiCall.hideLoaderShowPopup(res.result.email_status,"Help");
        this._route.navigate(['./createNewUser']);
      },
      error => {
        this._commonApiCall.handleError(error,"Help");
      })
  }
}
// Help Cancel Button Method
helpCancel() {
  this._route.navigate(['./createNewUser']);
}
}
