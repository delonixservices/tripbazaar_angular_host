import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsRoutingModule } from './flights-routing.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ngx-gallery/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { FlightsComponent } from './flights.component';
import { FlightHomeComponent } from './flight-home/flight-home.component';
import { FlightSearchbarComponent } from './flight-home/flight-searchbar/flight-searchbar.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightItemComponent } from './flight-search/flight-item/flight-item.component';
// import { FlightSearchService } from './flight-search/flight-search.service';
import { FlightModifysearchComponent } from './flight-modifysearch/flight-modifysearch.component';
import { FlightReviewComponent } from './flight-review/flight-review.component';
import { FlightBookingComponent } from './flight-booking/flight-booking.component';
import { PassengerSelectComponent } from './passenger-select/passenger-select.component';

import { faMinus, faPlus, fas } from '@fortawesome/free-solid-svg-icons';



@NgModule({
  declarations: [
    FlightsComponent,
    FlightHomeComponent,
    FlightSearchbarComponent,
    FlightSearchComponent,
    FlightItemComponent,
    FlightModifysearchComponent,
    FlightReviewComponent,
    FlightBookingComponent,
    PassengerSelectComponent,
  ],
  imports: [
    FlightsRoutingModule,
    CommonModule,
    FormsModule,
    GalleryModule,
    NgbModule,
    Ng5SliderModule,
    NgSelectModule,
    NgbDropdownModule,
    FontAwesomeModule,
  ],
  providers: [
    // FlightSearchService
  ]
})

export class FlightsModule {
  constructor(
    public library: FaIconLibrary
  ) {
    library.addIconPacks(fas)
  }
}