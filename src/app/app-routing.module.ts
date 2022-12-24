import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./pages/new/new.module').then( m => m.NewPageModule)
  },
  {
    path: 'game/:slot',
    redirectTo: 'game/:slot/resources'
  },
  {
    path: 'game/:slot/resources',
    loadChildren: () => import('./pages/resources/resources.module').then( m => m.ResourcesPageModule)
  },
  {
    path: 'game/:slot/inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'game/:slot/mining',
    loadChildren: () => import('./pages/mining/mining.module').then( m => m.MiningPageModule)
  },
  {
    path: 'game/:slot/fishing',
    loadChildren: () => import('./pages/fishing/fishing.module').then( m => m.FishingPageModule)
  },
  {
    path: 'game/:slot/foraging',
    loadChildren: () => import('./pages/foraging/foraging.module').then( m => m.ForagingPageModule)
  },
  {
    path: 'game/:slot/logging',
    loadChildren: () => import('./pages/logging/logging.module').then( m => m.LoggingPageModule)
  },
  {
    path: 'game/:slot/hunting',
    loadChildren: () => import('./pages/hunting/hunting.module').then( m => m.HuntingPageModule)
  },
  {
    path: 'game/:slot/blacksmithing',
    loadChildren: () => import('./pages/blacksmith/blacksmith.module').then( m => m.BlacksmithPageModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
