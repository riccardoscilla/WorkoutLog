import { Component } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { capitalizeWords, groupByKey } from 'src/app/common/utils';
import { Exercise } from 'src/app/model/exercise/exercise';
import { Firestore } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class ExerciseDetailComponent {
  header: String = "Exercise Detail"
  exercise: Exercise = new Exercise()
  exercises: Exercise[] = []
  exercisesGrouped: Map<string, Exercise[]> = new Map()
  groupDropdownOptions: object[] = []
  
  constructor(
    private firestore: Firestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['exerciseId']
    this.getExercise(id)
    this.getExercises()
  }

  getExercise(id: string) {
    this.exercise.isLoading()

    this.firestore.getExercise(id).subscribe({
      next: (response) => {
        if (!response.payload.exists) {
          this.exercise.isNoData()
        }
        else {
          this.exercise = Exercise.fromSnapshot(response.payload)
          this.header = capitalizeWords(this.exercise.name)
          this.exercise.isData()
        }
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercise' })
      }
    })
  }

  getExercises() {
    this.firestore.getExercises().subscribe({
      next: (response) => {
        if (response.length === 0) {
          return
        }
        else {
          this.exercises = response.map((data: DocumentData) => Exercise.fromSnapshot(data.payload.doc))
          this.exercisesGrouped = groupByKey(this.exercises, "group")

          this.groupDropdownOptions = []
          this.exercisesGrouped.forEach((value: Exercise[], key: string) => {
            const option = {
              label: capitalizeWords(key),
              id: key
            }
            this.groupDropdownOptions.push(option)
          });
        }
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercises' })
      }
    })
  }

  saveExercise() {
    this.firestore.patchExercise(this.exercise)
      .then(() => {
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Exercise Saved'})
        this.router.navigate(['exercise', this.exercise.id])
      })
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Exercise ' + capitalizeWords(this.exercise.name),
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteExercise()
      }
    });
  }

  deleteExercise() {
    this.firestore.deleteExercise(this.exercise)
      .then(() => this.gotoExerciseList())
  }

  gotoExerciseList() {
    this.router.navigate(['exercise'])
  }

}
