import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { formatDate, getLastItem, swapItems } from 'src/app/common/utils';
import { TrainingExerciseLog } from 'src/app/model/training-exercise-log';
import { DataService } from 'src/app/service/data.service';
import { WorkoutAddDialog } from './dialog/workout-add-dialog';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class WorkoutComponent implements OnInit {
  trainingExerciseLogs: TrainingExerciseLog[] = []
  trainingDropdownOptions: object[] = []

  workoutAddDialog: WorkoutAddDialog = new WorkoutAddDialog()
  date: Date

  changeTrainingExerciseOrder = false

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.handleDate().subscribe({
      next: () => {
        this.getTrainingExercisesInDate()
        this.getTrainingDropdownOptions()
      }
    })
  }

  /**
   * 1. get training log based on selected date. 
   * 2. change training log if 
   */

  private handleDate(): Observable<void> {
    return new Observable(observer => {
      this.route.queryParams.subscribe(params => {
        const dateString = params['date']
        if (dateString) {
          this.date = new Date(dateString)
        } else {
          this.date = new Date()
          this.updateUrlWithDate()
        }
        observer.next()
      });
    });
  }


  getTrainingExercisesInDate() {
    this.dataService.get_TrainingExerciseLog_InDate(this.date).subscribe({
      next: (trainingExerciseLogs) => {
        this.trainingExerciseLogs = trainingExerciseLogs
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Exercise Logs' })
      }
    })
  }

  getTrainingDropdownOptions() {
    this.dataService.get_Training_DropdownOptions().subscribe({
      next: (trainingDropdownOptions) => {
        this.trainingDropdownOptions = trainingDropdownOptions
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Dropdown Options' })
      }
    })
  }

  addTrainingExerciseLogFromTraining() {
    this.dataService.get_Training_ById_Join_TrainingExercise(this.workoutAddDialog.training.id).subscribe({
      next: (training) => {
        training.trainingExercises.forEach(trainingExercise => {
          const trainingExerciseLog = TrainingExerciseLog.fromTrainingExercise(trainingExercise, this.date)
          this.dataService.add(trainingExerciseLog).subscribe()
        })
        this.workoutAddDialog = new WorkoutAddDialog()
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Trainings' })
      }
    })
  }

  openWorkoutAddDialog() {
    this.workoutAddDialog.visible = true
  }

  // save

  saveTrainingExerciseLogs() {
    let order = 0
    this.trainingExerciseLogs.forEach(tel => {
      tel.order = order
      order += 1
      this.dataService.patch(tel).subscribe()
    })
  }

  // remove all 

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete all Logs',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteAllLog()
      }
    });
  }

  deleteAllLog() {
    this.trainingExerciseLogs.forEach(tel => this.dataService.delete(tel).subscribe())
    this.getTrainingExercisesInDate()
  }

  // date calendar

  private updateUrlWithDate(): void {
    const formattedDate = formatDate(this.date);
    this.router.navigate(["workout"], { queryParams: { date: formattedDate } })
  }

  minusDay() {
    let timestamp = this.date.getTime()
    let oneDayInMilliseconds = 24 * 60 * 60 * 1000
    let newTimestamp = timestamp - oneDayInMilliseconds
    this.date = new Date(newTimestamp)
    this.updateUrlWithDate()
  }
 
  plusDay() {
    let timestamp = this.date.getTime()
    let oneDayInMilliseconds = 24 * 60 * 60 * 1000
    let newTimestamp = timestamp + oneDayInMilliseconds
    this.date = new Date(newTimestamp)
    this.updateUrlWithDate()
  }

  setToday() {
    this.date = new Date()
    this.updateUrlWithDate()
  }

  setDate() {
    this.updateUrlWithDate()
  }


  // Training Order 

  toggleChangeTrainingExerciseOrder() {
    this.changeTrainingExerciseOrder = !this.changeTrainingExerciseOrder
  }
  
  isLastTrainingExercise(tel: TrainingExerciseLog) {
    return tel.order === getLastItem(this.trainingExerciseLogs)?.order
  }

  orderDown(tel: TrainingExerciseLog) {
    const index = this.trainingExerciseLogs.indexOf(tel)
    this.trainingExerciseLogs = swapItems(this.trainingExerciseLogs, index, index + 1)
  }

  isFirstTrainingExercise(tel: TrainingExerciseLog) {
    return tel.order === 0
  }

  orderUp(tel: TrainingExerciseLog) {
    const index =  this.trainingExerciseLogs.indexOf(tel)
    this.trainingExerciseLogs = swapItems(this.trainingExerciseLogs, index, index - 1)
  }

}
