import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Data } from 'src/app/common/data';
import { getLastItem, getLastOrder, swapItems } from 'src/app/common/utils';
import { Rep } from 'src/app/model/rep';
import { Training } from 'src/app/model/training';
import { TrainingExercise } from 'src/app/model/training-exercise';
import { TrainingExerciseDialog } from 'src/app/pages/training-detail/dialog/training-exercise-dialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class TrainingDetailComponent implements OnInit {
  header: string
  data: Data = new Data()
  training: Training = new Training()
  exerciseDropdownOptions: object[] = []

  trainingExerciseDialog = new TrainingExerciseDialog()
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
    const id = this.route.snapshot.params['trainingId']
    this.getTraining(id)
    this.getExerciseDropdownOptions()
  }

  getTraining(id: string) {
    this.data.isLoading()

    this.dataService.get_Training_ById_Join_TrainingExercise_Join_Exercise(id).subscribe({
      next: (training) => {
        this.training = training
        this.header = training.name
        this.data.isData()
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training' })
        this.data.isError()
      }
    })
  }

  getExerciseDropdownOptions() {
    this.dataService.get_Exercise_DropdownOptions().subscribe({
      next: (exerciseDropdownOptions) => {
        this.exerciseDropdownOptions = exerciseDropdownOptions
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercise Dropdown Options' })
      }
    })
  }

  saveTraining() {
    let order = 0
    this.training.trainingExercises.forEach(trainingExercise => {
      trainingExercise.order = order
      order += 1
      this.dataService.patch(trainingExercise)
    })
    this.dataService.patch(this.training).subscribe({
      next: () => {
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Saved' })
        this.router.navigate(['training', this.training.id])
      }
    })
  }

  saveTrainingExercise() {
    if (this.trainingExerciseDialog.trainingExercise.trainingId !== undefined) {
      this.dataService.patch(this.trainingExerciseDialog.trainingExercise).subscribe({
        next: () => {
          this.trainingExerciseDialog = new TrainingExerciseDialog() // close dialog when save
          this.messageService.clear()
          this.messageService.add({severity: 'success', detail: 'Training Exercise Updated' })
        }
      })
      return
    }

    this.trainingExerciseDialog.trainingExercise.trainingId = this.training.id
    this.trainingExerciseDialog.trainingExercise.order = getLastOrder(this.training.trainingExercises)

    this.dataService.add(this.trainingExerciseDialog.trainingExercise).subscribe({
      next: () => {
        this.trainingExerciseDialog = new TrainingExerciseDialog() // close dialog when save
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Exercise Added' })
      }
    })
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Training ' + this.training.name,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteTraining()
      }
    });
  }

  deleteTraining() {
    const trainingProgramId = this.training.trainingProgramId
    this.dataService.delete_Training_Cascade_TrainingExercise(this.training).subscribe({
      next: () => this.router.navigate(['training-program', trainingProgramId])
    })
  }

  deleteTrainingExercise() {
    this.dataService.delete_TrainingExercise(this.trainingExerciseDialog.trainingExercise).subscribe({
      next: () => this.trainingExerciseDialog = new TrainingExerciseDialog()
    })
  }

  // Training Exercise Reps Dialog

  openTrainingExerciseAddDialog() {
    this.trainingExerciseDialog = new TrainingExerciseDialog()
    this.trainingExerciseDialog.visible = true
  }

  editTrainingExerciseAddDialog(trainingExercise: TrainingExercise) {
    this.trainingExerciseDialog = new TrainingExerciseDialog()
    this.trainingExerciseDialog.trainingExercise = TrainingExercise.deepcopy(trainingExercise)
    this.trainingExerciseDialog.header = "Edit Training Exercise"
    this.trainingExerciseDialog.visible = true
  }

  toggleEditRep(rep: Rep) {
    if (this.isEditingRep(rep)) 
      this.trainingExerciseDialog.rep = new Rep()
    else 
      this.trainingExerciseDialog.rep = Rep.deepcopy(rep)
  }

  isEditingRep(rep: Rep): boolean {
    return rep.order === this.trainingExerciseDialog.rep.order
  }

  isEditing(): boolean {
    return this.trainingExerciseDialog.rep.order !== undefined
  }

  addRep() {
    // add new rep in training exercise. keep the values in the dialog 
    const newRep = Rep.deepcopy(this.trainingExerciseDialog.rep)
    newRep.order = getLastOrder(this.trainingExerciseDialog.trainingExercise.reps)
    this.trainingExerciseDialog.trainingExercise.reps.push(newRep)
  }

  saveRep() {
    // update selected rep in training exercise. keep the values in the dialog 
    const toUpdateRep = this.trainingExerciseDialog.trainingExercise.reps.find(r => r.order === this.trainingExerciseDialog.rep.order)!!
    toUpdateRep.value = this.trainingExerciseDialog.rep.value
    toUpdateRep.max = this.trainingExerciseDialog.rep.max
    this.trainingExerciseDialog.rep = new Rep()
    this.trainingExerciseDialog.rep.value = toUpdateRep.value
    this.trainingExerciseDialog.rep.max = toUpdateRep.max
  }

  removeRep() {
    const toRemoveRep = this.trainingExerciseDialog.trainingExercise.reps.find(r => r.order === this.trainingExerciseDialog.rep.order)!!
    this.trainingExerciseDialog.trainingExercise.reps = this.trainingExerciseDialog.trainingExercise.reps.filter(rep => rep.order !== toRemoveRep.order)
    this.trainingExerciseDialog.rep = new Rep()
  }

  gotoTrainingProgramDetail() {
    this.router.navigate(['training-program', this.training.trainingProgramId])
  }

  // Training Exercise Order 

  toggleChangeTrainingExerciseOrder() {
    this.changeTrainingExerciseOrder = !this.changeTrainingExerciseOrder
  }

  isLastTrainingExercise(trainingExercise: TrainingExercise) {
    return trainingExercise.order === getLastItem(this.training.trainingExercises)?.order
  }

  orderDown(trainingExercise: TrainingExercise) {
    const index = this.training.trainingExercises.indexOf(trainingExercise)
    this.training.trainingExercises = swapItems(this.training.trainingExercises, index, index + 1)
  }

  isFirstTrainingExercise(trainingExercise: TrainingExercise) {
    return trainingExercise.order === 0
  }

  orderUp(trainingExercise: TrainingExercise) {
    const index = this.training.trainingExercises.indexOf(trainingExercise)
    this.training.trainingExercises = swapItems(this.training.trainingExercises, index, index - 1)
  }

}
