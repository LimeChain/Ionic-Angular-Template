import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Plugins } from '@capacitor/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    public constructor(private storageService: StorageService) {
    }
    public intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return from(this.handle(request, next))
    }

    async handle(request: HttpRequest<any>, next: HttpHandler) {
      const user = JSON.parse(await this.storageService.getItem('user'));
      let token;
      if (user) {
        token = user.stsTokenManager.accessToken;
      }
      let updatedRequest: any;
      updatedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
              });
      return next.handle(updatedRequest).toPromise();
    }
}
