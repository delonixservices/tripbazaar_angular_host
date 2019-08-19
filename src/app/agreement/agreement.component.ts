import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agreement-page',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})

export class AgreementComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
