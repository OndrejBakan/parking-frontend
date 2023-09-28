import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.page.html',
  styleUrls: ['./facility-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacilityDetailPage implements OnInit {

  id!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });

    this.http.get('http://127.0.0.1:8000/api/v1/facility/' + this.id)
    .subscribe(a => console.log(a));
  }

}
