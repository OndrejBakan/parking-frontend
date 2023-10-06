import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'home',
    },
    {
      path: 'map',
      // loadComponent: () => import('../pages/map/map.page').then((m) => m.MapPage),
      loadComponent: () => import('../map/map.page').then((m) => m.MapPage)
    },
    {
      path: 'list',
      loadComponent: () => import('../facility/facility-list/facility-list.page').then((m) => m.FacilityListPage),
    },
  ];