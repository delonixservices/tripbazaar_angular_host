import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HotelinvoiceComponent } from './hotel-invoice/hotel-invoice.component';
import { HotelsComponent } from './hotels.component';
import { HotelvoucherComponent } from './hotel-voucher/hotel-voucher.component';
import { HoteldetailsComponent } from './hotel-details/hotel-details.component';
import { HotelbookingComponent } from './hotel-booking/hotel-booking.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { HotelHomeComponent } from './hotel-home/hotel-home.component';

const routes: Routes = [{
  path: "hotels", component: HotelsComponent, children: [
    { path: "", component: HotelHomeComponent },
    { path: "hotelvoucher", component: HotelvoucherComponent },
    { path: "hotelinvoice", component: HotelinvoiceComponent },
    { path: "hoteldetails", component: HoteldetailsComponent },
    { path: "hotelbooking", component: HotelbookingComponent },
    { path: "searchresult", component: HotelSearchComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HotelsRoutingModule { }