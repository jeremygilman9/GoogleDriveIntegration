import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent }   from './landing/landing.component';
import { DocumentPageComponent } from './document-page/document-page.component';
import { HelpComponent } from './help/help.component';
import { GoogleTranslatePageComponent } from './google-translate-page/google-translate-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full', data: {Title: 'Home'} },
  { path: 'home',  component: LandingComponent, data: {Title: 'Home'} },
  { path: 'documents',  component: DocumentPageComponent, data: {Title: 'Documents'} },
  { path: 'translate', component: GoogleTranslatePageComponent, data: {Title: 'Translate'}},
  { path: 'help',  component: HelpComponent, data: {Title: 'Help'} }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {

}

