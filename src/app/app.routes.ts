import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    loadChildren: () => import('./pages/home/home.routes').then((m) => m.routes)
  },
  {
    path: 'facility',
    loadComponent: () => import('./pages/facility/facility-list/facility-list.page').then((m) => m.FacilityListPage)
  },
  {
    path: 'facility/:id',
    loadComponent: () => import('./pages/facility/facility-detail/facility-detail.page').then((m) => m.FacilityDetailPage)
  }
];
