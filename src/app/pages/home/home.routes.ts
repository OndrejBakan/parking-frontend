import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'map',
    },
    {
      path: 'map',
      loadComponent: () => import('../map/map.page').then((m) => m.MapPage)
    },
    {
      path: 'list',
      loadComponent: () => import('../facility/facility-list/facility-list.page').then((m) => m.FacilityListPage),
    },
  ];