import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ) {
      const user = await this.storageService.getItem('user');
      if (user) {
        alert('You are already logged in!');
        this.router.navigate(['']);
        return false;
      }
      return true;
    }
}
