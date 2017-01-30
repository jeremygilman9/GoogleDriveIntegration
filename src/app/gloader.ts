const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const apiKey = 'AIzaSyBGXV555MnPGV-5yPYtOionURsMDOUIxkk';
const clientId = '960608004235-i2gdd1ais91bd5tb26p20gr6t95oo450.apps.googleusercontent.com';


export class GoogleAPI {
  loadAPI: Promise<any>;
  gapi: any;
  loggedIn: boolean;
  constructor() {
    console.log('inside the GoogleAPI Constructor');
    this.loadAPI = new Promise((resolve) => {
      window['__onGoogleLoaded'] = (ev) => {
        console.log('gapi loaded');
        resolve(window['gapi']);
      }
      this.loadScript();
    });
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
      console.log('Signed In');
    }
    else {
      console.log('Logged Out');
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
    console.log('Inside the loadPickerApi() function: ', gapi);
    gLoaderRef.gapi.load('picker', {'callback':gLoaderRef.onPickerApiLoaded(gapi)});
  }

  onPickerApiLoaded(gapi: any) {
    console.log('Picker Api Loaded', gapi.client);
    //var picker = new gapi.client.picker.PickerBuilder();
    //console.log('Picker Is: ', picker);
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
}

