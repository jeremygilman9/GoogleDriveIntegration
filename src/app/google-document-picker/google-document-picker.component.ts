import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  files: any[];
  changeRef: any;

  constructor(google: GoogleAPI, ref: ChangeDetectorRef) {
    this.google = google;
    this.changeRef = ref;
  }

  ngOnInit() {
    this.google.getGapi().then(value => {
      this.gapi = value;
      console.log('(GoogleDocumentPickerComponent) GAPI is: ', this.gapi);
    });
  }

  initClient() { }

  googleLogin(event) {
    this.google.handleSignIn();
  }

  googleLogout(event) {
    this.google.handleSignOut();
  }

  loadPicker() {
    console.log('Clicked the picker button');
    var picker = this.google.loadPickerApi();
  }

  getFiles() {
    console.log("Getting the requested Files...");
    //this.files = Array<any>();
    this.google.getDriveFiles().then(values => {
      this.files = values;
      console.log('Files in Picker Component: ', this.files);
      // manually manage the change detection until more can be read about observables and promises
      this.changeRef.detectChanges();
    });    
  }
  addFile(){
    this.files.push({'name':'Happy'});
  }

  clearFiles() {
    this.files = null;
  }
}
