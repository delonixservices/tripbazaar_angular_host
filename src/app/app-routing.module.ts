import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HotelsComponent } from './hotels/hotels.component';

const routes: Routes = [
  // { path: "", component: HomeComponent },
  { path: "", redirectTo: "hotels", pathMatch: "full" },
  // dont have to lazy load hotels module, because it is first module to load
  // { path: "hotels", loadChildren: () => import('./hotels/hotels.module').then(m => m.HotelsModule) },
  // { path: "flights", loadChildren: () => import('./flights/flights.module').then(m => m.FlightsModule) },
  { path: "hotels", component: HotelsComponent },
  { path: "account", loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: "about", loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: '**', redirectTo: '/hotels' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
