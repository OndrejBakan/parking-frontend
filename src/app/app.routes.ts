import { Routes } from '@angular/router';
import { FacilityDetailPage } from './facilities/facility-detail/facility-detail.page';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'facilities',
    // loadComponent: () => import('./facilities/facility-detail/facility-detail.page').then( m => m.FacilityDetailPage)
    children: [
      { path: ':id', component: FacilityDetailPage}
    ]
  },

];
