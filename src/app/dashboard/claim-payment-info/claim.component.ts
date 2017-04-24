import { Component, OnInit }      from '@angular/core';
import { Router } from '@angular/router';

import { CommonAPICall } from '../../shared/shared.service';

declare var window: any;

@Component({
  selector: 'claiminfo-page',
  templateUrl: './claim.html',
  providers: [CommonAPICall]
})

export class ClaimComponent implements OnInit {
  headerToken = 'Bearer ' + localStorage.getItem("token");
  claims: string[] = [];
  currentclaims: string[] = [];
  totalPages: number[] = [];
  userId = ""; userSSN = ""; userDOB = ""; zipCode = "";
  currentclaim = true; myclaim = false; addclaim = false; showPaginationLoading = false;
  contentLoaded = false;
  item = ""; totalAmount = ""; claimStatus = ""; claimNumber = "";
  dolImgShow = false; dolImg = "";
  pageCount = 1; pageLoadCount = 1;

  constructor(public _dashboardApiService: CommonAPICall, private route: Router) {


  }

  ngOnInit() {
    // item = 2 and currentclaim = true ,, selects currentclaim option in the navbar
    this.item = "2";
    this.myClaimService();

  }

  // this is to show date of loss image claim number image when links is clicked
  dateOfLossInfo() {
    let object = this;
    document.getElementById("claimspagediv").onscroll = function(event) { object.onScroll(event) };
    this._dashboardApiService.getService("supportContent?Type=HelpDateOfLoss", "", "")
      .subscribe(res => {
        this.dolImgShow = true;
        this.dolImg = res.result[0].base64;
      },
      error => {
        this._dashboardApiService.handleError(error, "Claims");
      })
  }

  dateOfClaimInfo() {

    this._dashboardApiService.getService("supportContent?Type=HelpClaimNumber", "", "")
      .subscribe(res => {
        this.dolImgShow = true;
        this.dolImg = res.result[0].base64;
      },
      error => {
        this._dashboardApiService.handleError(error, "Claims");
      })
  }
  close() {
    this.dolImgShow = false;
  }

  // this code is remove absolute position when add claim or myclaim is clicked
  removePositionAbsolute() {
    document.getElementById('claimspagediv').style.position = 'relative';
    document.getElementById("claimspagediv").style.zIndex = "0";
  }


  onScroll(event) {

    if (this.pageCount == this.totalPages.length) {
      this.enableScroll();
    }
    else {
      this.disableScroll();

      var height = this.getDocHeight();
      if (this.pageCount == this.pageLoadCount + 1) {
        if (this.currentclaim == true && height <= (window.pageYOffset || document.documentElement.scrollTop || Math.ceil(document.body.scrollTop)) + window.innerHeight + 1) {
          this.disableScroll();
          this.pageLoadCount = this.pageCount;
          //  this.pageCount = this.pageCount + 1;

          if (this.totalPages.length > 0 && this.pageCount < this.totalPages.length) {
            this.disableScroll();
            this.showPaginationLoading = true;

            // this code is to hide the main loader and place content of current on top
            //of it by increasing its z-index
            document.getElementById('claimspagediv').style.position = 'absolute';
            document.getElementById("claimspagediv").style.zIndex = "10";

            this.getCurrentClaims(localStorage.getItem("claimId"), this.pageCount, 8);


          }
          else {
            this.enableScroll();
          }
        }
        else {
          this.enableScroll();
        }
      }
      else {
        this.enableScroll();
      }
    }
  }

  //-------------------------- Code to enable disable scrolling starts----------------------------------------
  keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  preventDefaultForScrollKeys(e) {
    if (this.keys[e.keyCode]) {
      this.preventDefault(e);
      return false;
    }
  }

  disableScroll() {
    if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onwheel = this.preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
    window.ontouchmove = this.preventDefault; // mobile
    document.onkeydown = this.preventDefaultForScrollKeys;
  }

  enableScroll() {
    if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }

  //------------------------- Code to enable disable scrolling ends---------------------------------





  getDocHeight() {
    var D = document;
    return Math.max(
      Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
  }


  // open claim info page when claim number is clicked in current claims
  openClaimInfoPage() {
    this.route.navigate(['./dashboard/claim-info']);

  }

  // navigate to claim payment details page when a claim is clicked in current claims section
  clickedItemTransNumber(trans_id) {
    localStorage.setItem("trans_id", trans_id);
    this.route.navigate(['./dashboard/claim-paymentdetailspage']);
  }

  // call getCurrentClaims service when any myclaims is clicked
  myclaimClickedItemDetails(claimNum, claimStat, claimId, adjusterName,
    adjusterEmail, adjusterPhone, dateOfLoss, employeeName) {
    this.item = "2";
    this.pageCount = 1;
    this.pageLoadCount = 1;
    localStorage.setItem("claimNumber", claimNum);
    localStorage.setItem("claimId", claimId);
    localStorage.setItem("ClaimStatus", claimStat);
    localStorage.setItem("ClaimNumber", claimNum);
    this.claimStatus = localStorage.getItem("ClaimStatus");
    this.claimNumber = localStorage.getItem("ClaimNumber");
    localStorage.setItem("selectedClaimClaimId", claimId);
    this.getCurrentClaims(claimId, 0, 16);
    //  this.getCurrentClaims(claimId, 1, 8);

    // select currentclaim option in navbar
    this.currentclaim = true; this.myclaim = false; this.addclaim = false;

    localStorage.setItem("AdjusterName", adjusterName);
    localStorage.setItem("AdjusterEmail", adjusterEmail);
    localStorage.setItem("AdjusterPhone", adjusterPhone);
    localStorage.setItem("SelectedMyClaimStatus", claimStat);
    localStorage.setItem("SelectedMyClaimDatOfLoss", dateOfLoss);
    localStorage.setItem("SelectedMyClaimEmployeeName", employeeName);

  }

  //call to get myclaims service
  myClaimService() {

    this._dashboardApiService.getService("claims", this.headerToken, "application/json")
      .subscribe(response => {
        this.claims = response.result.claims;
        localStorage.setItem("claims", JSON.stringify(response.result.claims));

        var claimNumberArray = [];
        var claimIdArray = [];

        for (var i = 0; i < response.result.claims.length; i++) {
          claimNumberArray.push(response.result.claims[i].claim_number);
          claimIdArray.push(response.result.claims[i].claim_id);
        }

        // if user has selected another my claim then this if block should not run
        // this is to show data of claim selected by user and not of 1st claim
        if (localStorage.getItem("selectedClaimClaimId") == undefined || localStorage.getItem("selectedClaimClaimId") == "") {
          localStorage.setItem("claimNumberArray", JSON.stringify(claimNumberArray));
          localStorage.setItem("claimIdArray", JSON.stringify(claimIdArray));


          localStorage.setItem("claimNumber", response.result.claims[0].claim_number);
          localStorage.setItem("claimId", response.result.claims[0].claim_id);
          localStorage.setItem("SelectedMyClaimDatOfLoss", response.result.claims[0].event_date);
          localStorage.setItem("SelectedMyClaimEmployeeName", response.result.claims[0].employee_full_name);

          localStorage.setItem("AdjusterName", response.result.claims[0].adjuster_name);
          localStorage.setItem("AdjusterEmail", response.result.claims[0].adjuster_email);
          localStorage.setItem("AdjusterPhone", response.result.claims[0].adjuster_phone);
          localStorage.setItem("SelectedMyClaimStatus", response.result.claims[0].claim_status);

          localStorage.setItem("ClaimStatus", response.result.claims[0].claim_status);
          localStorage.setItem("ClaimNumber", response.result.claims[0].claim_number);
        }
        this.claimStatus = localStorage.getItem("ClaimStatus");
        this.claimNumber = localStorage.getItem("ClaimNumber");
        this.getCurrentClaims(localStorage.getItem("claimId"), 0, 16);
        //  this.getCurrentClaims(localStorage.getItem("claimId"), 1, 8);
        this.getAddClaimService();
      },
      error => {
        this._dashboardApiService.handleError(error, "Login");
      })
  }

  //call to get currentclaim service
  getCurrentClaims(claimId, pageNumber, pageSize) {

    var myClaimServiceUrl = "payments/?claim_id=" + claimId +
      "&pageNum=" + pageNumber + "&pageSize=" + pageSize;



    // in first requesting , i m requesting 16 claims and in subsquents requests i m reqstn 8 claims
    // the no of pages returned in 1st request is multiplied by 2.
    this._dashboardApiService.getService(myClaimServiceUrl, this.headerToken, "application/x-www-form-urlencoded")
      .subscribe(response => {
        this.enableScroll();
        // show the page when content of claims is loaded

        this.contentLoaded = true;
        this.showPaginationLoading = false;


        if (pageNumber == 0 || pageNumber == 1) {
          //   document.getElementById("showPaginationLoading").style.display = "none";
          this.currentclaims = [];
          this.currentclaims = response.result.transactions;

          // if claims has more than 2 pages then only show loader at bottom

        }


        else {

          for (var i = 0; i < response.result.transactions.length; i++) {
            this.currentclaims.push(response.result.transactions[i]);

          }

        }
        this.totalAmount = response.result.transactions[0].total_amount;

        // if request is for page 0 then only add pagecount in totalpages
        if (pageNumber == 0) {

          if (response.result.paging.totalPages == 0 || response.result.paging.totalPages == 1) {
            // this.showPaginationLoading = false;
          }
          else {
            this.totalPages = [];
            // this.showPaginationLoading = false;
            for (var i = 1; i <= 2 * response.result.paging.totalPages; i++) {
              this.totalPages.push(i);
            }

          }
        }

        if (pageNumber == (this.totalPages.length - 1)) {

        }
        this.pageCount = this.pageCount + 1;
      },
      error => {
        this._dashboardApiService.handleError(error, "Login");
      })
  }

  getAddClaimService() {
    this._dashboardApiService.getService("users", this.headerToken, "application/json")
      .subscribe(response => {
        this.userId = response.result.userId;
        this.userSSN = response.result.userSSN;
        this.userDOB = response.result.userDOB;
        this.zipCode = response.result.zipCode;
      },
      error => {
        this._dashboardApiService.handleError(error, "Login");
      })
  }

  // need to test this function but not sure whether it can be tested with terry's id or not
  // add a new claim
  addNewClaim(month: string, date: string, year: string, claimNo: string) {

    if (month == "" || month == undefined || date == "" || date == undefined || year == "" || year == undefined) {
      this._dashboardApiService.hideLoaderShowPopup("Please Enter Date Of Loss.", "Claims");

    }
    else if (claimNo == "" || claimNo == undefined) {
      this._dashboardApiService.hideLoaderShowPopup("Please Enter Claim Number.", "Claims");

    }
    else if (parseInt(year) < 1900 || parseInt(year) > 2100) {
      this._dashboardApiService.hideLoaderShowPopup("Please enter a year between 1900 and 2100.", "Claims");
    }
    else {
      var dateOfLoss = month + "-" + date + "-" + year;
      var addClaimObject = { "claim_Number": claimNo, "dateOfLoss": dateOfLoss };

      this._dashboardApiService.postService("claims", this.headerToken, "application/json", addClaimObject)
        .subscribe(response => {
          console.log(JSON.stringify(response));
          this._dashboardApiService.hideLoaderShowPopup("Claim Added Successfully.", "Claims");

          month = "";
          date = "";
          year = "";
          claimNo = "";
          this.myClaimService();
        },
        error => {
          this._dashboardApiService.handleError(error, "Claims");
        })
    }

  }


}
