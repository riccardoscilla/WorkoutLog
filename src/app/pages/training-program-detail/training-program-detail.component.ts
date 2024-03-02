import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { getLastItem, getLastOrder, sortByKey, swapItems } from 'src/app/common/utils';
import { TrainingProgram } from 'src/app/model/training-program';
import { Training } from 'src/app/model/training';
import { TrainingAddDialog } from 'src/app/pages/training-program-detail/dialog/training-add-dialog';
import { DataService } from 'src/app/service/data.service';
import { Firestore } from 'src/app/service/firestore.service';
import { Data } from 'src/app/common/data';

@Component({
  selector: 'app-training-program-detail',
  templateUrl: './training-program-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class TrainingProgramDetailComponent implements OnInit {
  header: string
  data: Data = new Data()
  trainingProgram: TrainingProgram = new TrainingProgram()

  trainingAddDialog = new TrainingAddDialog()
  changeTrainingOrder = false

  constructor(
    public authService: AuthService,
    private firestore: Firestore,
    private dataService: DataService,
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
    this.data.isLoading()

    this.dataService.get_TrainingProgram_ById_Join_Training(id).subscribe({
      next: (trainingProgram) => {
        this.trainingProgram = trainingProgram
        this.header = trainingProgram.name
        this.data.isData()
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Program' })
        this.data.isError()
      }
    })
  }

  saveTrainingProgram() {
    let order = 0
    this.trainingProgram.trainings.forEach(training => {
      training.order = order
      order += 1
      this.dataService.patch(training)
    })
    this.dataService.patch(this.trainingProgram).subscribe({
      next: () => {
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Program Saved'})
        this.router.navigate(['training-program', this.trainingProgram.id])
      }
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
    this.dataService.delete_TrainingProgram_Cascade_Training(this.trainingProgram).subscribe({
      next: () => this.gotoTrainingProgramList()
    })
  }

  saveTraining() {
    this.trainingAddDialog.training.trainingProgramId = this.trainingProgram.id
    this.trainingAddDialog.training.order = getLastOrder(this.trainingProgram.trainings)

    this.dataService.add(this.trainingAddDialog.training).subscribe({
      next: () => {
        this.trainingAddDialog = new TrainingAddDialog()
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Added' })
      }
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
    const names = this.trainingProgram.trainings.map(training => training.name)
    return names.includes(this.trainingAddDialog.training.name.trim())
  }

  // Training Order 

  toggleChangeTrainingOrder() {
    this.changeTrainingOrder = !this.changeTrainingOrder
  }
  
  isLastTraining(training: Training) {
    return training.order === getLastItem(this.trainingProgram.trainings)?.order
  }

  orderDown(training: Training) {
    const index = this.trainingProgram.trainings.indexOf(training)
    this.trainingProgram.trainings = swapItems(this.trainingProgram.trainings, index, index + 1)
  }

  isFirstTraining(training: Training) {
    return training.order === 0
  }

  orderUp(training: Training) {
    const index = this.trainingProgram.trainings.indexOf(training)
    this.trainingProgram.trainings = swapItems(this.trainingProgram.trainings, index, index - 1)
  }
  
}
