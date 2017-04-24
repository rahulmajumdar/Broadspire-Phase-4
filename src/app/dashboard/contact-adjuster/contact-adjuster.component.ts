import { Component,OnInit } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { CommonAPICall } from '../../shared/shared.service';


@Component({
    selector: 'contact-adjuster',
    templateUrl: 'contact-adjuster.component.html',
    providers: [HttpModule, CommonAPICall]
})
export class ContactAdjusterComponent implements OnInit {
    claimServicers:string[] = [];
    name:string;
    phone:string;
    email:string;
    superName:string;
    superEmail:string;
    //claims = [];

    //result:JSON;
    //console.log(result:any);
    claimNumber = "";
    isShowContact = false;
    claims1:any[] = JSON.parse(localStorage.getItem('claims'));

    claimId = this.claims1[0].claim_id;
    constructor(private _commonApiCall:CommonAPICall, private _route:Router) {}

    ngOnInit(){
        // Here Contact Adjuster Service Called.
 this.contactAdjusterService();
}

// Contact Adjuster Service call implementation method .
contactAdjusterService(){
  var token = localStorage.getItem('token');
  //var claim_id = localStorage.getItem('claimId');
  this._commonApiCall.getService("claims/servicers?claim_id="+this.claimId,"Bearer "+token, "")
//this._contactAdjuster.contactAdjuster()
            .subscribe(res => {
              //console.log(this.claim1.claim_id);
                this.claimServicers = res.result.claimServicers,
                this.claimNumber = res.result.claimNumber,
                this.name = res.result.claimServicers[0].name,
                this.phone = res.result.claimServicers[0].phone;
                this.email = res.result.claimServicers[0].email;
                this.superName = res.result.claimServicers[1].name;
                this.superEmail = res.result.claimServicers[1].email;
                localStorage.setItem('claim_number',this.claimNumber);

                this.isShowContact = true;

             },
           error => {
             this._commonApiCall.handleError(error,"Contacts");
           });
}
//---------------------------------REDIRECT ADJUSTER INFO MESSAGE METHOD-------------------------------------
claimInfoMessage(){
  localStorage.setItem('pageName','Adjuster');
  localStorage.setItem('name',this.name);
  localStorage.setItem('email',this.email);

  this._route.navigate(['./dashboard/claimInfoMessage']);
}
//---------------------------------REDIRECT EMAIL SUPERVISOR METHOD-------------------------------------

emailSupervisor(){
  localStorage.setItem('pageName','Supervisor');
  localStorage.setItem('superName',this.superName);
  localStorage.setItem('superEmail',this.superEmail);
  this._route.navigate(['./dashboard/claimInfoMessage']);
//  this._route.navigate(['./dashboard/emailSupervisor']);
}
//---------------------------------OPEN DIALER-------------------------------------

contact(){
  //document.location.href = "tel:+"+this.phone;
  window.open('tel:'+this.phone, '_system'); 
}
//-----------------------------------------ITS CALLED AFTER SELECTING OTHER CLAIM NUMBER-----------------------------
selectedClaim = this.claims1[0].claim_number;
  dropboxitemselected(claim){

      this.selectedClaim = claim.claim_number;
      this.claimId = claim.claim_id;
      this.contactAdjusterService();

  }

}
