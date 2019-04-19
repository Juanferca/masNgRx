import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import * as firebase from 'firebase';
import { User } from './user.model';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore) { }

  initAuthListener() {

      this.afAuth.authState.subscribe( (fbUser: firebase.User)  => {
        console.log(fbUser);
      })
  }


  crearUsuario( nombre: string, email: string, password: string ) {
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
    });
    
    })
    .catch(error => {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Error en el login',
        type: 'error',
        confirmButtonText: 'Cool'
      })
    })
  }

  login( email: string, password: string){
   this.afAuth.auth.signInWithEmailAndPassword(email, password)
   .then(resp => {
     this.router.navigate(['/']);
    })
   .catch(error => {
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
}
