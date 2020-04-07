import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import * as firebase from 'firebase';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token-interceptor';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from '../auth/verify-email/verify-email.component';
import { EqualValueValidator } from '../validators/validator';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

firebase.initializeApp(environment.firebase);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, SignInComponent, ForgotPasswordComponent, SignUpComponent, ResetPasswordComponent, VerifyEmailComponent],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    EqualValueValidator,
    StatusBar,
    SplashScreen,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
