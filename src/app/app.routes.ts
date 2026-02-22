import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
  },
  {
    path: 'books/:topic',
    loadComponent: () => import('./features/books/books').then((m) => m.Books),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
