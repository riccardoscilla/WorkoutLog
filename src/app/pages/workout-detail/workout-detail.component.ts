import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Data } from 'src/app/common/data';
import { formatDate } from 'src/app/common/utils';
import { TrainingExerciseLog } from 'src/app/model/training-exercise-log';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class WorkoutDetailComponent implements OnInit {
  date: Date
  data: Data = new Data()
  trainingExerciseLog: TrainingExerciseLog = new TrainingExerciseLog()

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const dateString = this.route.snapshot.params['date']
    const id = this.route.snapshot.params['trainingExerciseLogId']

    this.date = new Date(dateString)
    this.getTrainingExercises(id)
  }

  getTrainingExercises(id: string) {
    this.data.isLoading()

    this.dataService.get_TrainingExerciseLog(id).subscribe({
      next: (trainingExerciseLog) => {
        this.trainingExerciseLog = trainingExerciseLog
        this.data.isData()
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Exercise Log' })
        this.data.isError()
      }
    })
  }



  gotoWorkout() {
    this.router.navigate(['workout', formatDate(this.date)])
  }
}
