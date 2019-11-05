import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})

export class GoogleAnalyticsService {

  constructor(
    router: Router
  ) { }

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
