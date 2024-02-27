import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getFacilities() {
    return this.http.get('https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/carparks_live/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson');
  }

  getFacility(id: number) {
    return this.http.get('http://127.0.0.1:8000/api/v1/facility/' + id);
  }
}
