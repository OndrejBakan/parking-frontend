import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, IonRouterOutlet, RouterModule],
})
export class AppComponent {
  constructor() {
    addIcons({ homeOutline, informationCircleOutline });
  }
}
