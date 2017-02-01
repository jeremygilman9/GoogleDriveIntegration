
import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import * as FileSaver from 'file-saver';
//import * as Translate from 'google-translate';
//import Stream from 'ts-stream';
//var Stream = require("ts-stream");//.Stream;
import { Http, ResponseContentType, Headers } from '@angular/http';



const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const apiKey = 'AIzaSyAHCWQHaQjajwP83Myql1IbeXfnR49zJLo';
const clientId = '846160280996-pm27f34v86audcj728vi7si8tqs22lcg.apps.googleusercontent.com';
var isLoggedIn: boolean;
var oAuthToken: any;
const ProjectId = 'canvas-cursor-157300';
// const translateClient = Translate({
//       projectId: ProjectId,
//       key: apiKey
//     });

@Component({
  providers: [Http] 
})
export class GoogleAPI {
  loadAPI: Promise<any>;
  gapi: any;
  loggedIn: boolean;
  google:any;
  http: Http;

  constructor(http: Http) {
    console.log('inside the GoogleAPI Constructor');
    this.loadAPI = new Promise((resolve) => {
      window['__onGoogleLoaded'] = (ev) => {
        console.log('gapi loaded');
        resolve(window['gapi']);
      }
      this.loadScript();
    });
    this.http = http;
  }
  loadScript() {
    console.log('loading..')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  getGapi(): any {
    return this.loadAPI.then((gapi) => {
      this.authorize(gapi);
      this.gapi = gapi;
      return gapi;
    });
  }

  authorize(gapi: any) {
    var gLoaderRef = this;
    gapi.load('client:auth2', function () {
      console.log('Loaded auth2 module for gapi');
      gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/drive'
      }).then(function() {
        console.log('Loaded OAuth2 Successfully', gapi.auth2.getAuthInstance());
        
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(gLoaderRef.updateSigninStatus);

        // Handle the initial sign-in state.
        gLoaderRef.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  updateSigninStatus (isSignedIn) {
    if (isSignedIn) {
      isLoggedIn = true;    
      console.log('Just Signed In');
    }
    else {
      isLoggedIn = false;
      console.log('Just Logged Out');
    }
  }

  handleSignIn(){
    this.gapi.auth2.getAuthInstance().signIn().then(() =>{
      oAuthToken = this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
      console.log('Just Signed In, OAuth Token2: ', oAuthToken);
    });
  }
  
  handleSignOut(){
    this.gapi.auth2.getAuthInstance().signOut();
  }

  loadPickerApi() {
    var gapi = this.gapi;
    var gLoaderRef = this;
    gLoaderRef.gapi.load('picker', {'callback':gLoaderRef.onPickerApiLoaded(gapi)});
  }

  onPickerApiLoaded(gapi: any) {
    console.log('Picker Api Loaded - Inside Callback', gapi);
    //var picker = new google.picker.PickerBuilder();
    //console.log('Picker Is: ', picker);
  }

  getDriveFiles(page: string = '') : any {
    if (!this.checkIsLoggedIn()) {return new Array<Object>();}
    return this.gapi.client.drive.files.list({
      'pageSize': 10,
      'pageToken': page
    }).then(function (response) {
      console.log('Fulle Response from Files: ', response);
      var files = response.result.files;
      console.log('Files: ', files);
      return response.result;
    });
  }

  checkIsLoggedIn()  : boolean {
    console.log('isLoggedIn is: ', isLoggedIn);
    if (isLoggedIn)
      return true;
    else
      return false;
  }

  createPicker() : any {
     return  new this.gapi.picker.PickerBuilder().
              addView(this.gapi.picker.ViewId.PHOTOS).
              setOAuthToken(this.gapi.auth2.getAuthInstance.authToken).
              setDeveloperKey(apiKey).
              setCallback(console.log('Callback for the picker')).
              build().
              setVisible(true);
  }

  getFile(file) : any {
    console.log("Attempting TO Download: ", file);
    var request = this.gapi.client.drive.files.get({
      fileId: file.id,
      alt: 'media'
    });
    if (file.mimeType == "application/vnd.google-apps.document")
    {
      request = this.gapi.client.drive.files.export({
      fileId: file.id,
      mimeType: 'text/plain'
    });
    }
    return request.then(function(resp){
      console.log('Response: ', resp);
      //var stream = Stream.createReadStream(resp.body);
      //  st.from(resp.body).result().then(data => {
      //    console.log("The Data is: ", data);        
      //    var file2: File = new File([resp.body], 'Temp1');
      //    console.log("File2 FRom Read Stream: ", file2);
      //  });
      var file: File = new File([resp.body], 'Temp1');
      var blob: Blob = new Blob([resp.body], {type: resp.headers['Content-Type']});
      return blob;
    });
  }

  getFileFromUrl(file: any) : any {
    
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', `Bearer ${oAuthToken}`);
    console.log('HEaders: ', headers);
    var request = this.http.get("https://www.googleapis.com/drive/v3/files/"+file.id+'?alt=media', { responseType: ResponseContentType.Blob, headers: headers })
    .map(data => data.json())
    .subscribe((response) => {
      console.log('Val: ', response);
      var blob = new Blob([response.blob()], {type: 'application/pdf'});
      console.log('Blob is: ', blob);
      return blob;
    });
    console.log('Request: ',request);
    
  }


//* TRANSLATE SECTION */
// translate(textIn: string, langTo: any, langFrom: any) : any {
//   return translateClient.translate(textIn, langTo.shortName)
//     .then((results) => {
//       var translation = results[0];
//       return translation;
//     });
// }
}

