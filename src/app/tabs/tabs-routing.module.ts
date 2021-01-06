import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'recorder',
    component: TabsPage,
    children: [
      {
        path: 'record',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'play',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/record',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/recorder/record',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/recorder/record',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
