import { Component, OnInit } from '@angular/core';
//import { TimeEntryListComponent } from '../TimeEntryList/TimeEntryList.component';

@Component({
  selector: 'app-landing',
  templateUrl: './app/landing/landing.component.html',
  styleUrls: ['./app/landing/landing.component.scss']
})
export class LandingComponent implements OnInit {


  ngOnInit() {
    console.log('Landing Component Loaded');
  }

}

