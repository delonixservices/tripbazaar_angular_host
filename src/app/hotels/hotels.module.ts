import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HotelsComponent } from './hotels.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { HotelinvoiceComponent } from './hotel-invoice/hotel-invoice.component';
import { HotelvoucherComponent } from './hotel-voucher/hotel-voucher.component';
import { HotelbookingComponent } from './hotel-booking/hotel-booking.component';
import { HoteldetailsComponent } from './hotel-details/hotel-details.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ngx-gallery/core';
import { HotelsRoutingModule } from './hotels-routing.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


import { HotelSearchbarComponent } from './hotel-searchbar/hotel-searchbar.component';
import { HotelHomeComponent } from './hotel-home/hotel-home.component';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { HotelModifySearchComponent } from './hotel-modify-search/hotel-modify-search.component';
import { HotelSelectGuestsComponent } from './hotel-select-guests/hotel-select-guests.component';
import { HotelSearchFiltersComponent } from './hotel-search-filters/hotel-search-filters.component';
import { HotelSearchLoaderComponent } from './hotel-search-loader/hotel-search-loader.component';
import { HotelViewOnMapComponent } from './hotel-details/hotel-view-on-map/hotel-view-on-map.component';
import { HotelReviewComponent } from './hotel-details/hotel-review/hotel-review.component';
import { HotelAmenitiesComponent } from './hotel-details/hotel-amenities/hotel-amenities.component';
import { HotelRoomSelectComponent } from './hotel-details/hotel-room-select/hotel-room-select.component';
import { HotelAutosuggestComponent } from './hotel-autosuggest/hotel-autosuggest.component';

@NgModule({
  declarations: [
    HotelsComponent,
    HoteldetailsComponent,
    HotelvoucherComponent,
    HotelbookingComponent,
    HotelSearchComponent,
    HotelinvoiceComponent,
    HotelSearchbarComponent,
    HotelHomeComponent,
    HotelModifySearchComponent,
    HotelSelectGuestsComponent,
    HotelSearchFiltersComponent,
    HotelSearchLoaderComponent,
    HotelViewOnMapComponent,
    HotelReviewComponent,
    HotelAmenitiesComponent,
    HotelRoomSelectComponent,
    HotelAutosuggestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GalleryModule,
    NgbModule,
    Ng5SliderModule,
    NgSelectModule,
    HotelsRoutingModule,
    ImgFallbackModule,
    NgxSkeletonLoaderModule,
    InfiniteScrollModule
  ]
})

export class HotelsModule { }