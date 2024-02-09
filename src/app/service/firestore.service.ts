import { Injectable } from '@angular/core';
import { AngularFirestore, PERSISTENCE_SETTINGS } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Exercise } from '../model/exercise/exercise';
import { TrainingProgram } from '../model/training-program/training-program';
import { Training } from '../model/training/training';
import { TrainingExercise } from '../model/training-exercise/training-exercise';

@Injectable({
  providedIn: 'root'
})
export class Firestore {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  // Exercise

  getExercises() {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('exercise').snapshotChanges()
  }

  addExercise(exercise: Exercise) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('exercise').add({...exercise})
  }

  // Training Program

  getTrainingPrograms() {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingProgram').snapshotChanges()
  }

  getTrainingProgram(trainingProgramId: string) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingProgram').doc(trainingProgramId).snapshotChanges()
  }

  addTrainingProgram(trainingProgram: TrainingProgram) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingProgram').add(trainingProgram.toDocument())
  }

  patchTrainingProgram(trainingProgram: TrainingProgram) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingProgram').doc(trainingProgram.id).update(trainingProgram.toDocument())
  }

  deleteTrainingProgram(trainingProgram: TrainingProgram) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingProgram').doc(trainingProgram.id).delete()
  }

  // Training

  getTrainings() {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('training').snapshotChanges()
  }

  getTraining(trainingId: string) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('training').doc(trainingId).snapshotChanges()
  }

  getTrainingsOfTrainingProgram(trainingProgramId: string) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('training', ref => ref.where("trainingProgramId", "==", trainingProgramId)).snapshotChanges()
  }

  addTraining(training: Training) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('training').add(training.toDocument())
  }

  patchTraining(training: Training) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('training').doc(training.id).update(training.toDocument())
  }

  deleteTraining(training: Training) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('training').doc(training.id).delete()
  }

  // Training Exercise

  getTrainingExercises() {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingExercise').snapshotChanges()
  }

  getTrainingExercisesOfTraining(trainingId: string) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingExercise', ref => ref.where("trainingId", "==", trainingId)).snapshotChanges()
  }

  addTrainingExercise(trainingExercise: TrainingExercise) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingExercise').add(trainingExercise.toDocument())
  }

  patchTrainingExercise(trainingExercise: TrainingExercise) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingExercise').doc(trainingExercise.id).update(trainingExercise.toDocument())
  }

  deleteTrainingExercise(trainingExercise: TrainingExercise) {
    const user = this.authService.userInLocalStorage
    return this.firestore.collection('user').doc(user.uid).collection('trainingExercise').doc(trainingExercise.id).delete()
  }

}
