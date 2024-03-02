import { Component, Input } from '@angular/core';
import { TrainingExercise } from 'src/app/model/training-exercise';

@Component({
  selector: 'app-training-exercise-detail',
  templateUrl: './training-exercise-detail.component.html',
  styleUrls: []
})
export class TrainingExerciseDetailComponent {

  @Input() trainingExercise: TrainingExercise
  
}
