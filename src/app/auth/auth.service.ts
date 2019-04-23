import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import * as firebase from 'firebase';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { activarLoadingAction, DesActivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction, UnSetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {

      this.afAuth.authState.subscribe( (fbUser: firebase.User)  => {
        if( fbUser ) {
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe( (usuarioObj: any) => {
            const newUser = new User(usuarioObj)
            this.store.dispatch( new SetUserAction(newUser))
            this.usuario = newUser;
          })
        } else {
          this.usuario = null;
          this.userSubscription.unsubscribe();

        }
      })
  }


  crearUsuario( nombre: string, email: string, password: string ) {

    this.store.dispatch( new activarLoadingAction() )
    this.afAuth.auth.createUserWithEmailAndPassword( email, password)
    .then( resp => {

      const user: User =  {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      };

      this.afDB.doc(`${ user.uid }/usuario`)
        .set( user ).then(() => {
      this.router.navigate(['/']);
      this.store.dispatch( new DesActivarLoadingAction() )
    });
    
    })
    .catch(error => {
      console.error(error);
      this.store.dispatch( new DesActivarLoadingAction() )
      Swal.fire({
        title: 'Error!',
        text: 'Error en el login',
        type: 'error',
        confirmButtonText: 'Cool'
      })
    })
  }

  login( email: string, password: string){
    
   this.store.dispatch( new activarLoadingAction() );
   this.afAuth.auth.signInWithEmailAndPassword(email, password)
   .then(resp => {
    this.store.dispatch( new DesActivarLoadingAction() );
    this.router.navigate(['/']);
    })
   .catch(error => {
    this.store.dispatch( new DesActivarLoadingAction() );
    Swal.fire({
       title: 'Ups....',
       text: 'Error en el login',
       type: 'error',
       confirmButtonText: 'OK'
     })

   });
  }

  logOut() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
    this.store.dispatch( new UnSetUserAction());
  }

  isAuth() {
    return this.afAuth.authState.pipe(map( fbUser => {

      if( fbUser == null) {
        this.router.navigate(['/login'])
      }
      return fbUser != null;
      })
    );
  }

  getUsuario() {
    return {...this.usuario};
  }
}
