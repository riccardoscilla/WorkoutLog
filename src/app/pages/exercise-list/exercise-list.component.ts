import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/service/firestore.service';
import { Exercise } from '../../model/exercise/exercise';
import { Firestore } from 'src/app/service/firestore.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { capitalizeWords, groupByKey } from 'src/app/common/utils';
import { DocumentData } from '@angular/fire/compat/firestore';
import { ExerciseAddDialog } from 'src/app/model/exercise/exercise-add-dialog';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: []
})
export class ExerciseListComponent implements OnInit {
  exercise: Exercise = new Exercise()
  exercises: Exercise[] = []
  exercisesGrouped: Map<string, Exercise[]> = new Map()

  exerciseAddDialog: ExerciseAddDialog = new ExerciseAddDialog()
  groupDropdownOptions: object[] = []

  constructor(
    private firestore: Firestore,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getExercises()
  }

  getExercises() {
    this.exercise.isLoading()

    this.firestore.getExercises().subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.exercise.isNoData()
        }
        else {
          this.exercises = response.map((data: DocumentData) => Exercise.fromSnapshot(data.payload.doc))
          this.exercisesGrouped = groupByKey(this.exercises, "group")
          this.setGroupDrowpdown()
          this.exercise.isData()
        }
      },
      error: (error) => {
        if (!this.authService.isLoggedIn)
          return
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercises' })
      }
    })
  }

  setGroupDrowpdown() {
    this.groupDropdownOptions = []
    this.exercisesGrouped.forEach((value: Exercise[], key: string) => {
      const option = {
        label: capitalizeWords(key),
        id: key
      }
      this.groupDropdownOptions.push(option)
    });
  }

  openExerciseDialog() {
    this.exerciseAddDialog = new ExerciseAddDialog()
    this.exerciseAddDialog.visible = true
  }

  saveExercise() {
    this.firestore.addExercise(this.exerciseAddDialog.exercise)
      .then(() => {
        this.exerciseAddDialog = new ExerciseAddDialog()
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Exercise Added' })
      })
  }

  gotoExerciseDetail(exercise: Exercise) {
    this.router.navigate([exercise.id], { relativeTo: this.route })
  }

}
