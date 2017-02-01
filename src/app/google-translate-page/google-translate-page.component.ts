import { Component, OnInit } from '@angular/core';
import { GoogleAPI } from '../gloader';

@Component({
  selector: 'app-google-translate-page',
  templateUrl: './app/google-translate-page/google-translate-page.component.html',
  styleUrls: ['./app/google-translate-page/google-translate-page.component.scss'],
  providers: [GoogleAPI]
})
export class GoogleTranslatePageComponent implements OnInit {

  lang: {id: string, shortName: string, fullName: string};
  langFromList: any;
  langToList: any;
  translations: any;
  textIn: any;
  textOut: any;
  google: any;
  langTo: any;
  langFrom: any;

  constructor(google: GoogleAPI) {
    this.google = google;
   }

  ngOnInit() {
    this.langFromList = this.langToList = this.translations = new Array<any>();
    this.addToList(this.langFromList);
    this.addToList(this.langToList);
  }

  addToList(list) {
    list.push({id: '1', shortName: 'en', fullName: 'English'});
    list.push({id: '2', shortName: 'es', fullName: 'Spanish'});
    list.push({id: '3', shortName: 'fr', fullName: 'French'});
    list.push({id: '4', shortName: 'de', fullName: 'German'});
    list.push({id: '5', shortName: 'ru', fullName: 'Russian'});
  }

  translate() {
    var req = this.google.translate(this.textIn, this.langTo)
      .then(result => {
        console.log("Result in Translate Page Then: ", result);
      });
      console.log('Request after going to google service: ', req);
  }

  onLangToChange(value){
    this.langTo = value;
    console.log("Lang To Change: ", this.langTo);
  }

  onLangFromChange(value){
    this.langFrom = value;
    console.log("Lang From Change: ", this.langFrom);
  }

}