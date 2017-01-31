import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAPI } from '../gloader';
import * as FileSaver from 'file-saver';
import {  } from '@angular/http';

var pages: string[];
var currentPage: number;

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
  compRef = this;
  file: any;
  image: any;
  totalPages: number;
  currentPage: number;

  constructor(google: GoogleAPI, ref: ChangeDetectorRef) {
    this.google = google;
    this.changeRef = ref;
    pages = new Array<string>(undefined);
    this.currentPage = currentPage = 0;
    this.totalPages = pages.length;
  }

  ngOnInit() {
    this.google.getGapi().then(value => {
      this.gapi = value;
      console.log('(GoogleDocumentPickerComponent) GAPI is: ', this.gapi);
    });
    setTimeout(() => this.getFiles(), 2000);
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

  getFiles(page: string = '') {
    if (this.google.checkIsLoggedIn()) {
      console.log('Getting the requested Files...');
      this.google.getDriveFiles(page).then(value => {
        this.files = value.files;
        var found = false;
        pages.forEach(p => {
            if (p == value.nextPageToken)
            found = true;
        });
        if (!found)
          pages.push(value.nextPageToken);
        console.log('Files in Picker Component: ', this.files);
        this.totalPages = pages.length;
        this.currentPage = currentPage;
        console.log('Pages :', pages);
        // manually manage the change detection until more can be read about observables and promises
        this.changeRef.detectChanges();
      });
    }
  }
  addFile() {
    this.files.push({ 'name': 'Happy' });
  }

  clearFiles() {
    this.files = null;
  }

  fileClick(fileToView) {
    console.log('File to View: ', fileToView.name);
    this.google.getFile(fileToView).then(value => {
      console.log("Value is: ", value);
      var url = window.URL.createObjectURL(value);
      window.open(url);
      console.log('Opened Window');
      // manually manage the change detection until more can be read about observables and promises
      this.changeRef.detectChanges();
    });
  }

  fileDownload(fileToDownload){
    console.log('File To Download: ', fileToDownload.name);
    this.google.getFileFromUrl(fileToDownload).then(value => {
      console.log("Blob is: ", value);

      var file2 = new File([value], fileToDownload.name, {type: value.type});
      console.log('File is: ', file2);
      //FileSaver.saveAs(value, fileToDownload.name);
      FileSaver.saveAs(file2);
      console.log('saved blob');
      // manually manage the change detection until more can be read about observables and promises
      this.changeRef.detectChanges();
    });
  }

  pagePrevious() {
    if (currentPage > 0){
      currentPage--;
      this.getFiles(pages[currentPage]);
    }
  }

  pageNext() {
    console.log('CurrentPage: ', currentPage);
    console.log('Pages length: ', pages);
    if (currentPage < pages.length - 1) {
      currentPage++;
    console.log('CurrentPage After Going Next: ', currentPage);
      console.log('This page will be loaded: ', pages[currentPage]);
      this.getFiles(pages[currentPage]);
    }
  }
}
