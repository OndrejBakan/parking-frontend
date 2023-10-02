import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'facilities/:id',
    loadComponent: () => import('./facilities/facility-detail/facility-detail.page').then((m) => m.FacilityDetailPage)
  },
  {
    path: 'test-page',
    loadComponent: () => import('./test-page/test-page.page').then( m => m.TestPagePage)
  },
];
