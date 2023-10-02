import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.page.html',
  styleUrls: ['./facility-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacilityDetailPage implements OnInit {

  id!: number;
  dayOfWeek!: number;

  facility!: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });

    this.dayOfWeek = new Date().getDay();

    this.http.get('http://127.0.0.1:8000/api/v1/facility/' + this.id)
      .subscribe(response => this.updateFacility(response));

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
