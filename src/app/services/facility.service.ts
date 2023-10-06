import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private _facilities = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) { }

  getFacilities() {
    return this.http.get('http://127.0.0.1:8000/api/v1/facility');
  }

  getFacility(id: number) {
    return this.http.get('http://127.0.0.1:8000/api/v1/facility/' + id);
  }
}
