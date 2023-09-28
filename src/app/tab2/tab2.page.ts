import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, RouterModule]
})
export class Tab2Page {

  facilities: any;
  
  private facilitiesSub: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.facilitiesSub = this.apiService.facilities.subscribe(facilities => {
      this.updateFacilities(facilities);
    });
  }

  updateFacilities(facilities: any) {
    this.facilities = facilities;
  }

}
