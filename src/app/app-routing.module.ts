import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './helpers/guards/auth.guard';
const routes: Routes = [
  { path: '', redirectTo: 'Admin/login', pathMatch: 'full' },

  {
    path: 'Admin',
    children: [
      {
        path: '', redirectTo: 'login', pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        loadChildren: () => import('./pages/master-page/master-page.module').then(m => m.MasterPageModule)
        , canActivate: [AuthGuard]
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
