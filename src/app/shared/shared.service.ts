import { Component, Injectable, ContentChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Request, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class CommonAPICall {
  public isLoading = false;
  //@ContentChild('showhideinput') input;
  constructor(private _http: Http, private route: Router) {
  }

  getServiceGoogleMaps(url: String) {
    return this._http.get('https://maps.googleapis.com/maps/api/geocode/json?address={' + url + '}&key=AIzaSyBtFiDUC61b_MUe3wiMaIwvfpcz2xb_sQ4')
      .map(resp => resp.json());
  }


  // Get service implementation.
  getService(url: string, headerToken: string, contentType: string) {
    this.isLoading = true;
    document.getElementById("loadingDiv").style.display = "block";

    var headers = new Headers({
      'Authorization': headerToken,
      'Content-Type': contentType,
      'ApplicationVersion': "3.0",
      'Platform': "Browser",
      'ApplicationName': 'MyClaim'

    })
    var options = new RequestOptions({
      headers: headers
    })

    return this._http.get(localStorage.getItem('local_appUrl') + url, options)
    .timeout(15000, Observable.throw('Error Timeout'))
      .map(resp => {
        // code to show loader when http request is called
        this.isLoading = false;
        document.getElementById("loadingDiv").style.display = "none";
        return resp.json();

      });

  }
  // Post Service Implementation.
  postService(url: string, headerToken: string, contentType: string, data: any) {

    this.isLoading = true;
    document.getElementById("loadingDiv").style.display = "block";

    var headers = new Headers({
      'Authorization': headerToken,
      'Content-Type': contentType,
      'ApplicationVersion': "3.0",
      'Platform': "Browser",
      'ApplicationName': 'MyClaim'
    })

    var options = new RequestOptions({
      headers: headers
    })

    return this._http.post(localStorage.getItem('local_appUrl') + url, data, options)
      .timeout(15000, Observable.throw('Error Timeout'))
      .map(resp => {
        // code to show loader when http request is called
        this.isLoading = false;
        document.getElementById("loadingDiv").style.display = "none";

        return resp.json();
      })
  }

  //Put Service Implementation.
  putService(url: string, headerToken: string, contentType: string, data: Object) {
    this.isLoading = true;
    document.getElementById("loadingDiv").style.display = "block";

    var headers = new Headers({
      'Authorization': headerToken,
      'Content-Type': contentType,
      'ApplicationVersion': "3.0",
      'Platform': "Browser",
      'ApplicationName': 'MyClaim'

    })
    var options = new RequestOptions({
      headers: headers
    })

    return this._http.put(localStorage.getItem('local_appUrl') + url, data, options)
    .timeout(10000, Observable.throw('Error Timeout'))
      .map(resp => {
        // code to show loader when http request is called
        this.isLoading = false;
        document.getElementById("loadingDiv").style.display = "none";
        return resp.json();
      });

  }

  // handle errors in http requests, hide loader and show error in popup
  handleError(res: any, errorHeading) {
console.log(res);
    if (res.status == 500 || res.status == 0) {
      var message = "The service is currently unavailable at this time. Please try your inquiry again later. We apologize for any inconvenience.";
      this.hideLoaderShowPopup(message, errorHeading);
    }
    else if (res.status == 408 || res.error == "Error Timeout") {
      var message = "Your inquiry has experienced a delay.  Please try again later.  If problem persists, please contact our Support Center at MyClaim_SelfService_Support@broadspire.com.";
      this.hideLoaderShowPopup(message, errorHeading);
    }

    else if (res.json().error != null) {
      if (res.json().error_uri != undefined && res.json().error_uri == "FirstTimeLogIn" ||
        res.json().error_uri != undefined && res.json().error_uri == "PasswordExpired") {
        document.getElementById("loadingDiv").style.display = "none";
        this.route.navigate(['firstTimeLogin']);
      }

      else
        this.hideLoaderShowPopup(res.json().error_description, errorHeading);

    }

    else if (res.json().errors !== null) {
    //  let classname = document.getElementsByClassName("closepopup");
        let classname = document.getElementById("closeMe");
      var routevar = this.route;

      classname.addEventListener('click', function cls(event) {
        if (res.json().errorMessage == "Authorization has been denied for this request.") {
          document.getElementById("closeMe").removeEventListener('click', cls);
          routevar.navigate(['']);
        }

      }, false);
      this.hideLoaderShowPopup(res.json().htmlErrors, errorHeading);
      //document.getElementById("loadingDiv").style.display = "none";





    }
    else if (res.status = 400) {
      this.hideLoaderShowPopup("Bad Request", errorHeading);

    }


    else {
      throw new Error("HTTP error: " + res.statusText + " (" + res.status + ")");
    }

  }
navigate(){
  this.route.navigate(['']);
}
  // this function is to hide loader and display error message when error has occured in http request
  hideLoaderShowPopup(message, errorHeading) {
    document.getElementById("openModalButton").click();
    document.getElementById('modalLabel').innerHTML = message;
    document.getElementById('modal-head').innerHTML = errorHeading;
    document.getElementById("loadingDiv").style.display = "none";

  }
  //-----------------------------------------------Show/Hide password method start-------------------------------------
  type= "password";
  show = false;
  toggleShow()
    {
      //console.log(this.show);
        this.show = !this.show;
        if (this.show){
            this.type = "text";
            return this.type;
        }
        else {
            this.type = "password";
            return this.type;
        }
    }
  //-----------------------------------------------Show/Hide password method end-------------------------------------
}
