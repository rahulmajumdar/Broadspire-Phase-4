import { Component, OnInit } from '@angular/core';


import { CommonAPICall } from '../../shared/shared.service';



@Component({
  selector: 'faq-page',
  templateUrl: './faq.html',
  providers: [CommonAPICall]
})

export class FaqComponent implements OnInit {
  faqs = "";
  constructor(private _commonAPICall: CommonAPICall) { }

  ngOnInit() {
    this.getFAQService();
  }

  getFAQService() {
    //call to get faq
    this._commonAPICall.getService("users/faqs2", "", "application/json")
      .subscribe(response => {
        this.faqs = response.result.faqs;
      },
      error => {
        this._commonAPICall.handleError(error, "FAQ");
      })

  }

}
