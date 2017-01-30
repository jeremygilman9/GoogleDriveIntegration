import { Component, OnInit } from '@angular/core';
import { GoogleAPI } from '../gloader';

@Component({
  selector: 'google-document-picker',
  templateUrl: './app/google-document-picker/google-document-picker.component.html',
  styleUrls: ['./app/google-document-picker/google-document-picker.component.scss'],
  providers: [GoogleAPI]
})
export class GoogleDocumentPickerComponent implements OnInit {
  gapi: any;
  google: any;

  constructor(google: GoogleAPI) {
    this.google = google;
  }

  ngOnInit() {
    this.google.getGapi().then(value => {
      this.gapi = value;
      console.log('(GoogleDocumentPickerComponent) GAPI is: ', this.gapi);
    });
  }

  initClient() { }

  googleLogin(event){
    this.google.handleSignIn();
  }

  googleLogout(event){
    this.google.handleSignOut();
  }

  loadPicker(){
    console.log('Clicked the picker button');
    var picker = this.google.loadPickerApi();
  }
}
