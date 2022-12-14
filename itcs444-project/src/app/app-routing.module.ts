import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'owner',
    loadChildren: () => import('./owner/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'supplier',
    loadChildren: () => import('./supplier/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'addshift',
    loadChildren: () => import('./addshift/addshift.module').then( m => m.AddshiftPageModule)
  },

  {
    path: 'product-details/:name',
    loadChildren: () => import('./product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'owner/owner-orders',
    loadChildren: () => import('./owner/owner-orders/owner-orders.module').then(m => m.OwnerOrdersPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'owner/place-order/:name',
    loadChildren: () => import('./owner/place-order/place-order.module').then(m => m.PlaceOrderPageModule)
  },
  {
    path: 'modify-product/:name',
    loadChildren: () => import('./owner/modify-product/modify-product.module').then(m => m.ModifyProductPageModule)
  },

  {
    path: 'supplier/add-product',
    loadChildren: () => import('./supplier/add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'owner/all-orders',
    loadChildren: () => import('./owner/all-orders/all-orders.module').then(m => m.AllOrdersPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
