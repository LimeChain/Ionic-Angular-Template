import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public async getItem(key: string): Promise<string> {
    return (await Plugins.Storage.get({key})).value;
  }

  public setItem(key: string, value: string): void {
    Plugins.Storage.set({key: 'user', value});
  }

  public removeItem(key: string): void {
    Plugins.Storage.remove({key});
  }

  public clear(): void {
      localStorage.clear();
  }
}
