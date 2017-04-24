import { Component, OnInit } from '@angular/core';
import { HttpModule } from '@angular/http';

import { CommonAPICall } from '../../shared/shared.service';


@Component({
    selector: 'healthTicket',
    templateUrl: 'healthTicket.component.html',
    providers: [HttpModule, CommonAPICall]
})

export class HealthTicketComponent implements OnInit {
    claims1: any[] = JSON.parse(localStorage.getItem('claims'));
    isActive = "1";
    priscription = true;
    primary = false;
    ancillary = false;
    hide = false;

    PatientName = this.claims1[0].employee_full_name;
    DateOfInjury = this.claims1[0].event_date;
    HealthTicketclaimNumber = this.claims1[0].claim_number;
    Employer = this.claims1[0].employer_name;
    BodyPart = this.claims1[0].body_part;
    StateOfJurisdiction = this.claims1[0].juris_state;
    primaryPharmacyName = this.claims1[0].primary_pharm_name;
    primaryBin = this.claims1[0].primary_pharm_bin;
    primaryPCN = this.claims1[0].primary_pharm_pcn;
    primaryGroup = this.claims1[0].primary_pharm_group_num;
    ancillaryPharmName = this.claims1[0].ancillary_pharm_name;
    ancillaryBin = this.claims1[0].ancillary_pharm_bin;
    ancillaryPCN = this.claims1[0].ancillary_pharm_pcn;
    ancillaryGroup = this.claims1[0].ancillary_pharm_group_num;
    primary_pharm_phone_num = this.claims1[0].primary_pharm_phone_num;
    claim = this.claims1[0].claim_status;
    isShow = true;
    //---------------------------Show data according selected claims start----------------------------------------------
    healthTicketSelectedClaim = this.claims1[0].claim_number;
    healthSelectedClaim(claim) {
        if (claim.claim_status == "close") {
            this.isShow = false;
            this._commonApiCall.hideLoaderShowPopup("There are no open claims.", "Health Ticket");
        }
        else {
            this.isShow = true;
            this.healthTicketSelectedClaim = claim.claim_number;
            this.PatientName = claim.employee_full_name;
            this.DateOfInjury = claim.event_date;
            this.HealthTicketclaimNumber = claim.claim_number;
            this.Employer = claim.employer_name;
            this.BodyPart = claim.body_part;
            this.StateOfJurisdiction = claim.juris_state;
            this.primaryPharmacyName = claim.primary_pharm_name;
            this.primaryBin = claim.primary_pharm_bin;
            this.primaryPCN = claim.primary_pharm_pcn;
            this.primaryGroup = claim.primary_pharm_group_num;
            this.ancillaryPharmName = claim.ancillary_pharm_name;
            this.ancillaryBin = claim.ancillary_pharm_bin;
            this.ancillaryPCN = claim.ancillary_pharm_pcn;
            this.ancillaryGroup = claim.ancillary_pharm_group_num;
            this.primary_pharm_phone_num = claim.primary_pharm_phone_num;
            this.claim = claim.claim_status;
        }
    }
    //---------------------------Show data according selected claims end----------------------------------------------

    constructor(private _commonApiCall: CommonAPICall) { }

    ngOnInit() {
        if (this.claim == "close") {
            this.isShow = false;
            this._commonApiCall.hideLoaderShowPopup("There are no open claims.", "Health Ticket");
        }
    }
    healthService() {
        this.isActive = "1";
        this.isShow = true
    }
    // pharmacy Info Methods.
    pharmacyInfo() {
        this.isActive = "2";
        if ((this.primaryPharmacyName == "null" || this.primaryPharmacyName == undefined)
            || (this.ancillaryPharmName == "null" || this.ancillaryPharmName == undefined)) {

            if ((this.ancillaryPharmName == "null" || this.ancillaryPharmName == undefined)) {
                this.priscription = false;
                this.hide = true;
                this.primary = true;
            }
            else {
                this.priscription = false;
                this.hide = true;
                this.ancillary = true;
            }

        }
        else if ((this.primaryPharmacyName == "null" || this.primaryPharmacyName == undefined)
            && (this.ancillaryPharmName == "null" || this.ancillaryPharmName == undefined)) {
            this.hide = false;

        }

        else if ((this.primaryPharmacyName !== "null" || this.primaryPharmacyName !== undefined)
            && (this.ancillaryPharmName !== "null" || this.ancillaryPharmName !== undefined)) {
            this.priscription = false;
            this.hide = true;
            this.primary = true;
            this.ancillary = true;

        }
    }
    // Priscription Id Method.
    priscriptionId() {
        this.isActive = "1";
        this.priscription = true;
        this.hide = false;
        //this.healthService();
    }

}
