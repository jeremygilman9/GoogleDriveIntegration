import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  templateUrl: './app/app/app.component.html',
  styleUrls: ['./app/app/app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Google Drive API Integration Prototype';

constructor(routerService: Router, titleService: Title, route: ActivatedRoute) {
  routerService.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        var title = routerService.routerState.root.firstChild.data.subscribe((res: {Title: string}) => {
          console.log('Page Title is: ' + res.Title);
          titleService.setTitle(res.Title);
        });

      }
    });
}

  ngOnInit() {
    console.log('App Component Loaded');
  }

}