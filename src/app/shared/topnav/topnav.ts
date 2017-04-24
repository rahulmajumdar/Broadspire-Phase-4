import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {Location} from '@angular/common';

@Component({

  selector: 'top-nav',
  templateUrl: 'topnav.html',
})

export class TopNavComponent {
  title = ''; parent: boolean = false;
parent2 = true;
  WelcomeUsername = localStorage.getItem('welcomeUsername');

  data: any;

  constructor(private route: ActivatedRoute, private router: Router, private _location: Location) { console.log('WelcomeUsername::' + this.WelcomeUsername); }
  doc: any;

  handlerFunction(event) {

  }
  ngOnInit() {

    this.router.events
      //  .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }
        this.data = currentRoute.snapshot.data;

        //add title to header
        this.title = this.data.title;

        // add back button to header if route has parent defined
        if (this.data.parent != undefined){
          this.parent = true;
          this.parent2 = false;}

        else{
          this.parent2 = true;
          this.parent = false;
        }

      })
  }

  goBack() {
    document.getElementById("loadingDiv").style.display = "none";
    this._location.back();
  }

  // code to slide up and down more options in mobile footer
  enableToggle(event) {

    var className = document.getElementById("togg-dv").className;
    if (className == "hidden-content slide-down")
      document.getElementById("togg-dv").className = "hidden-content slide-up";

    else
      document.getElementById("togg-dv").className = "hidden-content slide-down";



    var theElement = document.getElementById("pageHtml");


    theElement.onclick = function() {
      var className = document.getElementById("togg-dv").className;

      if (className == "hidden-content slide-down"){

        document.getElementById("togg-dv").className = "hidden-content slide-up";

      }
    }


    theElement.ontouchstart = function() {
      var className = document.getElementById("togg-dv").className;
      if (className == "hidden-content slide-down")
        document.getElementById("togg-dv").className = "hidden-content slide-up";
    }

    event.stopPropagation();
    return false;
  }



               // changeTheme(color: string): void {
               //            var link: any = $('<link>');
               //            link
               //                           .appendTo('head')
               //                           .attr({type : 'text/css', rel : 'stylesheet'})
               //                           .attr('href', 'themes/app-'+color+'.css');
               // }
  //
               // rtl(): void {
               //            var body: any = $('body');
               //            body.toggleClass('rtl');
               // }
  //
               // sidebarToggler(): void  {
               //            var sidebar: any = $('#sidebar');
               //            var mainContainer: any = $('.main-container');
               //            sidebar.toggleClass('sidebar-left-zero');
               //            mainContainer.toggleClass('main-container-ml-zero');
               // }
}
