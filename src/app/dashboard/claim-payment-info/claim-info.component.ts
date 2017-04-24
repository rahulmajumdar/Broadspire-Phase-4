import { Component, OnInit }      from '@angular/core';
import { Router } from '@angular/router';

import { CommonAPICall } from '../../shared/shared.service';

@Component({
  selector: 'claiminfo-page',
  templateUrl: './claim-info.html',
  providers: [CommonAPICall]
})

export class ClaimInfoComponent implements OnInit {
claimNumber = "";employeeName = "";dateOfLoss = "";
adjusterName = "";adjusterEmail = "";claimStat = "";
claimStatus = "";

  constructor(public _dashboardApiService: CommonAPICall, private route: Router) {


  }

  ngOnInit() {
    this.claimNumber = localStorage.getItem("claimNumber");
    this.adjusterName = localStorage.getItem("AdjusterName");
    this.adjusterEmail = localStorage.getItem("AdjusterEmail");

    this.claimStatus = localStorage.getItem("SelectedMyClaimStatus");
    this.dateOfLoss  = localStorage.getItem("SelectedMyClaimDatOfLoss");
    this.employeeName = localStorage.getItem("SelectedMyClaimEmployeeName");
  }

  openPhoneDialerFromClaimInfo=function(){
  //  this.adjusterPhone = localStorage.getItem("AdjusterPhone");
    document.location.href = "tel:+"+localStorage.getItem("AdjusterPhone");
  //window.location = "tel:"+this.AdjusterPhoneNumber ;//(44) 4444-4444";
  }
}
