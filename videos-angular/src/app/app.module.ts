import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing';

// Guard
import { UserService } from './services/user.service';
import { UserAuthGuard } from './services/userAuth.guard';
import { UserNoAuthGuard } from './services/userNoAuth.guard';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { UpdateVideoComponent } from './components/update-video/update-video.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ErrorComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    UserSettingsComponent,
    UploadVideoComponent,
    UpdateVideoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [UserService, UserAuthGuard, UserNoAuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
