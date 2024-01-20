import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonSlides } from '@ionic/angular';

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {
  @ViewChild('slides') slides: IonSlides;
  public wavesPosition: number = 0;
  public wavesDifference: number = 80;
  public formLogin: FormGroup<LoginForm>;
  public formRegister: FormGroup<LoginForm>;

  constructor(private authService: AuthService, private formBuilder:FormBuilder ) {
    this.formLogin = this.initializeForm();
    this.formRegister = this.initializeForm();
  }

  ngOnInit() {
  }

  initializeForm():FormGroup{
    return this.formBuilder.group<LoginForm>({
      email: new FormControl('', {nonNullable: false}),
      password: new FormControl('', {nonNullable: false}),
    })
  }

  segmentChanged(event: any) {
    if (event.detail.value === "login") {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async login(){
    let user = this.convertFormToEvent(this.formLogin);
    try{
    await this.authService.logIn(user.email, user.password);
  } catch(error){
    console.error(error);
  }
  };

  async register(){
    let user = this.convertFormToEvent(this.formRegister);
    try{
      await this.authService.createUser(user.email, user.password);
    }catch(error){
    console.error(error);
    }
  };

  private convertFormToEvent(eventForm:FormGroup<LoginForm>):User{
    let user: User = new User();
    user.email = eventForm.value.email;
    user.password = eventForm.value.password;
    return user;
  }
};

