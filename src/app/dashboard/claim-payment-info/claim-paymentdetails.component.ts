import { Component, OnInit }      from '@angular/core';
import { Router } from '@angular/router';

import { CommonAPICall } from '../../shared/shared.service';

@Component({
  selector: 'claiminfo-paymentdetails-page',
  templateUrl: './claim-paymentdetails.html',
  providers: [CommonAPICall]
})

export class ClaimPaymentDetailsComponent implements OnInit {
  checkNumber = ""; paymentAmount = ""; paidTo = ""; checkDate = ""; address1 = "";
  address2 = ""; claimNumber = ""; trans_type = ""; split_amount = ""; dateRange = "";
  cityStateZip = "";
  contentLoaded = false;
  headerToken = 'Bearer ' + localStorage.getItem("token");

  constructor(public _commonAPICall: CommonAPICall, private route: Router) {
  }

  ngOnInit() {
    this.getSelectedClaimPaymentDetails();
  }

  getSelectedClaimPaymentDetails() {

    this._commonAPICall.getService('payment/detail?trans_id=' + localStorage.getItem("trans_id"),
      this.headerToken, "application/json")
      .subscribe(response => {
        // show the page when content of claims is loaded
        this.contentLoaded = true;

        this.claimNumber = localStorage.getItem("claimNumber");

        this.checkNumber = response.result.transaction[0].trans_number;
        this.paymentAmount = response.result.transaction[0].amount;
        this.paidTo = response.result.transaction[0].pay_to_the_order;
        this.checkDate = response.result.transaction[0].date_of_check;
        this.address1 = response.result.transaction[0].addr1;
        this.address2 = response.result.transaction[0].addr2;
        this.trans_type = response.result.transaction[0].trans_type;
        this.split_amount = response.result.transaction[0].split_amount;
        this.dateRange = response.result.transaction[0].dateRange;

        this.cityStateZip = response.result.transaction[0].city + ", " +
          response.result.transaction[0].state + " " + response.result.transaction[0].zip_code;

      });
  }

}
