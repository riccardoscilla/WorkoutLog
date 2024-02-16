import { Component, OnInit } from '@angular/core';
import { TrainingProgram } from 'src/app/model/training-program/training-program';
import { TrainingProgramAddDialog } from 'src/app/model/training-program/training-program-add-dialog';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore } from 'src/app/service/firestore.service';
import { DocumentData } from '@angular/fire/compat/firestore';
import { sortByKey } from 'src/app/common/utils';
import { Training } from 'src/app/model/training/training';

@Component({
  selector: 'app-training-program-list',
  templateUrl: './training-program-list.component.html',
  styleUrls: [],
  providers: [MessageService]
})
export class TrainingProgramListComponent implements OnInit {
  trainingProgram: TrainingProgram = new TrainingProgram()
  trainingPrograms: TrainingProgram[] = []
  trainings: Training[] = []
  trainingProgramAddDialog: TrainingProgramAddDialog = new TrainingProgramAddDialog()

  constructor(
    private firestore: Firestore,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTrainingPrograms()
    this.getTrainings()
  }

  getTrainingPrograms() {
    this.trainingProgram.isLoading()

    this.firestore.getTrainingPrograms().subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.trainingProgram.isNoData()
        }
        else {
          this.trainingPrograms = response.map((data: DocumentData) => TrainingProgram.fromSnapshot(data.payload.doc))
          this.trainingPrograms = sortByKey(this.trainingPrograms, 'date')
          this.trainingProgram.isData()
        }
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Programs' })
      }
    })
  }

  getTrainings() {
    this.firestore.getTrainings().subscribe({
      next: (response) => {
        this.trainings = response.map((data: DocumentData) => Training.fromSnapshot(data.payload.doc))
        this.trainings = sortByKey(this.trainings, 'order')
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Trainings' })
      }
    })
  }

  getTrainingsOf(trainingProgram: TrainingProgram): Training[] {
    return this.trainings.filter(training => training.trainingProgramId === trainingProgram.id)
  }

  gotoTrainingProgramDetail(trainingProgram: TrainingProgram) {
    this.router.navigate([trainingProgram.id], { relativeTo: this.route })
  }

  openTrainingProgramDialog() {
    this.trainingProgramAddDialog.visible = true
  }

  saveTrainingProgram() {
    this.firestore.addTrainingProgram(this.trainingProgramAddDialog.trainingProgram)
      .then(() => {
        this.trainingProgramAddDialog = new TrainingProgramAddDialog()
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Program Added' })
      })
  }

  gotoTrainingDetail(training: Training) {
    this.router.navigate(['training', training.id])
  }

}
