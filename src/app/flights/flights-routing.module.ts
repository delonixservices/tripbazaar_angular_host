import { Routes, RouterModule } from '@angular/router';

import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { FlightbookingComponent } from './flightbooking/flightbooking.component';
import { TicketComponent } from './ticket/ticket.component';
import { FlightsComponent } from './flights.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: "", component: FlightsComponent, children: [
            { path: "ticket", component: TicketComponent },
            { path: "flightsearch", component: FlightsearchComponent },
            { path: "flightbooking", component: FlightbookingComponent },
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