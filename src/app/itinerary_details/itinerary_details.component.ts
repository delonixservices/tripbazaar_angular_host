import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itinerary_details-page',
  templateUrl: './itinerary_details.component.html',
  styleUrls: ['./itinerary_details.component.css']
})

export class Itinerary_detailsComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
