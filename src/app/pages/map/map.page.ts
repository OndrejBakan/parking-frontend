import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import * as L from 'leaflet';
import { LoadingController, ModalController, Platform } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  facilities: any;
  facilities$!: Observable<any>;
  response: any;
  map: any;
  mapCenter!: [0, 0];
  mapZoom!: 16;
  presentingElement: any;
  selectedFacility: any;
  isModalOpen: boolean = false;

  @ViewChild('header', { read: ElementRef }) header: ElementRef | undefined

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('ion-content')?.closest('.ion-page');
    // init map
    this.map = new L.Map('map', {
      center: [49, 16],
      zoom: 16,
      zoomControl: false
    });

    this.map.on('moveend', function (this: MapPage, e: any) {
      this.mapCenter = e.target.getCenter();
      this.mapZoom = e.target.getZoom();
    });

    L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=buz9V2TEnLc5pz9oiKtL3Kwr3Wiwff0B4UviYkIZ4hzis4JnYIEabxS7bbE4tFpO', {}).addTo(this.map);

    this.facilities$ = this.api.getFacilities();
    this.facilities$.subscribe((facilities: any) => {
      console.log(facilities);
      this.facilities = facilities.features;
    });
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

    facilities.features.forEach((facility: any) => {
      console.log(facility);

      const facilityMarker = L.marker([
        facility.geometry.coordinates[1],
        facility.geometry.coordinates[0]],
        { 'icon': greenIcon });

      /*      facilityMarker.addEventListener('click', (e: any) => {
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
            }); */
      facilityMarker.addEventListener('click', (e: any) => {
        console.log(this.map);
        this.selectedFacility = facility;
        this.isModalOpen = true;

        let centerInPx = this.map.latLngToContainerPoint(new L.LatLng(
          this.selectedFacility.geometry.coordinates[1],
          this.selectedFacility.geometry.coordinates[0]
        ));

        let modalHeight = (this.platform.height() - 10) / 2;

        console.log(centerInPx.y, modalHeight, modalHeight / 2);
        let newCenterInPx = {
          x: centerInPx.x,
          y: centerInPx.y + 20,
        };
        console.log(newCenterInPx);

        let newCenterInCoords = this.map.containerPointToLatLng({x: 0, y:0});
        this.map.flyTo(newCenterInCoords, 16);

        console.log(centerInPx);
        
        
        let center = this.platform.height() - modalHeight / 2;

        console.log("Center", this.platform.height() / 2);
        console.log("Center with 0.5", 56 + (this.platform.height() - modalHeight * 0.5) / 2);
      });
      facilityMarker.addTo(facilitiesLayer);
    });

    // a "hack" to center AND fitBounds
    let ne = facilitiesLayer.getBounds().getNorthEast();
    let sw = facilitiesLayer.getBounds().getSouthWest();

    let symmetricNe: L.LatLngTuple = [ne.lat + (49.195278 - ne.lat) * 2, ne.lng + (16.608333 - ne.lng) * 2];
    let symmetricSw: L.LatLngTuple = [sw.lat + (49.195278 - sw.lat) * 2, sw.lng + (16.608333 - sw.lng) * 2];

    this.map.fitBounds(
      facilitiesLayer.getBounds().extend(L.latLngBounds(symmetricSw, symmetricNe)),
      { padding: [10, 10] });
  }

  onIonModalDidDismiss(event: any) {
    console.log(event);
    this.isModalOpen = false;
  }

  onIonBreakpointDidChange(event: any) {
  }

  async fetchData() {
    let loading = this.loadingCtrl.create({
      'message': 'Načítání...'
    });

    (await loading).present();

    // fetch facilities
    this.api.getFacilities().subscribe({
      next: async (response) => {
        this.facilitiesUpdated(response);
        (await loading).dismiss();
      },
    });
  }
}
