import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: "", component: HomeComponent },
  { path: "", redirectTo: "hotels", pathMatch: "full" },
  { path: "hotels", loadChildren: () => import('./hotels/hotels.module').then(m => m.HotelsModule) },
  // { path: "flights", loadChildren: () => import('./flights/flights.module').then(m => m.FlightsModule) },
  { path: "account", loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: "about", loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  // { path: '**', redirectTo: '/hotels' }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {
  //   preloadingStrategy: PreloadAllModules
  // })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
