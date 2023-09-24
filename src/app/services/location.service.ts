import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _currentLocation = new Subject();

  constructor() {}

  startWatchingLocation() {
    this.checkAndRequestPermissions();
    
    Geolocation.watchPosition({
      enableHighAccuracy: true,
    }, (position, error) => {
      if (position && !error) {
        this._currentLocation.next(position);
      }
    });
  }

  checkAndRequestPermissions() {

  }

  get currentLocation() {
    return this._currentLocation.asObservable();
  }

}
