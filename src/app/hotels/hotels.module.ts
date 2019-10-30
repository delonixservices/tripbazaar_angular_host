import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HotelsComponent } from './hotels.component';
import { SearchresultComponent } from './searchresult/searchresult.component';
import { HotelinvoiceComponent } from './hotelinvoice/hotelinvoice.component';
import { HotelvoucherComponent } from './hotelvoucher/hotelvoucher.component';
import { HotelbookingComponent } from './hotelbooking/hotelbooking.component';
import { HoteldetailsComponent } from './hoteldetails/hoteldetails.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ngx-gallery/core';
import { HotelsRoutingModule } from './hotels-routing.module';
import { HotelSearchbarComponent } from './hotel-searchbar/hotel-searchbar.component';
import { HotelHomeComponent } from './hotel-home/hotel-home.component';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { HotelModifySearchComponent } from './hotel-modify-search/hotel-modify-search.component';
import { HotelSelectGuestsComponent } from './hotel-select-guests/hotel-select-guests.component';
import { HotelSearchFiltersComponent } from './hotel-search-filters/hotel-search-filters.component';

@NgModule({
  declarations: [
    HotelsComponent,
    HoteldetailsComponent,
    HotelvoucherComponent,
    HotelbookingComponent,
    SearchresultComponent,
    HotelinvoiceComponent,
    HotelSearchbarComponent,
    HotelHomeComponent,
    HotelModifySearchComponent,
    HotelSelectGuestsComponent,
    HotelSearchFiltersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GalleryModule,
    NgbModule,
    Ng5SliderModule,
    NgSelectModule,
    HotelsRoutingModule,
    ImgFallbackModule
  ]
})

export class HotelsModule { }