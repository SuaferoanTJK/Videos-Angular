import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthGuard } from './services/userAuth.guard';
import { UserNoAuthGuard } from './services/userNoAuth.guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { UpdateVideoComponent } from './components/update-video/update-video.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:page', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [UserNoAuthGuard] },
  { path: 'logout/:sure', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UserNoAuthGuard],
  },
  {
    path: 'settings',
    component: UserSettingsComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: 'upload-video',
    component: UploadVideoComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: 'update-video/:id',
    component: UpdateVideoComponent,
    canActivate: [UserAuthGuard],
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
