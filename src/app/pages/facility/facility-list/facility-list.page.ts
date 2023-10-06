import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FacilityService } from 'src/app/services/facility.service';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.page.html',
  styleUrls: ['./facility-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class FacilityListPage implements OnInit {

  facilities: any = [];
  facilities$: any;

  constructor(private facilityService: FacilityService) { }

  ngOnInit() {
    this.facilities$ = this.facilityService.getFacilities();
    this.facilities$.subscribe((facilities: any) => {
      this.facilities = facilities.data;
    });
  }

}
