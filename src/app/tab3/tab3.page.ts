import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EventService } from '../events/services/event.service';
import { EventModel } from '../events/models/event'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SnapshotAction } from '@angular/fire/compat/database';
import { AuthService } from '../auth/services/auth.service';


export interface EventForm{
    key: FormControl<string>;
    name: FormControl<string>;
    address: FormControl<string>;
    details: FormControl<string>;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  events: Observable<SnapshotAction<EventModel>[]>;
  form:FormGroup<EventForm>;
  update:FormGroup<EventForm>;
  isModalOpen = false;

  constructor(private eventService:EventService, private formBuilder: FormBuilder, private auth:AuthService) {
    this.events = eventService.getPersonalEvents();
    this.form = this.initializeForm();
    this.update = this.initializeForm();
  }

  async logout(){
    await this.auth.logOut();
  }

  create(event:FormGroup){
    this.eventService.createEvent(event.value);
    this.form = this.initializeForm();
  }

  updateEvent(event:FormGroup<EventForm>){
    this.eventService.updateEvent(event.value.key, this.convertFormToEvent(event));
    this.setOpen(false);
  }

  deleteEvent(key:string){
    this.eventService.deleteEvent(key);
  }

  initializeForm():FormGroup{
    return this.formBuilder.group<EventForm>({
      address: new FormControl('', {nonNullable: true}),
      details: new FormControl('', {nonNullable: false}),
      key: new FormControl('', {nonNullable: false}),
      name: new FormControl('', {nonNullable: true}),
    })
  }

  populateUpdateForm(eventForm:EventModel, key:string):void{
    this.update = this.formBuilder.group<EventForm>({
      address: new FormControl(eventForm.address, {nonNullable: true}),
      details: new FormControl(eventForm.details, {nonNullable: false}),
      key: new FormControl(key, {nonNullable: false}),
      name: new FormControl(eventForm.name, {nonNullable: true}),
    })  
  }

  private convertFormToEvent(eventForm:FormGroup<EventForm>):EventModel{
    let event: EventModel = new EventModel();
    event.name = eventForm.value.name;
    event.address = eventForm.value.address;
    event.details = eventForm.value.details;
    return event;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
