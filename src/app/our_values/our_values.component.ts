import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-our_values-page',
  templateUrl: './our_values.component.html',
  styleUrls: ['./our_values.component.css']
})

export class Our_valuesComponent implements OnInit{
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
