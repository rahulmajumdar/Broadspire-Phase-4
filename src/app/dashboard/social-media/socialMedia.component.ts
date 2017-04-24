import { Component } from '@angular/core';

@Component({
  selector:'socal_media',
  templateUrl:'socialMedia.component.html'
})
export class SocialMediaComponent{
  linkedIn(){
    window.open("https://www.linkedin.com/company/broadspire","_blank");
  }
  facbook(){
    window.open("https://www.facebook.com/choosebroadspire","_blank");
  }
  twitter(){
    window.open('https://twitter.com/Broadspire1',"_blank");
  }
}
