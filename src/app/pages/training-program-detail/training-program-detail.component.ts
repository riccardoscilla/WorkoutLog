import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { getLastItem, getLastOrder, sortByProperty, swapItems } from 'src/app/common/utils';
import { TrainingProgram } from 'src/app/model/training-program/training-program';
import { Training } from 'src/app/model/training/training';
import { TrainingAddDialog } from 'src/app/model/training/training-add-dialog';
import { Firestore } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-training-program-detail',
  templateUrl: './training-program-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class TrainingProgramDetailComponent implements OnInit {
  header: String = "Training Program Detail"
  trainingProgram: TrainingProgram = new TrainingProgram()
  trainings: Training[] = []

  trainingAddDialog = new TrainingAddDialog()
  changeTrainingOrder = false

  constructor(
    public authService: AuthService,
    private firestore: Firestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['trainingProgramId']
    this.getTrainingProgram(id)
  }

  getTrainingProgram(id: string) {
    this.trainingProgram.isLoading()

    this.firestore.getTrainingProgram(id).subscribe({
      next: (response) => {
        if (!response.payload.exists) {
          this.trainingProgram.isNoData()
        }
        else {
          this.trainingProgram = TrainingProgram.fromSnapshot(response.payload)
          this.header = this.trainingProgram.name
          this.trainingProgram.isData()
          this.getTrainings()
        }
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Program' })
      }
    })
  }

  getTrainings() {
    this.firestore.getTrainingsOfTrainingProgram(this.trainingProgram.id).subscribe({
      next: (response) => {
        this.trainings = response.map((data: DocumentData) => Training.fromSnapshot(data.payload.doc))
        this.trainings = sortByProperty(this.trainings, 'order')
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Trainings' })
      }
    })
  }

  saveTrainingProgram() {
    let order = 0
    this.trainings.forEach(training => {
      training.order = order
      order += 1
      this.firestore.patchTraining(training)
    })
    this.firestore.patchTrainingProgram(this.trainingProgram)
      .then(() => {
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Program Saved'})
        this.router.navigate(['training-program', this.trainingProgram.id])
      })
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Training Program ' + this.trainingProgram.name,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteTrainingProgram()
      }
    });
  }

  deleteTrainingProgram() {
    this.firestore.deleteTrainingProgram(this.trainingProgram)
      .then(() => this.gotoTrainingProgramList())
  }

  saveTraining() {
    this.trainingAddDialog.training.trainingProgramId = this.trainingProgram.id
    this.trainingAddDialog.training.order = getLastOrder(this.trainings)
    this.firestore.addTraining(this.trainingAddDialog.training)
      .then(() => {
        this.trainingAddDialog = new TrainingAddDialog()
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Added' })
      })
  }
  
  openTrainingAddDialog() {
    this.trainingAddDialog.visible = true
  }

  gotoTrainingProgramList() {
    this.router.navigate(['training-program'])
  }

  gotoTrainingDetail(training: Training) {
    this.router.navigate(['training', training.id])
  }

  alreadyChoosedTraining(): boolean {
    const names = this.trainings.map(training => training.name)
    return names.includes(this.trainingAddDialog.training.name.trim())
  }

  // Training Order 

  toggleChangeTrainingOrder() {
    this.changeTrainingOrder = !this.changeTrainingOrder
  }
  
  isLastTraining(training: Training) {
    return training.order === getLastItem(this.trainings)?.order
  }

  orderDown(training: Training) {
    const index1 = this.trainings.indexOf(training)
    this.trainings = swapItems(this.trainings, index1, index1 + 1)
  }

  isFirstTraining(training: Training) {
    return training.order === 0
  }

  orderUp(training: Training) {
    const index1 = this.trainings.indexOf(training)
    this.trainings = swapItems(this.trainings, index1, index1 - 1)
  }
  
}
