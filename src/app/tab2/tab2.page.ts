import { Component } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { AuthService } from '../auth/services/auth.service';
import { EventModel } from '../events/models/event';
import { MapsService } from '../maps/services/maps.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  
})
export class Tab2Page {
    newMap: GoogleMap;

    constructor(public maps:MapsService, private auth:AuthService) {}

    ngOnInit(): void{
        this.summonMap().then(() => this.putMarkers());
        this.maps.event = new EventModel;
    }
    async summonMap(){
      this.newMap = await this.maps.createMap('map')
    }

    async putMarkers(){
      await this.maps.addMarkers();
    }

    async logout(){
      await this.auth.logOut();
    }
}