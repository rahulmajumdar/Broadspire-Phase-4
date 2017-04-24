import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CommonAPICall} from '../../shared/shared.service';


declare var google: any;

@Component({
  selector: 'physiciansmap',
  templateUrl: './nearbyphysicians_map.component.html',
  providers: [CommonAPICall]
})

export class NearbyPhysiciansMap implements OnInit {
  map; mapOptions;item = 1;
  infoWindow; marker; bounds;
  markers = []; totalPages = []; providersList;
  markerOptions; infoWindowOptions;
  showPagination = false;

  constructor(private _commonApiCall: CommonAPICall, private route: Router) { }

  ngOnInit() {
    this.getMapData(0);
  }


  //get claims of page number clicked
  paginationItemClicked($event) {
    this.getMapData($event.currentTarget.text - 1);
  }


  getMapData(pageNumber) {
    var specialitiesArray = JSON.parse(localStorage.getItem("specialitesArray_string"));

    var str1 = specialitiesArray.toString();
    var str2 = str1.replace(/,/g, "?");
    str2 = str2.replace(/&/g, "%20%26");

    if (str2 == "")
      str2 = "%C2%A0";

    var urlParameter = 'medicalproviders?From_Latitude=' + localStorage.getItem("local_Latitude") +
      '&From_Longitude=' + localStorage.getItem("local_Longitude") + '&Radius=' +
      localStorage.getItem("local_selectedRadius") + '&Facility_Name=' +
      localStorage.getItem("local_Hospital_GroupName") + '&Doctor_Last_Name=' +
      localStorage.getItem("local_Doctor_LastName") + '&Provider_Tax_id=' +
      localStorage.getItem("local_TaxId") + '&Provider_Phone_Number=' +
      localStorage.getItem("local_ProviderPhoneNumber") + '&Specialties=' + str2 + '&PageSize=10&PageNumber=' + pageNumber;

    // calling service
    this._commonApiCall.getService(urlParameter, "", "application/json")
      .subscribe(response => {

        if (response.result.message == "No providers found for search criteria provided") {
          this._commonApiCall.hideLoaderShowPopup("No providers found for search criteria provided", "Providers");

          this.route.navigate(['./dashboard/providers']);

        } else {
          if (pageNumber == 0) {
            if (response.result.paging.totalPages == 0 || response.result.paging.totalPages == 1) {
              this.showPagination = false;
            }
            else {
              this.totalPages = [];
              this.showPagination = true;
              for (var i = 1; i <= response.result.paging.totalPages; i++) {
                this.totalPages.push(i);
              }

            }
          }
          this.providersList = response.result.medicalproviders;

          /* -------------------------Creating map and markers and adding click to markers starts-----------------------------------------------*/

          this.bounds = new google.maps.LatLngBounds();
          // show the map and place some markers
          this.initMap();

          for (var i = 0; i < response.result.medicalproviders.length; i++) {
            var phoneNo = "";
            if (response.result.medicalproviders[i].phone != undefined || response.result.medicalproviders[i].phone != null) {
              var number = response.result.medicalproviders[i].phone;
              phoneNo = number.substring(0, 3) + "-" + number.substring(3, 6) + "-" + number.substring(6, 10);
            }
            this.setMarker(this.map, new google.maps.LatLng(response.result.medicalproviders[i].latitude, response.result.medicalproviders[i].longitude), response.result.medicalproviders[i].facility_name,
              "<b>" + response.result.medicalproviders[i].facility_name + "</b> <br/>" + response.result.medicalproviders[i].medical_specialty + "<br/>" + response.result.medicalproviders[i].address1 + " " + response.result.medicalproviders[i].address2 + "<br/>" + response.result.medicalproviders[i].city + ", "
              + response.result.medicalproviders[i].state + " " + response.result.medicalproviders[i].zip_code + "<br/>" + phoneNo);
            this.bounds.extend(new google.maps.LatLng(response.result.medicalproviders[i].latitude, response.result.medicalproviders[i].longitude));
          }
          this.map.fitBounds(this.bounds);

          /* -------------------------Creating map and markers and adding click to markers ends-----------------------------------------------*/
        }
      },
      error => {
        this._commonApiCall.handleError(error, "Providers");
      });
  }

  // initialize the map
  initMap() {

    if (this.map === void 0) {

      // map config
      this.mapOptions = {

        center: new google.maps.LatLng(30.2891, -97.6975),
        zoom: 10,
        panControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false

      };

      this.map = new google.maps.Map(document.getElementById('gmaps'), this.mapOptions);
    }
  }

  // place a marker
  setMarker(map, position, title, content) {

    this.markerOptions = {
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: title,
      icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };

    var marker = new google.maps.Marker(this.markerOptions);
    this.markers.push(this.marker); // add marker to array

    google.maps.event.addListener(marker, 'click', function() {

      // close window if not undefined

      if (this.infoWindow !== void 0) {
        this.infoWindow.close();
      }

      // create new window
      this.infoWindowOptions = {
        content: content
      };

      this.infoWindow = new google.maps.InfoWindow(this.infoWindowOptions);
      this.infoWindow.open(map, marker);

    });

  }




// open google maps app or website when list item is clicked
  clickedItemLatLong(selectedLat: any, selectedLong: any) {

    var startLat = localStorage.getItem("local_Latitude");
    var startLng = localStorage.getItem("local_Longitude");

    if (navigator.userAgent.match(/iPhone/i))
      window.open("maps://maps.google.com/maps?saddr=" + startLat + "," + startLng + "&daddr=" + selectedLat + "," + selectedLong);

    else if (navigator.userAgent.match(/Android/i))
      window.open("http://maps.google.com/maps?saddr=" + startLat + "," + startLng + "&daddr=" + selectedLat + "," + selectedLong);

    else
      window.open("http://maps.google.com/maps?saddr=" + startLat + "," + startLng + "&daddr=" + selectedLat + "," + selectedLong);

  }


}
