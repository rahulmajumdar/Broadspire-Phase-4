import { Component, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';

import { CommonAPICall } from '../../shared/shared.service';
declare var navigator;
declare var Camera;
declare var cordova: any;
declare var plugins: any;

@Component({
    selector: 'claimInfoMessage',
    templateUrl: 'claimInfoMessage.component.html',
    providers: [CommonAPICall]
})
export class ClaimInfoMessageComponent implements OnInit {

    claimNumber = localStorage.getItem('claim_number');
    pageName = localStorage.getItem('pageName');
    name: string;
    email: string;
    attachmentDescription: string;
    profileImg: string[] = [];
    transperentImg = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    Message_email = localStorage.getItem('userName');

    Message_name:string;
     Message_number:string;
      Message_subject:string;
       inputMessage:string;showCameraButton = false;
    constructor(private element: ElementRef, private _commonApiCall: CommonAPICall, private changeDetectorRef: ChangeDetectorRef) {
if(navigator.userAgent.match(/Android/i)  && typeof cordova !=  'undefined'){
this.showCameraButton = true;
  }
    }

    ngOnInit() {

        if (this.pageName == "Adjuster") {
            this.name = localStorage.getItem('name');
            this.email = localStorage.getItem('email');
        }
        else {
            this.name = localStorage.getItem('superName');
            this.email = localStorage.getItem('superEmail');
        }
        //console.log(navigator.userAgent.match(/Android/i));
    }


    //----------- open camera using cordova plugin  only in android starts------------------------------

      openCameraAndroid() {
        var object = this;
        cordova.plugins.diagnostic.requestCameraAuthorization(function(status) {

          if (cordova.plugins.diagnostic.permissionStatus.GRANTED) {

            navigator.camera.getPicture(function(imageData) {
              object.onSuccess(imageData, object);
            }, object.onFail, {
              quality: 25,
                destinationType: Camera.DestinationType.FILE_URI
              });


          }
          else if (cordova.plugins.diagnostic.permissionStatus.DENIED) {
            console.log("denied");
          }

        }, function(error) {
          console.log(error);
        });
      }

      onSuccess(imageData, obj) {
        // var image1 = obj.element.nativeElement.querySelector('.unknown1');
        // image1.src = imageData;
      var img2 = document.createElement("img");
        img2.src = imageData;
        obj.resize(img2, 250, 250, (resized_jpeg, before, after) => {
          // For debugging (size in bytes before and after)
          //this.debug_size_before.push(before);
          //this.debug_size_after.push(after);
          var image1 = this.element.nativeElement.querySelector('.unknown1');
          console.log(resized_jpeg);
          image1.src = resized_jpeg;
          localStorage.setItem('imgSrc', resized_jpeg);
            localStorage.setItem('imgName', "img_"+new Date());
            console.log(localStorage.getItem('imgSrc'));
            console.log(localStorage.getItem('imgName'));
          // Read the next file;
        //  obj.readFiles(files, index + 1);
        });





      }
      onFail(message) {
        alert('Failed because: ' + message);
      }


      //----------- open camera using cordova plugin  only in android ends------------------------------


    //------------------------------CHANGE PROFILE IMAGE FUNCTION-----------------------------------
    profileImgChange(input) {
      // if(navigator.userAgent.match(/Android/i)){
      //     navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 50,
      //     destinationType: Camera.DestinationType.FILE_URI });
      // }
      // else{
        this.readFiles(input.files);
//}
    }
    //-----------------------------
    readFile(file, reader, callback) {
        reader.onload = () => {
            callback(reader.result);
        }

        reader.readAsDataURL(file);
    }
    //----------------------------------------------
    readFiles(files, index = 0) {
      console.log(files);
        // Create the file reader
        let reader = new FileReader();

        // If there is a file
        if (index in files) {
            // Start reading this file
            //console.log(files[0].name);
            this.readFile(files[index], reader, (result) => {
                // Create an img element and add the image file data to it
                console.log(files[index].name);
                localStorage.setItem('imgName', files[index].name);
                var img = document.createElement("img");
                img.src = result;

                // Send this img to the resize function (and wait for callback)
                this.resize(img, 250, 250, (resized_jpeg, before, after) => {
                    // For debugging (size in bytes before and after)
                    //this.debug_size_before.push(before);
                    //this.debug_size_after.push(after);
                    var image1 = this.element.nativeElement.querySelector('.unknown1');
                    image1.src = resized_jpeg;
                    localStorage.setItem('imgSrc', resized_jpeg);
                    //console.log(before+" ,"+after);
                    // Add the resized jpeg img source to a list for preview
                    // This is also the file you want to upload. (either as a
                    // base64 string or img.src = resized_jpeg if you prefer a file).
                    //this.file_srcs.push(resized_jpeg);

                    // Read the next file;
                    this.readFiles(files, index + 1);
                });
            });
        } else {
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
        if (imgSrc == '' || imgSrc == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Image is required", "Message");
        }
        else if (this.attachmentDescription == '' || this.attachmentDescription == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Attachment description required", "Message");
        }
        else {
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

            console.log("Profile Image length :" + this.profileImg.length);

            //------CONDITION FOR ATTACHING FIRST PREVIEW AND SECOND PREVIEW IMAGES------------------

            if (this.profileImg.length <= 2 && (img11.src == this.transperentImg || img11.src == '')) {
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
                localStorage.setItem('imgSrc', '');
                localStorage.setItem('imgName', '');
                this.attachmentDescription = "";
                console.log("Profile Image length:" + this.profileImg.length);
                inputFileName.value = '';
            }
            else if (this.profileImg.length <= 2 && (img12.src == this.transperentImg || img12.src == '')) {
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
                localStorage.setItem('imgSrc', '');
                localStorage.setItem('imgName', '');
                this.attachmentDescription = "";
                console.log("Profile Image length:" + this.profileImg.length);
                inputFileName.value = '';
            }
            else {
                this._commonApiCall.hideLoaderShowPopup("You can not attach more than 2 images", "Message");
            }
        }
    }
    //--------------------------------------UPLOAD DOC SAVE END----------------------------------------

    deletePreview1(img1) {

        // var index = this.profileImg.indexOf(img1.src);
        // console.log("deletedIndex1 :" + index);
        this.profileImg.splice(0, 1);
        img1.src = this.transperentImg;
        console.log("Profile Image length" + this.profileImg.length);
        var listpreview1 = this.element.nativeElement.querySelector('.listpreview1');
        var deleteImage1 = this.element.nativeElement.querySelector('.deleteImage1');
        listpreview1.style.display = 'none';
    }
    deletePreview2(img2) {

        //var index = this.profileImg.indexOf(img2.src);
        //console.log("deletedIndex2 :" + index);
        this.profileImg.splice(1, 1);
        img2.src = this.transperentImg;
        console.log("Profile Image length :" + this.profileImg.length);
        var listpreview2 = this.element.nativeElement.querySelector('.listpreview2');
        var deleteImage2 = this.element.nativeElement.querySelector('.deleteImage2');
        listpreview2.style.display = 'none';
    }
    //--------------------------------FINAL UPLOAD PHOTO AND DATA METHOD------------------------
    sendMessageData() {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var token = localStorage.getItem('token');

        if (this.Message_name == '' ||this. Message_name == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Name is required", "Message");
        }
        else if (this.Message_email == '' || this.Message_email == undefined || !re.test(this.Message_email)) {
            this._commonApiCall.hideLoaderShowPopup("Enter a valid email ( abc@example.com )", "Message");
        }
        else if (this.Message_number == '' || this.Message_number == undefined || this.Message_number.toString().length < 10) {
            this._commonApiCall.hideLoaderShowPopup("Contact Number should be of 10 digit", "Message");
        }
        else if (this.Message_subject == '' || this.Message_subject == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Message Subject is required", "Message");
        }
        else if (this.inputMessage == '' ||this. inputMessage == undefined) {
            this._commonApiCall.hideLoaderShowPopup("Message is required", "Message");
        }
        else if (this.email== '' || this.email == undefined || !re.test(this.email)) {
            this._commonApiCall.hideLoaderShowPopup("Enter a valid email ( abc@example.com )", "Message");
        }
        else {
          if(this.profileImg.length === 0){
            var attachmentsName = "",attachmentsCateg="",attachmentsSrc="",attachmentsDisc="";
            var attachmentsName1 = "",attachmentsCateg1="",attachmentsSrc1="",attachmentsDisc1="";
          }
          else if(this.profileImg.length === 1){
            console.log(this.profileImg.length);
            attachmentsName =JSON.parse(this.profileImg[0]).name;
            attachmentsCateg =JSON.parse(this.profileImg[0]).categorie;
            attachmentsSrc =JSON.parse(this.profileImg[0]).src.replace("data:image/jpeg;base64,", '');
            attachmentsDisc=JSON.parse(this.profileImg[0]).attachmentDescription;
            attachmentsName1 = "",attachmentsCateg1="",attachmentsSrc1="",attachmentsDisc1="";
          }
          else{
            attachmentsName =JSON.parse(this.profileImg[0]).name;
            attachmentsCateg =JSON.parse(this.profileImg[0]).categorie;
            attachmentsSrc =JSON.parse(this.profileImg[0]).src.replace("data:image/jpeg;base64,", '');
            attachmentsDisc=JSON.parse(this.profileImg[0]).attachmentDescription;

            attachmentsName1 =JSON.parse(this.profileImg[1]).name;
            attachmentsCateg1=JSON.parse(this.profileImg[1]).categorie;
            attachmentsSrc1 =JSON.parse(this.profileImg[1]).src.replace("data:image/jpeg;base64,", '');
            attachmentsDisc1=JSON.parse(this.profileImg[1]).attachmentDescription;
          }
            var data =
                {
                    "email_Method": "Smart",
                    "to_email_address": this.email,
                    "from_email_address": this.Message_email + ' <' + this.Message_email + '>',
                    "subject_Text": this.Message_subject + ' Broadspire IQ Claim #: ' + this.claimNumber,
                    "body_Text":this. inputMessage + '<br/>' + '<br/>' + '<b>' + ' Contact Phone Number: ' + '</b>' + this.Message_number + '<br/>',
                    "claim_Id": localStorage.getItem("claimId"),
                    "attachments": [
                        {
                            "attachmentName": attachmentsName,
                            "attachmentCategory": attachmentsCateg,
                            "attachmentContent": attachmentsSrc,
                            "attachmentDescription": attachmentsDisc
                        },
                        {
                            "attachmentName": attachmentsName1,
                            "attachmentCategory": attachmentsCateg1,
                            "attachmentContent": attachmentsSrc1,
                            "attachmentDescription": attachmentsDisc1
                        }
                    ]
                }
                  console.log(attachmentsSrc);
            this._commonApiCall.postService("emails", "Bearer " + token, "application/json", data)
                .subscribe(res => {
                    this._commonApiCall.hideLoaderShowPopup(res.result.email_status, "Message");
                    this.Message_name = "", this.Message_number = "", this.Message_subject = "", this.inputMessage = "";
                    //console.log(res);
                },
                error => {
                    this._commonApiCall.handleError(error, "Message");
                })
        }
    }
//-----------------------------------------------Reset Information Method-------------------------------------------------
clearClaimInfoData(img1,img2,imgPhoto){
  var inputFileName = this.element.nativeElement.querySelector('.inputFileName');
  var listpreview1 = this.element.nativeElement.querySelector('.listpreview1');
  var listpreview2 = this.element.nativeElement.querySelector('.listpreview2');

  this.profileImg=[],img1.src=this.transperentImg,img2.src=this.transperentImg,inputFileName.value='',
  this.selectedItem = this.categories[0],imgPhoto.src='',this.attachmentDescription="";
  listpreview1.style.display="none";
  listpreview2.style.display="none";

}
//-----------------------------------------------Reset Information Method-------------------------------------------------

    resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
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

            ctx.drawImage(img, 0, 0, width, height);

            // Get this encoded as a jpeg
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL('image/jpeg');

            // callback with the results
            callback(dataUrl, img.src.length, dataUrl.length);
        };
    }
// onSuccess(imageURI){
//   var main_image_view = this.element.nativeElement.querySelector('.unknown1');
//   main_image_view.src=imageURI;
// }
// onFail(message){
//   alert('Failed because: ' + message);
// }
}
