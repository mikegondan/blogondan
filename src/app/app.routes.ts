import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/blog-layout').then(m => m.BlogLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/post-list/post-list').then(m => m.PostList)
      },
      {
        path: 'post/:id',
        loadComponent: () => import('./pages/post-detail/post-detail').then(m => m.PostDetailComponent)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent)
  }
];
