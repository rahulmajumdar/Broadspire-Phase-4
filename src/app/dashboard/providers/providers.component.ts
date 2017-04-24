import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import {CommonAPICall} from '../../shared/shared.service';

declare var cordova: any;
declare var plugins: any;
declare var window: any;

@Component({
  selector: 'providers',
  templateUrl: './providers.component.html',
  providers: [CommonAPICall]
})


export class ProvidersComponent implements OnInit {
  address = ""; city = ""; state = ""; zipcode = ""; claimNumber = ""; selectedItem = "";
  currentLocationHide = true; contentLoaded = false; taxId2digits = ""; taxId7digits = "";
  phone3digits = ""; phone3digits2 = ""; phone4digits = "";
  headerToken = 'Bearer ' + localStorage.getItem("token");
  specialitesArray = []; radiusdistance = []; folder = {};

  constructor(private _commonApiCall: CommonAPICall, private route: Router) { }

  ngOnInit() {

    this.claimNumber = localStorage.getItem("claimNumber");
    this.getClaimantAddress();
    this.getMedSpecialities();

    this.radiusdistance = ['5', '10', '15', '20', '25', '50', '100'];
    this.selectedItem = this.radiusdistance[0];

  }


  // clear addres and zipcode on click of clear buttonclearData
  clearData() {
    this.zipcode = "";
    this.city = "";
    this.state = "";
    this.address = "";
    this.zipcode = "";
  }


  getClaimantAddress() {
    var urlParameter = 'ClaimantAddresses?claim_id=' + localStorage.getItem("claimId");
    this._commonApiCall.getService(urlParameter, this.headerToken, "application/json")
      .subscribe(response => {

        this.address = response.result[0].addr1;
        this.city = response.result[0].city;
        this.state = response.result[0].state;
        this.zipcode = response.result[0].zip_code;

      },
      error => {
        this._commonApiCall.handleError(error, "Login");
      });
  }

  getMedSpecialities() {
    this._commonApiCall.getService("medicalprovider/specialties", "", "application/json")
      .subscribe(response => {
        this.contentLoaded = true;
        this.specialitesArray = response.result.specialties;

      },
      error => {
        this._commonApiCall.handleError(error, "Login");
      })
  }



  // hide and show location section when current location checked is on or off

  showHideLocation(e) {

    if (e.target.checked)
      this.currentLocationHide = false;

    else
      this.currentLocationHide = true;

  }

  // select item selected by user in dropdown
  searchRadiusdropboxitem(item) {
    this.selectedItem = item;
  }




  // send data to server on click of search providers button
  saveSearchProvidersData = function() {

    localStorage.setItem("local_selectedRadius", this.selectedItem);

    if (this.hospitalGroupName == undefined)
      localStorage.setItem("local_Hospital_GroupName", "%C2%A0");


    else
      localStorage.setItem("local_Hospital_GroupName", this.hospitalGroupName);


    if (this.doctorLastName == undefined)
      localStorage.setItem("local_Doctor_LastName", "%C2%A0");


    else
      localStorage.setItem("local_Doctor_LastName", this.doctorLastName);



    this.taxid = this.taxId2digits + "" + this.taxId7digits;



    if (this.taxid == "") {

      localStorage.setItem("local_TaxId", "%C2%A0");

    }

    else {
      if (this.taxid.toString().length < 9) {
        this._commonApiCall.hideLoaderShowPopup("Tax ID must be a 9 digit number.", "Providers");
        return false;
      }
      else
        localStorage.setItem("local_TaxId", this.taxid);
    }

    this.phoneno = this.phone3digits + "" + this.phone3digits2 + "" + this.phone4digits;

    if (this.phoneno == "") {

      localStorage.setItem("local_ProviderPhoneNumber", "%C2%A0");
    }

    else {
      if (this.phoneno.toString().length < 10) {
        this._commonApiCall.hideLoaderShowPopup("Phone Number must be a 10 digit number.", "Providers");
        return false;
      }
      else
        localStorage.setItem("local_ProviderPhoneNumber", this.phoneno);

    }



    // get current location lat long
    if (this.currentLocationHide == false) {
      this.currentLocationLatLong(this.route);

    }
    // without pincode and current location
    else if (this.currentLocationHide !== false && this.address !== '' && this.city !== '' && this.state !== '') {
      this.combinedAddress = this.address + ' ' + this.city + ' ' + this.state;
      this.getLatLongWithAddress(this.combinedAddress);
    }

    else if (this.currentLocationHide !== false && this.zipcode !== '') {
      if (this.zipcode.toString().length < 5) {
        this._commonApiCall.hideLoaderShowPopup("Zip Code must be a 5 digit number.", "Providers");
        return false;
      }

      else
        this.getLatLongWithZipcode(this.zipcode);

    }
    else {
      this._commonApiCall.hideLoaderShowPopup("Please Enter Either Zipcode or Complete Adress or Choose Current Location", "Providers");
      return false;
    }
    // get text of checkboxes selected in selected specialities dropdown
    this.folder = this.clean(this.folder);
    this.arrayOfKeys = Object.keys(this.folder);
    this.specialitesArray.length = 0;
    this.arrayOfKeys.forEach((key: any) => {
      this.specialitesArray.push(key);
    });

    localStorage.setItem("specialitesArray_string", JSON.stringify(this.specialitesArray));

  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }


  /*----------------- code to get current location with plugins included for app running as ipa or apk starts or browser-------------------- */
  requestLocation(route, obj: any) {
    if (navigator.geolocation) {

      // if the app is running in the browser
      if (typeof cordova === 'undefined') {

        navigator.geolocation.getCurrentPosition(function(position) {
          localStorage.setItem("local_Latitude", "" + position.coords.latitude);
          localStorage.setItem("local_Longitude", "" + position.coords.longitude);
          route.navigate(['./dashboard/physiciansmap']);

        }, function(failure) {
          if (failure.message.indexOf("Only secure origins are allowed") == 0) {

            obj._commonApiCall.hideLoaderShowPopup("Current Location no longer works on insecure origins.To use this feature, you should consider switching your application to a secure origin, such as HTTPS",
              "Providers");
            return false;
          }
          else {

            obj._commonApiCall.hideLoaderShowPopup("Current Location Not Found.", "Providers");
            return false;
          }
          // Secure Origin issue.
        }, { maximumAge: 5 * 60 * 1000, timeout: 10000 });
      }

      // if cordova is defined ,then use the diagnostic plugin
      else {

        cordova.plugins.diagnostic.isLocationEnabled(
          function(enabled) {

            if (enabled) {

              navigator.geolocation.getCurrentPosition(
                function(position) {
                  localStorage.setItem("local_Latitude", "" + position.coords.latitude);
                  localStorage.setItem("local_Longitude", "" + position.coords.longitude);

                  route.navigate(['./dashboard/physiciansmap']);
                },
                function(error) {
                  obj._commonApiCall.hideLoaderShowPopup("Current Location Not Available at this time.Please try again later.", "Providers");
                }, {
                  maximumAge: 5 * 60 * 1000,
                  timeout: 10000
                }
              );

            }

            else {

              if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Tablet/i)) {

                cordova.plugins.diagnostic.switchToLocationSettings();
              }
              else {

                obj._commonApiCall.hideLoaderShowPopup("Please Enable Location Access.", "Providers");
              }
            }
          },
          function(e) {
            obj._commonApiCall.hideLoaderShowPopup('Error ' + e, "Providers");
          }
        );
      }
    }
    else {

      this._commonApiCall.hideLoaderShowPopup("Current Location Not Available.", "Providers");
    }
  }

  // get current location lat long
  currentLocationLatLong(_route) {

    var obj = this;
    // if the app is running in the browser
    if (typeof cordova === 'undefined') {
      this.requestLocation(_route, obj);
    }
    // if the app is running as ipa or apk then use diagnostic plugin
    else {

      // if device is android then this code will run
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Tablet/i)) {
        cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              obj.requestLocation(_route, obj);
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
              obj._commonApiCall.hideLoaderShowPopup("Permission denied", "Providers");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              obj._commonApiCall.hideLoaderShowPopup("Permission permanently denied", "Providers");
              break;
          }
        })
      }

      // if the device is ios then this code will run
      else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {

        cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status) {
          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              obj._commonApiCall.hideLoaderShowPopup("Permission not requested.", "Providers");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
              obj._commonApiCall.hideLoaderShowPopup("Please Enable Location Services to access this feature.", "Providers");
              break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              obj.requestLocation(_route, obj);
              break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
              obj.requestLocation(_route, obj);
              break;
          }
        }, function(error) {
          obj._commonApiCall.hideLoaderShowPopup("The following error occurred: " + error, "Providers");
        });
      }



    }
  }



  /*----------------- code to get current location with plugins included for app runiing as ipa or apk ends-------------------- */



  // get lat long with address
  getLatLongWithAddress(address) {

    this._commonApiCall.getServiceGoogleMaps(address)
      .subscribe(response => {
        if (response.status == "ZERO_RESULTS")
          this._commonApiCall.hideLoaderShowPopup("No Location found for the entered address", "Providers");

        else {
          localStorage.setItem("local_Latitude", response.results[0].geometry.location.lat);
          localStorage.setItem("local_Longitude", response.results[0].geometry.location.lng);
          this.route.navigate(['./dashboard/physiciansmap']);
        }
      },
      error => {
        this._commonApiCall.handleError(error, "Login");
      })
  }

  // get lat long with address
  getLatLongWithZipcode(zipcode) {

    this._commonApiCall.getServiceGoogleMaps(zipcode)
      .subscribe(response => {
        if (response.status == "ZERO_RESULTS")
          this._commonApiCall.hideLoaderShowPopup("No Location found for the entered pincode", "Providers");

        else {
          localStorage.setItem("local_Latitude", response.results[0].geometry.location.lat);
          localStorage.setItem("local_Longitude", response.results[0].geometry.location.lng);
          this.route.navigate(['./dashboard/physiciansmap']);
        }
      },
      error => {
        this._commonApiCall.handleError(error, "Providers");
      })
  }


}
