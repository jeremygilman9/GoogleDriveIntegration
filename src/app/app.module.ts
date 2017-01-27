import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

// for doing HTTP calls
import { HttpModule } from '@angular/http';

import { LandingComponent } from './landing/landing.component';
import { AppComponent } from './app/app.component';
import { HelpComponent } from './help/help.component';
import { SharedModule } from './shared.module';
import { DocumentSaverComponent } from './document-saver/document-saver.component';
import { DocumentPageComponent } from './document-page/document-page.component';
import { GoogleDocumentPickerComponent } from './google-document-picker/google-document-picker.component';

@NgModule({
    imports: [BrowserModule,
        AppRoutingModule,
        HttpModule,
        SharedModule],
    declarations: [
    LandingComponent,
    AppComponent,
    HelpComponent,
    DocumentSaverComponent,
    DocumentPageComponent,
    GoogleDocumentPickerComponent
],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(router: Router) {
        console.log('Route Data for Solution: ', router.config);
  }
 }






