import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { FacilityService } from '../../../services/facility.service';

@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.page.html',
  styleUrls: ['./facility-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacilityDetailPage implements OnInit, OnDestroy {
  id: any;
  id$: any;
  facility: any;
  facility$: any;
  
  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      console.log(paramMap);
      console.log(this.navCtrl);
    })
  }

  ngOnDestroy() {
    this.id$.unsubscribe();
    this.facility$.unsubscribe();
  }

  updateFacility(response: any) {
    this.facility = response.data;
    this.updateChart();
  }

  updateChart() {
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
        labels: this.facility.popular_times[1].map((row: any) => row.hour_of_day),
        datasets: [{
          label: 'Obsazenost',
          data: this.facility.popular_times[1].map((row: any) => row.occupancy_percentage),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              callback: function(value, index, ticks) {
                return value + ':00';
              }
            }
          },
          y: {
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },
            min: 0,
            max: 100,
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });

}
}