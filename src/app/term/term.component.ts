import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-term-page',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})

export class TermComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
