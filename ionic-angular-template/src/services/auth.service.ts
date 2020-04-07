import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Api } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedUserDataSubject = new BehaviorSubject<any>(null);

  public get loggedUserData() {
    return this.loggedUserDataSubject.asObservable();
  }
  constructor(
    private storageService: StorageService,
    private api: Api
    ) {
      firebase.auth().onAuthStateChanged(async currentUser => {
        if (currentUser) {
          this.storageService.setItem('user', JSON.stringify(currentUser));
          const user = (await firebase.firestore().collection('users').doc(`${currentUser.uid}`).get()).data();
          this.loggedUserDataSubject.next(user);
          return;
        }
        this.storageService.removeItem('user');
    });
  }

  async createUser(wallet: string, uid: string, email: string) {
    try {
      return this.api.post(`${environment.apiUrl}/users/createUser`, {wallet, uid, email});
    } catch(e) {
      throw new Error(e);
    }
  }

  async getUserData() {
    try {
      return await this.api.get(`${environment.apiUrl}/users/wallet`);
    } catch(e) {
      throw new Error(e);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const currentUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await currentUser.user.sendEmailVerification();
      const wallet = ethers.Wallet.createRandom();
      const encryptJson = await wallet.encrypt(password);
      const user: any = await this.createUser(encryptJson, currentUser.user.uid, email);
      this.loggedUserDataSubject.next(user.user);
    } catch (e) {
      throw new Error(e);
    }
  }

  async checkUserEmailVerified(email: string, password: string) {
    try {
        const currentUser = await firebase.auth().signInWithEmailAndPassword(email, password);
        return currentUser.user.emailVerified;
    } catch (e) {
      throw new Error(e);
    }
  }

  async verifyPasswordResetCode(code: string) {
    try {
      return await firebase.auth().verifyPasswordResetCode(code);
    } catch (e) {
      throw new Error(e);
    }
  }

  async resetPassword(newPassword: string, code: string, email: string) {
    try {
      await firebase.auth().confirmPasswordReset(code, newPassword);
      const currentUser = await firebase.auth().signInWithEmailAndPassword(email, newPassword);
      const wallet = ethers.Wallet.createRandom();
      const encryptJson = await wallet.encrypt(newPassword);
      await this.resetWallet(currentUser.user.uid, encryptJson);
      await this.logout();
    } catch (e) {
      throw new Error(e);
    }
  }

  async resetWallet(uid: string, wallet: string) {
    try {
      await this.api.put(`${environment.apiUrl}/users/wallet`, {uid, wallet});
    } catch(e) {
      throw new Error(e);
    }
  }

  async logout() {
    try {
      this.storageService.removeItem('user');
      this.loggedUserDataSubject.next(null);
      await firebase.auth().signOut();
    } catch(e) {
      throw new Error(e);
    }
  }

  async sentResetPasswordEmail(email: string) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch(e) {
      throw new Error(e);
    }
  }

  async verifyEmail(actCode: string) {
    try {
      await firebase.auth().applyActionCode(actCode);
      this.logout();
    } catch (e) {
      throw new Error(e);
    }
  }
  
}
