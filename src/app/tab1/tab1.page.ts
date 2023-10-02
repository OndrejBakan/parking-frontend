import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import * as L from 'leaflet';
import { LocationService } from '../services/location.service';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class Tab1Page {
  map!: L.Map;
  marker!: L.Marker;
  facilities: any;

  private currentLocationSub;
  private facilitiesSub: any;

  constructor(private locationService: LocationService, private apiService: ApiService, private http: HttpClient) {
    // this.locationService.startWatchingLocation();

    this.currentLocationSub = this.locationService.currentLocation.subscribe((position: any) => {
      // this.updateUserPosition(position);
    });
  }

  ngOnInit() {

    this.facilitiesSub = this.apiService.facilities.subscribe(facilities => {
      this.updateFacilities(facilities.data);
    });

    this.map = new L.Map('map', {
      center: [0, 0],
      zoomControl: false
    });

    L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=buz9V2TEnLc5pz9oiKtL3Kwr3Wiwff0B4UviYkIZ4hzis4JnYIEabxS7bbE4tFpO', {}).addTo(this.map);
  }

  ionViewWillEnter() {
    this.apiService.fetchFacilities().subscribe();
  }

  updateUserPosition(position: any) {
    this.marker = L.marker([
      position.coords.latitude,
      position.coords.longitude]).addTo(this.map);
    
    this.map.setView([
      position.coords.latitude,
      position.coords.longitude
    ]);
  }

  updateFacilities(facilities: any) {
    const facilitiesLayer = new L.FeatureGroup().addTo(this.map);

    const greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const yellowIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    facilities.forEach((facility: any) => {
      if (facility.latest_occupancy_record.spaces_public_percentages.spaces_public_vacant_percentage >= 75) {
        var icon = greenIcon;
      } else if (facility.latest_occupancy_record.spaces_public_percentages.spaces_public_vacant_percentage <= 25) {
        var icon = redIcon;
      } else {
        var icon = yellowIcon;
      }
      
      var spaces_public_total = Number(facility.latest_occupancy_record.spaces_public_vacant) + Number(facility.latest_occupancy_record.spaces_public_occupied);

      const facilityMarker = L.marker([
        facility.latitude,
        facility.longitude,
      ], {icon: icon})
        .bindPopup(
          '<b>' + facility.name + '</b><br>' +
          'Volná místa pro veřejnost: ' + facility.latest_occupancy_record.spaces_public_vacant + '/' + spaces_public_total
          )
        .addTo(this.map);
    
      facilityMarker.addTo(facilitiesLayer);
    });

    // a "hack" to center AND fitBounds
    let ne = facilitiesLayer.getBounds().getNorthEast();
    let sw = facilitiesLayer.getBounds().getSouthWest();

    let symmetricNe: L.LatLngTuple = [ne.lat + (49.195278 - ne.lat)*2, ne.lng + (16.608333 - ne.lng)*2];
    let symmetricSw: L.LatLngTuple = [sw.lat + (49.195278 - sw.lat)*2, sw.lng + (16.608333 - sw.lng)*2];

    this.map.fitBounds(
      facilitiesLayer.getBounds().extend(L.latLngBounds(symmetricSw, symmetricNe)),
      {padding: [50, 50]});
  }
}
