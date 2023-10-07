import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
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
  loading = false;
  id: any;
  id$: any;
  facility: any;
  facility$: any;
  selectedDayOfWeek: number;
  chart!: Chart;
  
  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private loadingCtrl: LoadingController) {
      this.selectedDayOfWeek = new Date().getDay();
    }

  ngOnInit() {
    // get ID from route and fetch facility from API
    this.id$ = this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.facility$ = this.facilityService.getFacility(this.id).subscribe((facility: any) => {
        this.facility = facility.data;
        this.updateChart();
      });
    });

  }

  ngOnDestroy(): void {
    this.id$.unsubscribe();
    this.facility$.unsubscribe();
  }

  dayOfWeekSelectionChanged(event: any) {
    this.selectedDayOfWeek = event.detail.value;
    this.chart.data.labels = this.facility.popular_times[this.selectedDayOfWeek].map((row: any) => row.hour_of_day);
    this.chart.data.datasets[0].data = this.facility.popular_times[this.selectedDayOfWeek].map((row: any) => row.occupancy_percentage);
    this.chart.update();
  }

  updateChart() {
    this.chart = new Chart("myChart", {
      type: 'bar',
      data: {
        labels: this.facility.popular_times[this.selectedDayOfWeek].map((row: any) => row.hour_of_day),
        datasets: [{
          label: 'Obsazenost [%]',
          data: this.facility.popular_times[this.selectedDayOfWeek].map((row: any) => row.occupancy_percentage),
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