import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HotelHomeComponent } from './hotels/hotel-home/hotel-home.component';
import { FlightsComponent } from './flights/flights.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  // { path: "", component: HomeComponent },
  { path: "", redirectTo: "hotels", pathMatch: "full" },
  { path: "hotels", component: HotelHomeComponent },
  { path: "flights", component: FlightsComponent },
  { path: "account", component: AccountComponent },
  { path: "about", component: AboutComponent },
  // { path: '**', redirectTo: '/hotels' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
