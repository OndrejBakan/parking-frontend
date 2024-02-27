import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    loadChildren: () => import('./pages/home/home.routes').then((m) => m.routes)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then( m => m.AboutPage)
  },
];
