//Import Component form the angular core package
import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonAPICall } from '../../shared/shared.service';

//Compoent Decorator
@Component({
    selector: 'css-carousel',
    templateUrl: 'appTutorial.component.html',
    providers: [CommonAPICall]
})
//Carousel Component itself
export class AppTutorialComponent implements OnInit {
    images = [];
    width;
    height;
    //  tabLandscape =[];
    desktopAppImages = [
        { "url": "imagesnew/appTutorial/1.png" }, { "url": "imagesnew/appTutorial/2.png" }, { "url": "imagesnew/appTutorial/3.png" },
        { "url": "imagesnew/appTutorial/4.png" }, { "url": "imagesnew/appTutorial/5.png" }, { "url": "imagesnew/appTutorial/6.png" },
        { "url": "imagesnew/appTutorial/7.png" }
    ];
    tabLandscapeImages = [
        { "url": "imagesnew/Tab_portrait mode_App/1.png" }, { "url": "imagesnew/Tab_portrait mode_App/2.png" },
        { "url": "imagesnew/Tab_portrait mode_App/3.png" }, { "url": "imagesnew/Tab_portrait mode_App/4.png" },
        { "url": "imagesnew/Tab_portrait mode_App/5.png" }, { "url": "imagesnew/Tab_portrait mode_App/6.png" },
        { "url": "imagesnew/Tab_portrait mode_App/7.png" }
    ];
    tabPortraitImages = [
        { "url": "imagesnew/iPADLANDSCAPEAPP/1.png" }, { "url": "imagesnew/iPADLANDSCAPEAPP/2.png" },
        { "url": "imagesnew/iPADLANDSCAPEAPP/3.png" }, { "url": "imagesnew/iPADLANDSCAPEAPP/4.png" },
        { "url": "imagesnew/iPADLANDSCAPEAPP/5.png" }, { "url": "imagesnew/iPADLANDSCAPEAPP/6.png" },
        { "url": "imagesnew/iPADLANDSCAPEAPP/7.png" }
    ];
    mobileRegistrationImages = [
        { "url": "imagesnew/MOBILE_APPTUTORIALS/1.png" }, { "url": "imagesnew/MOBILE_APPTUTORIALS/2.png" },
        { "url": "imagesnew/MOBILE_APPTUTORIALS/3.png" }, { "url": "imagesnew/MOBILE_APPTUTORIALS/4.png" },
        { "url": "imagesnew/MOBILE_APPTUTORIALS/5.png" }, { "url": "imagesnew/MOBILE_APPTUTORIALS/6.png" },
        { "url": "imagesnew/MOBILE_APPTUTORIALS/7.png" }
    ];
    slideIndex = 2;
    //desktop = false;
    tab = false;
    constructor(private _commonApiCall?: CommonAPICall, private element?: ElementRef) { }

    //-----------------------------------------------------------OnInit Method Start-----------------------------------------------------
    ngOnInit() {
        // Listen for resize changes
        console.log(navigator.userAgent.match(/Tablet|iPad/i));
        console.log("inner :" + window.innerWidth, "outer :" + window.innerHeight);

        if (navigator.userAgent.match(/Tablet|iPad/i)) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            window.addEventListener("resize", () => {
                //Get screen size (inner/outerWidth, inner/outerHeight)
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                console.log("innerWidth :" + this.width, "innerHeight :" + this.height);
                if (this.width > this.height) {
                    this.images = this.tabPortraitImages;
                    setTimeout(() => { this.plusDivs(-1);}, 1);
                    //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000);
                }
                else {
                    this.images = this.tabLandscapeImages;
                    setTimeout(() => { this.plusDivs(-1);}, 1);
                    //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000);
                }

            }, false);

            if (this.width > this.height) {
                this.images = this.tabPortraitImages;
                setTimeout(() => { this.plusDivs(-1);}, 1);
                //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000);
            }
            else {
                this.images = this.tabLandscapeImages;
                setTimeout(() => { this.plusDivs(-1);}, 1);
                //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000);
            }
        }
        else if (navigator.userAgent.match(/Android|iPhone/i)) {
            this.images = this.mobileRegistrationImages;
            setTimeout(() => { this.plusDivs(-1);}, 1);
            //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000);
        }
        else {
            this.images = this.desktopAppImages;
            setTimeout(() => { this.plusDivs(-1);}, 1);
            //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000);
        }
    }
    //-----------------------------------------------------------OnInit Method End-----------------------------------------------------


    //-----------------------------------------------------------Get Tutorial Method Start-----------------------------------------------------

    getTutorial() {
        this._commonApiCall.getService("supportContent?Type=Registration", "", "")
            .subscribe(res => {
                //console.log(res);
                this.images = res.result;

            })
    }
    //-----------------------------------------------------------Get Tutorial Method End-----------------------------------------------------

    plusDivs(n) {
        this.showDivs(this.slideIndex += n);
    }
    showDivs(n) {
        var i;
        var x = document.getElementsByClassName("mySlides");
        if (n > x.length) { this.slideIndex = 1 }
        if (n < 1) { this.slideIndex = x.length }
        for (i = 0; i < x.length; i++) {
            document.getElementById("mySlides" + i).style.display = "none";
            //console.log(document.getElementById("mySlides"+i));
        }
        document.getElementById("mySlides" + (this.slideIndex - 1)).style.display = "block";
    }
    //images data to be bound to the template

}
