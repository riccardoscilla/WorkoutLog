import { Component, OnDestroy, OnInit } from '@angular/core';
// import { DataService } from 'src/app/service/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Data } from 'src/app/common/data';
import { ExerciseAddDialog } from 'src/app/pages/exercise-list/dialog/exercise-add-dialog';
import { DataService } from 'src/app/service/data.service';
import { Exercise } from '../../model/exercise';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: []
})
export class ExerciseListComponent implements OnInit, OnDestroy {
  data: Data = new Data()
  private exerciseSub: Subscription
  exercise: Exercise = new Exercise()

  private groupedExercisesSub: Subscription
  groupedExercises: Map<string, Exercise[]> = new Map()

  exerciseAddDialog: ExerciseAddDialog = new ExerciseAddDialog()
  groupDropdownOptions: object[] = []

  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getExercises()
    this.getGroupDropdownOptions()
  }

  ngOnDestroy(): void {
    if (this.exerciseSub) this.exerciseSub.unsubscribe()
    if (this.groupedExercisesSub) this.groupedExercisesSub.unsubscribe()
  }

  getExercises() {
    this.data.isLoading()

    this.exerciseSub = this.dataService.get_Exercise().subscribe({
      next: (groupedExercises) => {
        this.groupedExercises = groupedExercises
        this.data.isData()
      },
      error: (error) => {
        this.data.isError()
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercises' })
      }
    })
  }

  getGroupDropdownOptions() {
    this.groupedExercisesSub = this.dataService.get_Group_DropdownOptions().subscribe({
      next: (groupDropdownOptions) => {
        this.groupDropdownOptions = groupDropdownOptions
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Group Dropdown Options' })
      }
    })
  }

  openExerciseDialog() {
    this.exerciseAddDialog = new ExerciseAddDialog()
    this.exerciseAddDialog.visible = true
  }

  saveExercise() {
    this.dataService.add(this.exerciseAddDialog.exercise).subscribe({
      next: () => {
        this.exerciseAddDialog = new ExerciseAddDialog()
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Exercise Added' })
      }
    })
  }

  gotoExerciseDetail(exercise: Exercise) {
    this.router.navigate(["exercise", exercise.id])
  }

}
