import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
//import { FormsModule }   from '@angular/forms';


// for doing HTTP calls
import { HttpModule } from '@angular/http';

import { LandingComponent } from './landing/landing.component';
import { AppComponent } from './app/app.component';
import { HelpComponent } from './help/help.component';
import { SharedModule } from './shared.module';
import { DocumentSaverComponent } from './document-saver/document-saver.component';
import { DocumentPageComponent } from './document-page/document-page.component';
import { GoogleDocumentPickerComponent } from './google-document-picker/google-document-picker.component';
import { GoogleTranslatePageComponent } from './google-translate-page/google-translate-page.component';

@NgModule({
    imports: [BrowserModule,
        AppRoutingModule,
        HttpModule,
        SharedModule,
        ],
    declarations: [
    LandingComponent,
    AppComponent,
    HelpComponent,
    DocumentSaverComponent,
    DocumentPageComponent,
    GoogleDocumentPickerComponent,
    GoogleTranslatePageComponent
],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(router: Router) {
        console.log('Route Data for Solution: ', router.config);
  }
 }






