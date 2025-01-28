import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'supplier/dashboard',
    pathMatch: 'full'
  },
  {
   path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.AuthComponent)
  },
  // Supplier Routes
  {
    path: 'supplier',
   // canActivate: [RoleGuard],
   // data: { role: 'SUPPLIER' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/supplier/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'offers',
        loadComponent: () => import('./pages/supplier/offer-management/offer-management.component')
          .then(m => m.OfferManagementComponent)
      }
    ]
  },
  // Client Routes
  {
    path: 'client',
    canActivate: [RoleGuard],
    data: { role: 'CLIENT' },
    children: [
      {
        path: 'marketplace',
        loadComponent: () => import('./pages/client/products/products.component')
          .then(m => m.ProductsComponent)
      },
  // {
  //   path: 'orders',
  //   loadComponent: () => import('./pages/client/orders/orders.component')
  //     .then(m => m.OrdersComponent)
  // },
      {
        path: 'cart',
        loadComponent: () => import('./pages/client/cart/cart.component')
          .then(m => m.CartComponent)
      }
    ]
  },
 //{
  //  path: '**',
  //  redirectTo: 'login'
 // }
];
