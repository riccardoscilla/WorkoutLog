import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../model/exercise';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, DocumentData, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  getExercises(): Observable<Exercise[]> {
    const user = this.authService.userInLocalStorage

    return new Observable(observer => {
      this.firestore.collection('user').doc(user.uid).collection('exercise').get().subscribe({
        next: (response: QuerySnapshot<DocumentData>) => {
          const exercises = response.docs.map((data: DocumentData) => Exercise.fromSnapshot(data.payload.doc))
          observer.next(exercises)   
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  // getExercise(exerciseId: string): Observable<Exercise> {
  //   const user = this.authService.userInLocalStorage;
  
  //   return new Observable(observer => {
  //     const exerciseRef = this.firestore.collection('user').doc(user.uid).collection('exercise').doc(exerciseId).ref;
      
  //     exerciseRef.get().then((doc: DocumentSnapshot<DocumentData>) => {
  //       if (doc.exists) {
  //         const exercise = Exercise.fromSnapshot(doc);
  //         observer.next(exercise);
  //       } else {
  //         observer.error(new Error("Exercise not found"));
  //       }
  //     }).catch((error) => {
  //       observer.error(error);
  //     });
  //   });
  // }
}
