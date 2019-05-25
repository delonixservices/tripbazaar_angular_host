import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flightsearch-page',
  templateUrl: './flightsearch.component.html',
  styleUrls: ['./flightsearch.component.css']
})

export class FlightsearchComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
