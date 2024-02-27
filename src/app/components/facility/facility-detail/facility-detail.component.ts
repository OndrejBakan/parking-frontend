import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class FacilityDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
