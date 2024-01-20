import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event'
import { CreateEvent } from '../models/createEvent';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { environment } from 'src/environments/environment';
import { get } from 'scriptjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  html:HTMLDivElement;
  placeService:google.maps.places.PlacesService;
  user:User;

  constructor(private db:AngularFireDatabase, private auth:AuthService) {
    get(`https://maps.googleapis.com/maps/api/js?key=${environment.agmKey}&libraries=places`, () => {
      this.html = document.createElement('div') as HTMLDivElement;
      this.placeService = new google.maps.places.PlacesService(this.html);
     });
  }

  public getSavedEvents():Observable<EventModel[]> {
    this.loadUser();
    return this.db.list<EventModel>(`saved/${this.user.uid}`).valueChanges();      
  }

  public saveEvent(event:EventModel) {
    this.loadUser();
    this.db.list<EventModel>(`saved/${this.user.uid}`).push(event);
  }

  public deleteSaveEvent(key:string):void {
    this.loadUser();
    this.db.object(`saved/${this.user.uid}`).query.orderByChild('key').equalTo(key).limitToFirst(1).get().then(event => {
      let keys = Object.keys(event.val())
      this.db.object(`saved/${this.user.uid}/${keys[0]}`).remove();
    });
  }

  public getSavedEventByKey(keyEvent:string):Promise<DataSnapshot> {
    this.loadUser();
    return this.db.object<EventModel>(`saved/${this.user.uid}`).query.orderByChild('key').equalTo(keyEvent).limitToFirst(1).get()
  }

  public getAllEvents():Observable<EventModel[]> {
    this.loadUser();
    return this.db.list<EventModel>('allevent').valueChanges();      
  }

  public getPersonalEvents(): Observable<SnapshotAction<EventModel>[]> {
    this.loadUser();
    return this.db.list<EventModel>(`event/${this.user.uid}`).snapshotChanges();
  }

  public getEventByKey(key:string):Observable<SnapshotAction<EventModel>> {
    this.loadUser();
    return this.db.object<EventModel>(`event/${key}`).snapshotChanges()
  }

  public getEventByName(name:string):Promise<DataSnapshot> {
    this.loadUser();
    return this.db.object<EventModel>(`allevent`).query.orderByChild('name').equalTo(name).limitToFirst(1).get();
  }

  public createEvent(event:CreateEvent):void{
    this.loadUser();
    this.placeService.findPlaceFromQuery({
      fields: [ "formatted_address", "name", "geometry" ] ,
      query: event.address,
      language: null,
      locationBias: null,
    }, (response, status) => {
      if(status === google.maps.places.PlacesServiceStatus.OK){
        event.latitude = response[0].geometry.location.lat();
        event.longitude = response[0].geometry.location.lng();
        let res = this.db.list(`event/${this.user.uid}`).push(event);
        this.createAllEvent(res.key, event);
      }        
    });
  }

  public updateEvent(key:string, event:CreateEvent):void{
    this.loadUser();
    this.placeService.findPlaceFromQuery({
      fields: [ "formatted_address", "name", "geometry" ] ,
      query: event.address,
      language: null,
      locationBias: null,
    }, (response, status) => {
      if(status === google.maps.places.PlacesServiceStatus.OK){
        event.latitude = response[0].geometry.location.lat();
        event.longitude = response[0].geometry.location.lng();
        this.db.list(`event/${this.user.uid}`).update(key, event);
        this.updateAllEvent(key, event);
      }        
    })
  }

  public deleteEvent(key:string):void{
    this.loadUser();
    this.db.object(`event/${this.user.uid}/${key}`).remove();
    this.deleteAllEvent(key);
  }

  public createAllEvent(key:string, event:CreateEvent){
    this.loadUser();
    const e:EventModel = this.getEventModel(key, event);
    this.db.list(`allevent`).push(e);
  }

  public updateAllEvent(key:string, event:CreateEvent){
    this.loadUser();
    const e:EventModel = this.getEventModel(key, event);
    this.db.object(`allevent`).query.orderByChild('key').equalTo(key).limitToFirst(1).get().then(event => {
      let keys = Object.keys(event.val())
      this.db.object(`allevent/${keys[0]}`).update(e);
    });
  }

  public deleteAllEvent(key:string){
    this.loadUser();
    this.db.object(`allevent`).query.orderByChild('key').equalTo(key).limitToFirst(1).get().then(event => {
      let keys = Object.keys(event.val())
      this.db.object(`allevent/${keys[0]}`).remove();
    });
  }

  private loadUser() {
    this.user = this.auth.getUserData();
  }

  private getEventModel(key:string, event:CreateEvent){
    return {
      address: event.address,
      details: event.details,
      key: key,
      latitude: event.latitude,
      longitude:event.longitude,
      name: event.name
    }
  }
}
