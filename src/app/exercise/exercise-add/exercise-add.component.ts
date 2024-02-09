import { Component } from '@angular/core';
import { Exercise } from '../../model/exercise/exercise';
// import { DataService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.component.html',
  styleUrls: ['./exercise-add.component.scss']
})
export class ExerciseAddComponent {

  exercise: Exercise = new Exercise()

  constructor(
    // public dataService: DataService
  ) { }

  addExercise() {
    if (!this.exercise.isValid()) 
      return
    // this.dataService.addExercise(this.exercise)
  }
}
