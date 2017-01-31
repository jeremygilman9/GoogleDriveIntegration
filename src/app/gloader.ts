
import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import * as FileSaver from 'file-saver';
import { Http, ResponseContentType } from '@angular/http';


const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const apiKey = 'AIzaSyAHCWQHaQjajwP83Myql1IbeXfnR49zJLo';
const clientId = '846160280996-pm27f34v86audcj728vi7si8tqs22lcg.apps.googleusercontent.com';
var isLoggedIn: boolean;
var oAuthToken: any;

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
      oAuthToken = this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;      
      console.log('Just Signed In, OAuth Token: ');//, oAuthToken);
    }
    else {
      isLoggedIn = false;
      console.log('Just Logged Out');
    }
  }

  handleSignIn(){
    this.gapi.auth2.getAuthInstance().signIn();
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
      'pageToken': page,
      'fields': 'files(id, name, webContentLink, webViewLink)'
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
    console.log("Attempting TO Download: ", file.name);
    var request = this.gapi.client.drive.files.get({
      fileId: file.id,
      alt: 'media'
    });
    var resp2 = request.execute(resp => {
      console.log('REsponse: ', resp);
    });
    console.log('Resp2: ', resp2);

    console.log('Request: ', request);
    return request.then(function(resp){
      console.log('Response: ', resp);
      var blob: Blob = new Blob([resp.body], {type: resp.headers['Content-Type']});
      FileSaver.saveAs(blob, 'temp');
      return blob;
    });

    // map(resp => {
    //    console.log("Finished Downloading File", resp);
    //    var blob = new Blob([resp.blob()], {type: resp.headers['Content-Type']});
    //   console.log("Finished Creating Blob");      
    //    return blob; // may want to return the blob instead here
    //  });
  }

  getFileFromUrl(file: any) : any {
    // var req2 = this.gapi.client.request({
    //   'path': '',
    //   'headers': '',
    //   'method': 'GET'
    // });
    var request = this.http.get("https://www.googleapis.com/drive/v3/files/"+file.id+'?alt=media', { responseType: ResponseContentType.Blob })
    .map(data => data.json())
    .subscribe((response) => {
      console.log('Val: ', response);
      var blob = new Blob([response.blob()], {type: file.type});
      console.log('Blob is: ', blob);
      return blob;
    });
    console.log('Request: ',request);
    
  }

  // gapi.client.request({
  //       'path': '/upload/drive/v2/files/'+folderId+"?fileId="+fileId+"&uploadType=multipart",
  //       'method': 'PUT',
  //       'params': {'fileId': fileId, 'uploadType': 'multipart'},
  //       'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
  //       'body': multipartRequestBody,
  //       callback:callback,
  //   });
}

