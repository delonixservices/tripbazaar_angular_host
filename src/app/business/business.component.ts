import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-page',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})


export class BusinessComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
