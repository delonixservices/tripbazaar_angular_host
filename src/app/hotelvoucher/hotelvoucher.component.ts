import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotelvoucher-page',
  templateUrl: './hotelvoucher.component.html',
  styleUrls: ['./hotelvoucher.component.css']
})

export class HotelvoucherComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
