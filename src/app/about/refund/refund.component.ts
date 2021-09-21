import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-refund-page',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})

export class RefundComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
