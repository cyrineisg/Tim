import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'audits',
    loadComponent: () => import('./audits/audits.component').then((m) => m.AuditsComponent),
  },
  {
    path: 'process-list/:auditId',
    loadComponent: () => import('./process-list/process-list.component').then((m) => m.ProcessListComponent),
  },
  {
    path: 'process-view/:auditId/:processId',
    loadComponent: () => import('./process-view/process-view.component').then((m) => m.ProcessViewComponent),
  },
  {
    path: 'process-proof',
    loadComponent: () =>
      import('./process-proof/process-proof.component').then((m) => m.ProcessProofComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
