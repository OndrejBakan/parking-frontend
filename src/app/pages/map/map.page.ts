import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { FacilityService } from '../../services/facility.service';
import * as L from 'leaflet';
import { FacilityDetailComponent } from '../../components/facility/facility-detail/facility-detail.component';
import { FacilityDetailPage } from '../facility/facility-detail/facility-detail.page';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  map: any;
  mapCenter!: [0, 0];
  mapZoom!: number;
  facilities$: any;
  facilities: any;
  lastUpdated!: Date;
  refreshButtonDisabled: boolean = false;

  constructor(
    private facilityService: FacilityService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController) {}

  ngOnInit(): void {
    this.facilities$ = this.facilityService.getFacilities();
    // init map
    this.map = new L.Map('map', {
      center: this.mapCenter,
      zoom: 16,
      zoomControl: false
    });

    this.map.on('moveend', function(this: MapPage, e: any) {
      this.mapCenter = e.target.getCenter();
      this.mapZoom = e.target.getZoom();
    });

    L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=buz9V2TEnLc5pz9oiKtL3Kwr3Wiwff0B4UviYkIZ4hzis4JnYIEabxS7bbE4tFpO', {}).addTo(this.map);

    this.fetchData();
  }

  ionViewWillEnter() {
    this.map.invalidateSize();
    this.fetchData();
  }

  facilitiesUpdated(facilities: any) {
    
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

    facilities.data.forEach((facility: any) => {
      if (facility.latest_occupancy_record.spaces_public_percentages.spaces_public_vacant_percentage >= 75) {
        var icon = greenIcon;
      } else if (facility.latest_occupancy_record.spaces_public_percentages.spaces_public_vacant_percentage <= 25) {
        var icon = redIcon;
      } else {
        var icon = yellowIcon;
      }
      
      var spacesPublicTotal = Number(facility.latest_occupancy_record.spaces_public_vacant) + Number(facility.latest_occupancy_record.spaces_public_occupied);

      const facilityMarker = L.marker([
        facility.latitude,
        facility.longitude,
      ], {icon: icon}).addTo(this.map);

      facilityMarker.addEventListener('click', (e: any) => {
        this.modalCtrl.create({
            component: FacilityDetailPage,
            componentProps: {id: facility.id},
            breakpoints: [0, 0.5, 1],
            initialBreakpoint: 0.5,
            handle: true,
            handleBehavior: 'none',
          }).then((modal) => {
            modal.present();
        } );
      })
    
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

  async fetchData() {
    if (this.lastUpdated && Date.now() < this.lastUpdated.getTime() + 60 * 1000) {
      	return;
    }

    let loading = this.loadingCtrl.create({
      'message': 'Loading...'
    });

    (await loading).present();

    // fetch facilities
    this.facilityService.getFacilities().subscribe({
      next: async (response) => {
        this.lastUpdated = new Date();
        this.refreshButtonDisabled = true;
        setTimeout(() => {
          this.refreshButtonDisabled = false;
        }, 60 * 1000);
        this.facilitiesUpdated(response);
        (await loading).dismiss();
      },
    });
  }
}
