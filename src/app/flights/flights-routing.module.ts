import { Routes, RouterModule } from '@angular/router';

// import { FlightsearchComponent } from './flightsearch/flightsearch.component';
// import { FlightbookingComponent } from './flightbooking/flightbooking.component';
// import { TicketComponent } from './ticket/ticket.component';
import { FlightsComponent } from './flights.component';
import { NgModule } from '@angular/core';
import { FlightHomeComponent } from './flight-home/flight-home.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightReviewComponent } from './flight-review/flight-review.component';
import { FlightBookingComponent } from './flight-booking/flight-booking.component';
import { FlightVoucherComponent } from './flight-voucher/flight-voucher.component';

const routes: Routes = [
  {
    path: "", component: FlightsComponent, children: [
      { path: "", component: FlightHomeComponent },
      { path: "flight-search", component: FlightSearchComponent },
      { path: "flight-review", component: FlightReviewComponent },
      { path: "flight-booking", component: FlightBookingComponent },
      { path: "flight-voucher", component: FlightVoucherComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class FlightsRoutingModule { }