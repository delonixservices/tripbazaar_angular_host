import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services';

@Component({
  selector: 'app-flightsearch-page',
  templateUrl: './flightsearch.component.html',
  styleUrls: ['./flightsearch.component.css']
})

export class FlightsearchComponent implements OnInit {
  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    const params = {};
    // this.api.post('', params);
  }
}

