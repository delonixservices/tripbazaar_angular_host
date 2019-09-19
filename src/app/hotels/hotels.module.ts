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
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

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
    ],
    imports: [
        CommonModule,
        FormsModule,
        GalleryModule,
        NgbModule,
        Ng5SliderModule,
        NgSelectModule,
        HotelsRoutingModule,
        NgProgressModule,
        NgProgressHttpModule,
    ]
})

export class HotelsModule { }