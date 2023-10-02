import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _facilities = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) { }

  get facilities() {
    return this._facilities.asObservable();
  }

  fetchFacilities() {
    return this.http
      .get('http://127.0.0.1:8000/api/v1/facility')
      .pipe(
        tap(response => { this._facilities.next(response); })
      )
      
  }
}
