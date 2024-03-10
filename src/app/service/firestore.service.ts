import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentData, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { toCamelCase } from '../common/utils';
import { Document } from '../model/_document';
import { FireQuery, FireQueryWhere } from './FireQuery';

@Injectable({
  providedIn: 'root'
})
export class Firestore {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  whereBuilder(ref: CollectionReference<DocumentData>, where: FireQueryWhere[]): Query<DocumentData> {
    let q: Query<DocumentData> = ref
    where.forEach(w => {
      q = q.where(w.param, w.comparator, w.value)
    })
    return q
  }

  get<T extends Document>(query: FireQuery<T>): Observable<T[]> {
    return new Observable(observer => {

      if (query.whereParam.length > 0 && query.whereParam[0].param === "id") {
        this.getSingle(query).subscribe({
          next: (response) => observer.next([response]),
          error: (error) => observer.error(error)
        })
      } else {
        this.getMultiple(query).subscribe({
          next: (response) => observer.next(response),
          error: (error) => observer.error(error)
        })
      }

    })
  }

  getMultiple<T extends Document>(query: FireQuery<T>): Observable<T[]> {
    return new Observable(observer => {
      const user = this.authService.userInLocalStorage
  
      this.firestore.collection('user').doc(user.uid)
        .collection(query.fromParam, ref => this.whereBuilder(ref, query.whereParam))
        .snapshotChanges()
        .subscribe({
          next: (response) => {
            // console.log(query, response)
            if (response.length !== 0 && response[0].type !== "added")
              return
            const mappedData = response.map((data: DocumentData) => new query.type().fromSnapshot(data.payload.doc) as T)
            observer.next(mappedData)   
          },
          error: (error) => {
            observer.error(error)
          }
        })
    })
  }

  getSingle<T extends Document>(query: FireQuery<T>): Observable<T> {
    return new Observable(observer => {
      const user = this.authService.userInLocalStorage;
      const docId = query.whereParam[0].value as string

      this.firestore.collection('user').doc(user.uid)
        .collection(query.fromParam).doc(docId)
        .snapshotChanges()
        .subscribe({
          next: (response) => {
            // console.log(query, response)
            if (response.type !== "added")
              return
            const mappedData = new query.type().fromSnapshot(response.payload) as T
            observer.next(mappedData)   
          },
          error: (error) => {
            observer.error(error)
          }
        })
    })
  }

  add<T extends Document>(obj: T) {
    const user = this.authService.userInLocalStorage;
    const collectionName = FireQuery.objectToCollection(obj)
    return this.firestore.collection('user').doc(user.uid).collection(collectionName).add(obj.toDocument());
  }

  patch<T extends Document>(obj: T) {
    const user = this.authService.userInLocalStorage;
    const collectionName = FireQuery.objectToCollection(obj)
    return this.firestore.collection('user').doc(user.uid).collection(collectionName).doc(obj.id).update(obj.toDocument())
  }

  delete<T extends Document>(obj: T) {
    const user = this.authService.userInLocalStorage;
    const collectionName = FireQuery.objectToCollection(obj)
    return this.firestore.collection('user').doc(user.uid).collection(collectionName).doc(obj.id).delete()
  }

}
