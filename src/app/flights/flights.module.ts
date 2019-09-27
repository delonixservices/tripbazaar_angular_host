import { NgModule } from "@angular/core";

import { FlightsComponent } from './flights.component';
import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { FlightbookingComponent } from './flightbooking/flightbooking.component';
import { TicketComponent } from './ticket/ticket.component';

import { FlightsRoutingModule } from './flights-routing.module';

@NgModule({
    declarations: [
        FlightsComponent,
        FlightsearchComponent,
        FlightbookingComponent,
        TicketComponent,
    ],
    imports: [
        FlightsRoutingModule
    ]
})

export class FlightsModule { }
