import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {


  cargando: boolean;
  Subscription: Subscription = new Subscription();

  constructor(public authService: AuthService,
              public store: Store<AppState>  ) { }

  ngOnInit() {
    this.Subscription =  this.store.select('ui').subscribe( ui =>  this.cargando = ui.isLoading);
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  onSubmit( data:any){
    console.log(data)
    this.authService.crearUsuario( data.nombre, data.email, data.password)
  }

}
