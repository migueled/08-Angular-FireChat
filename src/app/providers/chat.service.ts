import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import{ Mensaje }from '../interface/mensaje.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {}

  constructor(private afs: AngularFirestore,
              public auth: AngularFireAuth) {
                
                this.auth.authState.subscribe( user => {
                  
                  console.log('estado del usuario ', user);
                  if( !user ){
                    return ;
                  }
                  this.usuario.nombre = user.displayName;
                  this.usuario.uid = user.uid;
                  
                });

              }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', referencia => referencia.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges()
    .pipe(map( (mensajes: Mensaje[]) => {
      this.chats = [];
      
      for( let mensaje of mensajes ){
        this.chats.unshift( mensaje );
      }

      return this.chats;
    }));
  }

  agregarMensaje( texto: string ){
    // UID del user falta
    let mensaje:Mensaje = {
      nombre: 'Miguel',
      mensaje: texto,
      fecha: new Date().getTime()
    }

    return this.itemsCollection.add( mensaje );
  }

  login( proveedor:string ) {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  
  logout() {
    this.auth.signOut();
  }
}
