import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hotel-search-loader',
  templateUrl: './hotel-search-loader.component.html',
  styleUrls: ['./hotel-search-loader.component.css']
})
export class HotelSearchLoaderComponent implements OnInit {

  @Input() items: number;

  public loaders = [];

  constructor() { }

  ngOnInit() {
    this.loaders = [];
    const items = this.items;

    for (let i = 0; i < items; i++) {
      const loader = { id: i + 1 };
      this.loaders.push(loader);
    }
  }

}
