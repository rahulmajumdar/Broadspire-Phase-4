import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';

import { CommonAPICall } from '../../shared/shared.service';
@Component({
    selector: 'emailSupervisor',
    templateUrl: 'emailSupervisor.component.html',
    providers: [CommonAPICall]
})
export class EmailSupervisorComponent {

  claimNumber = localStorage.getItem('claim_number');
  superName = localStorage.getItem('superName');
  superEmail = localStorage.getItem('superEmail');
    attachmentDescription: string;
    profileImg: string[] = [];
    Message_email = localStorage.getItem('userName');
    constructor(private element: ElementRef, private _commonApiCall: CommonAPICall, private changeDetectorRef: ChangeDetectorRef) {
    }
    //------------------------------CHANGE PROFILE IMAGE FUNCTION-----------------------------------
    profileImgChange(input) {
      this.readFiles(input.files);
      }
      //-----------------------------
      readFile(file, reader, callback){
  reader.onload = () => {
    callback(reader.result);
  }

  reader.readAsDataURL(file);
}
//----------------------------------------------
readFiles(files, index=0){
  // Create the file reader
  let reader = new FileReader();

  // If there is a file
  if(index in files){
    // Start reading this file
    //console.log(files[0].name);
    this.readFile(files[index], reader, (result) =>{
      // Create an img element and add the image file data to it
      console.log(files[index].name);
      localStorage.setItem('imgName',files[index].name);
      var img = document.createElement("img");
      img.src = result;

      // Send this img to the resize function (and wait for callback)
      this.resize(img, 250, 250, (resized_jpeg, before, after)=>{
        // For debugging (size in bytes before and after)
        //this.debug_size_before.push(before);
        //this.debug_size_after.push(after);
        var image1 = this.element.nativeElement.querySelector('.unknown1');
        image1.src = resized_jpeg;
        localStorage.setItem('imgSrc',resized_jpeg);
        console.log(before+" ,"+after);
        // Add the resized jpeg img source to a list for preview
        // This is also the file you want to upload. (either as a
        // base64 string or img.src = resized_jpeg if you prefer a file).
        //this.file_srcs.push(resized_jpeg);

        // Read the next file;
        this.readFiles(files, index+1);
      });
    });
  }else{
    // When all files are done This forces a change detection
    this.changeDetectorRef.detectChanges();
  }
//----------------------------------------------------


    }
    //------------------------------CHANGE PROFILE IMAGE FUNCTION END-----------------------------------
    categories = ['Mileage Reimbursement', 'Prescription Reimbursement', 'Other'];
    selectedItem = this.categories[0];
    i: number;
    dropboxitemselected(i) {
        this.selectedItem = this.categories[i];

    }
    //--------------------------------------UPLOAD DOC SAVE START----------------------------------------
    uploadDocSave(img11, img12, imgPhoto) {
      var imgSrc = localStorage.getItem('imgSrc');
      var imgName = localStorage.getItem('imgName');
      if(this.attachmentDescription == '' || this.attachmentDescription == undefined){
        this._commonApiCall.hideLoaderShowPopup("Attachment Description Required","Message");
      }
      else if(imgSrc == '' || imgSrc == undefined){
        this._commonApiCall.hideLoaderShowPopup("Image is Required","Message");
      }

      else{
        var imgObj = {
            src: imgSrc, name: imgName, categorie: this.selectedItem,
            attachmentDescription: this.attachmentDescription
        }
        localStorage.setItem('attachedDetails', JSON.stringify(imgObj));

    //----------------------ALL IMAGE VIEW REFERENCE------------------------------------
        var inputFileName = this.element.nativeElement.querySelector('.inputFileName');
        var listpreview1 = this.element.nativeElement.querySelector('.listpreview1');
        var listpreview2 = this.element.nativeElement.querySelector('.listpreview2');
        var imagepreview1 = this.element.nativeElement.querySelector('.imagepreview1');
        var imagepreview2 = this.element.nativeElement.querySelector('.imagepreview2');

        console.log("Profile Image length :"+this.profileImg.length);

        //------CONDITION FOR ATTACHING FIRST PREVIEW AND SECOND PREVIEW IMAGES------------------
        //console.log("hi :"+img11.src);
        if (this.profileImg.length <= 2 && img11.src === '' || img11.src === "http://localhost:4200/") {
            //console.log(JSON.parse(localStorage.getItem('attachedDetails')).src);
            imagepreview1.src = JSON.parse(localStorage.getItem('attachedDetails')).src;
            this.profileImg.push(localStorage.getItem('attachedDetails'));
            listpreview1.style.display = 'block';
            //var canvas = this.element.nativeElement.querySelector('.capturedPhotoSpeakerPhotoEdit');
            var main_image_view = this.element.nativeElement.querySelector('.unknown1');
            imgPhoto.src = '';
            //image1.style.display = 'none';
            //canvasPhoto.src = '';
            //canvas.style.display = 'none';
            localStorage.setItem('imgSrc','');
            localStorage.setItem('imgName','');
            this.attachmentDescription="";
            console.log("Profile Image length:"+this.profileImg.length);
            inputFileName.value ='';
        }

        else if (this.profileImg.length <= 2 && img12.src === '' || img12.src === "http://localhost:4200/") {
            imagepreview2.src = JSON.parse(localStorage.getItem('attachedDetails')).src;
            console.log(JSON.parse(localStorage.getItem('attachedDetails')).name);
            this.profileImg.push(localStorage.getItem('attachedDetails'));

            listpreview2.style.display = 'block';

            //var canvas = this.element.nativeElement.querySelector('.capturedPhotoSpeakerPhotoEdit');
            var main_image_view = this.element.nativeElement.querySelector('.unknown1');
            imgPhoto.src = '';
            //image1.style.display = 'none';
            //canvasPhoto.src = '';
            //canvas.style.display = 'none';
            localStorage.setItem('imgSrc','');
            localStorage.setItem('imgName','');
            this.attachmentDescription="";
            console.log("Profile Image length:"+this.profileImg.length);
            inputFileName.value ='';
        }
        else {
            this._commonApiCall.hideLoaderShowPopup("You can not upload more than 2 images","Message");
        }
      }
    }
    //--------------------------------------UPLOAD DOC SAVE END----------------------------------------

    deletePreview1(img1) {

        var index = this.profileImg.indexOf(img1.src);
        console.log("deletedIndex1 :"+index);
        this.profileImg.splice(index, 1);
        img1.src = "";
        console.log("Profile Image length"+this.profileImg.length);
        var listpreview1 = this.element.nativeElement.querySelector('.listpreview1');
        var deleteImage1 = this.element.nativeElement.querySelector('.deleteImage1');
        listpreview1.style.display = 'none';
    }
    deletePreview2(img2) {

        var index = this.profileImg.indexOf(img2.src);
        console.log("deletedIndex2 :"+index);
        this.profileImg.splice(index, 1);
        img2.src = "";
        console.log("Profile Image length :"+this.profileImg.length);
        var listpreview2 = this.element.nativeElement.querySelector('.listpreview2');
        var deleteImage2 = this.element.nativeElement.querySelector('.deleteImage2');
        listpreview2.style.display = 'none';
    }
    //--------------------------------FINAL UPLOAD PHOTO AND DATA METHOD------------------------
    sendMessageData(Message_name, Message_email, Message_subject,
        Message_number, inputMessage, categ, claimNumber) {
        var token = localStorage.getItem('token');

        if (Message_name == '' || Message_name == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Name is Required","Message");
        }
        else if (Message_email == '' || Message_email == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Email is Required","Message");
        }
        else if (Message_number == '' || Message_number == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Contact Number is Required","Message");
        }
        else if (Message_subject == '' || Message_subject == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Message Subject is Required","Message");
        }
        else if (inputMessage == '' || inputMessage == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Message is Required","Message");
        }
        else if (this.profileImg[0] == '' || this.profileImg[0] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Enter First Profile Information and click save button","Message");
        }
        else if (this.profileImg[1] == '' || this.profileImg[1] == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Enter Second Profile Information and click save button","Message");

        }
        else if (localStorage.getItem("claimId") == '' || localStorage.getItem("claimId") == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Claim Id is Required","Message");
        }
        else {
            var data =
                {
                    "email_Method": "Smart",
                    "to_email_address": "rmazumdar@primussoft.com",
                    "from_email_address": Message_email + ' <' + Message_email + '>',
                    "subject_Text": Message_subject + ' Broadspire IQ Claim #: ' + claimNumber,
                    "body_Text": inputMessage + '<br/>' + '<br/>' + '<b>' + ' Contact Phone Number: ' + '</b>' + Message_number + '<br/>',
                    "claim_Id": localStorage.getItem("claimId"),
                    "attachments": [
                        {
                            "attachmentName": JSON.parse(this.profileImg[0]).name,
                            "attachmentCategory": JSON.parse(this.profileImg[0]).categorie,
                            "attachmentContent": JSON.parse(this.profileImg[0]).src.replace("data:image/png;base64,", ''),
                            "attachmentDescription": JSON.parse(this.profileImg[0]).attachmentDescription
                        },
                        {
                            "attachmentName": JSON.parse(this.profileImg[1]).name,
                            "attachmentCategory": JSON.parse(this.profileImg[1]).categorie,
                            "attachmentContent": JSON.parse(this.profileImg[1]).src.replace("data:image/png;base64,", ''),
                            "attachmentDescription": JSON.parse(this.profileImg[1]).attachmentDescription
                        }
                    ]
                }
                console.log('token:::'+token);
            this._commonApiCall.postService("emails", "Bearer " + token, "application/json", data)
                .subscribe(res => {
                  this._commonApiCall.hideLoaderShowPopup(res.email_status,"Message");
                  Message_name ="",Message_email ="",Message_number ="",Message_subject ="",inputMessage ="";
                    //console.log(res);
                },
              error =>{
                this._commonApiCall.handleError(error, "Message");
              })
        }
    }


    resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, callback){
      // This will wait until the img is loaded before calling this function
      return img.onload = () => {

        // Get the images current width and height
        var width = img.width;
        var height = img.height;

        // Set the WxH to fit the Max values (but maintain proportions)
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        // create a canvas object
        var canvas = document.createElement("canvas");

        // Set the canvas to the new calculated dimensions
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0,  width, height);

        // Get this encoded as a jpeg
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg');

        // callback with the results
        callback(dataUrl, img.src.length, dataUrl.length);
      };
    }

}
