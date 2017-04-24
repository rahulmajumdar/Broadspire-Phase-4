//Import Component form the angular core package
import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonAPICall } from '../shared/shared.service';

//Compoent Decorator
@Component({
  selector: 'css-carousel',
  templateUrl:'registrationTutorial.component.html',
  providers: [CommonAPICall]
})
//Carousel Component itself
export class RegistrationTutorialComponent implements OnInit {
  images=[];
  width;
  height;
  isShow =false;
//  tabLandscape =[];
desktopRegistrationImages = [
	{ "url": "imagesnew/1.png" },{ "url": "imagesnew/2.png" },{"url": "imagesnew/3.png" },
  { "url": "imagesnew/4.png" },{  "url": "imagesnew/5.png" },{  "url": "imagesnew/6.png" },
  {  "url": "imagesnew/7.png" },{  "url": "imagesnew/8.png" },{  "url": "imagesnew/9.png" }
];
tabLandscape = [
  { "url": "imagesnew/Tab_portrait mode_Regis/1.png" },{ "url": "imagesnew/Tab_portrait mode_Regis/2.png" },
  {"url": "imagesnew/Tab_portrait mode_Regis/3.png" },{ "url": "imagesnew/Tab_portrait mode_Regis/4.png" },
  {  "url": "imagesnew/Tab_portrait mode_Regis/5.png" },{  "url": "imagesnew/Tab_portrait mode_Regis/6.png" },
  {  "url": "imagesnew/Tab_portrait mode_Regis/7.png" },{  "url": "imagesnew/Tab_portrait mode_Regis/8.png" },
  {  "url": "imagesnew/Tab_portrait mode_Regis/9.png" }
];
tabPortrait = [
  { "url": "imagesnew/iPADLANDSCAPEREGISTRATION/1.png" },{ "url": "imagesnew/iPADLANDSCAPEREGISTRATION/2.png" },
  {"url": "imagesnew/iPADLANDSCAPEREGISTRATION/3.png" },{ "url": "imagesnew/iPADLANDSCAPEREGISTRATION/4.png" },
  {  "url": "imagesnew/iPADLANDSCAPEREGISTRATION/5.png" },{  "url": "imagesnew/iPADLANDSCAPEREGISTRATION/6.png" },
  {  "url": "imagesnew/iPADLANDSCAPEREGISTRATION/7.png" },{  "url": "imagesnew/iPADLANDSCAPEREGISTRATION/8.png" },
  {  "url": "imagesnew/iPADLANDSCAPEREGISTRATION/9.png" }
];
mobileRegistrationImages = [
  { "url": "imagesnew/MOBILE_REGISTRATION/1.png" },{ "url": "imagesnew/MOBILE_REGISTRATION/2.png" },
  {"url": "imagesnew/MOBILE_REGISTRATION/3.png" },{ "url": "imagesnew/MOBILE_REGISTRATION/4.png" },
  {  "url": "imagesnew/MOBILE_REGISTRATION/5.png" },{  "url": "imagesnew/MOBILE_REGISTRATION/6.png" },
  {  "url": "imagesnew/MOBILE_REGISTRATION/7.png" },{  "url": "imagesnew/MOBILE_REGISTRATION/8.png" },
  {  "url": "imagesnew/MOBILE_REGISTRATION/9.png" }
];
  slideIndex=2;
  constructor(private _commonApiCall?: CommonAPICall, private element?: ElementRef){}

  //-----------------------------------------------------------OnInit Method Start-----------------------------------------------------
  ngOnInit(){

    // Listen for resize changes
console.log(navigator.userAgent.match(/Tablet|iPad/i));
    console.log("inner :"+window.innerWidth,"outer :"+window.innerHeight);

if(navigator.userAgent.match(/Tablet|iPad/i)){
this.width = window.innerWidth;
this.height = window.innerHeight;
  window.addEventListener("resize", ()=> {
  	//Get screen size (inner/outerWidth, inner/outerHeight)
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  console.log("innerWidth :"+this.width,"innerHeight :"+this.height);
  if(this.width>this.height){
    this.images = this.tabPortrait;
    setTimeout(() => { this.plusDivs(-1);}, 1);
    //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000 );
  }
  else{
    this.images = this.tabLandscape;
    setTimeout(() => { this.plusDivs(-1);}, 1);
    //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000 );
  }

  }, false);

  if(this.width>this.height){
    this.images = this.tabPortrait;
    setTimeout(() => { this.plusDivs(-1);}, 1);
    //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000 );
  }
  else{
    this.images = this.tabLandscape;
    setTimeout(() => { this.plusDivs(-1);}, 1);
    //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000 );
  }
}
else if(navigator.userAgent.match(/Android|iPhone/i)){
  this.images = this.mobileRegistrationImages;
  setTimeout(() => { this.plusDivs(-1);}, 1);
  //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000 );
}
else{

  this.images = this.desktopRegistrationImages;
    setTimeout(() => { this.plusDivs(-1);}, 1);
  //setInterval(() => { this.showDivs(this.slideIndex += 1); }, 10000 );
}
  }
  //-----------------------------------------------------------OnInit Method End-----------------------------------------------------


  //-----------------------------------------------------------Get Tutorial Method Start-----------------------------------------------------

  getTutorial(){
    this._commonApiCall.getService("supportContent?Type=Registration","","")
    .subscribe(res=>{

    //  this.images = res.result;

    })
  }
  //-----------------------------------------------------------Get Tutorial Method End-----------------------------------------------------

  plusDivs(n) {
    this.showDivs(this.slideIndex += n);
  }
  showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      document.getElementById("mySlides"+i).style.display = "none";
      // document.getElementById("mySlides"+i).style.opacity = "0";
      // document.getElementById("mySlides"+i).style.transition = "visibility 0s 2s, opacity 2s linear";


    }
    //console.log(document.getElementById("mySlides"+(this.slideIndex-1)).offsetHeight);
    // var imgHeight =document.getElementById("mySlides"+(this.slideIndex-1)).offsetHeight;
    // var reduceHight = imgHeight*this.slideIndex-1;
    // console.log(reduceHight);
    // if(this.slideIndex-1>0){
      document.getElementById("mySlides"+(this.slideIndex-1)).style.display = "block";
      //document.getElementById("mySlides"+(this.slideIndex-1)).style.opacity="1";
      //document.getElementById("mySlides"+(this.slideIndex-1)).style.transition="opacity 2s linear";
  //  }
  //  else{
    // document.getElementById("mySlides"+(this.slideIndex-1)).style.marginTop="-reduceHight";
    //document.getElementById("mySlides"+(this.slideIndex-1)).style.visibility = "visible";
    // document.getElementById("mySlides"+(this.slideIndex-1)).style.opacity="1";
    // document.getElementById("mySlides"+(this.slideIndex-1)).style.transition="opacity 2s linear";
//}

  //  document.getElementById("mySlides"+(this.slideIndex-1)).style.display = 'opacity 1s';;
  }

}
