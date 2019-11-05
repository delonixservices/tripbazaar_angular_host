import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ApiService, JwtService } from './core/services';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  public nav: any;
  public validation: any;


  constructor(public router: Router, public api: ApiService, public jwt: JwtService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url !== undefined) {
          this.nav = event.url;
        }
      }

      // Added Ankit
      // Scroll to the top when navigating to the next route
      if (!(event instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0, 0);
      }

      // for google analytics 
      if (event instanceof NavigationEnd) {
        const propertyId = 'UA-137598713-1';
        gtag('config', propertyId,
          {
            // route after /
            'page_path': event.urlAfterRedirects
          }
        );
      }

    });

  }

  ngOnInit() {

  }
}
