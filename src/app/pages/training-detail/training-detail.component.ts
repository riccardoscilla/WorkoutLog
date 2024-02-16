import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { retry } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { capitalizeWords, getContrastColor, getLastItem, getLastOrder, groupByKey, sortByKey, swapItems } from 'src/app/common/utils';
import { Exercise } from 'src/app/model/exercise/exercise';
import { Rep } from 'src/app/model/training-exercise/rep';
import { TrainingExercise } from 'src/app/model/training-exercise/training-exercise';
import { TrainingExerciseAddDialog } from 'src/app/model/training-exercise/training-exercise-add-dialog';
import { Training } from 'src/app/model/training/training';
import { Firestore } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class TrainingDetailComponent implements OnInit {
  header: String = "Training Program Detail"
  training: Training = new Training()
  trainingExercises: TrainingExercise[] = []

  exercises: Exercise[] = []
  exerciseDropdownOptions: object[] = []

  trainingExerciseAddDialog = new TrainingExerciseAddDialog()
  changeTrainingExerciseOrder = false

  constructor(
    public authService: AuthService,
    private firestore: Firestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['trainingId']
    this.getTraining(id)
    this.getExercises()
  }

  getTraining(id: string) {
    this.training.isLoading()

    this.firestore.getTraining(id).subscribe({
      next: (response) => {
        if (!response.payload.exists) {
          this.training.isNoData()
        }
        else {
          this.training = Training.fromSnapshot(response.payload)
          this.header = this.training.name
          this.training.isData()
          this.getTrainingExercises()
        }
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training' })
      }
    })
  }

  getTrainingExercises() {
    this.firestore.getTrainingExercisesOfTraining(this.training.id).subscribe({
      next: (response) => {
        this.trainingExercises = response.map((data: DocumentData) => TrainingExercise.fromSnapshot(data.payload.doc))
        this.trainingExercises = sortByKey(this.trainingExercises, 'order')
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Training Exercises' })
      }
    })
  }

  getExercises() {
    this.firestore.getExercises().subscribe({
      next: (response) => {
        this.exercises = response.map((data: DocumentData) => Exercise.fromSnapshot(data.payload.doc))         
        this.exerciseDropdownOptions = []

        groupByKey(this.exercises, 'group').forEach((value: Exercise[], key: string) => {
          const option = {
            label: capitalizeWords(key),
            items: [] as object[]
          }
          value.forEach(exercise => option.items.push({
            label: capitalizeWords(exercise.name),
            id: exercise.id,
            data: exercise
          }))
          this.exerciseDropdownOptions.push(option)
        });
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercises' })
      }
    })
  }

  saveTraining() {
    let order = 0
    this.trainingExercises.forEach(trainingExercise => {
      trainingExercise.order = order
      order += 1
      this.firestore.patchTrainingExercise(trainingExercise)
    })
    this.firestore.patchTraining(this.training)
      .then(() => {
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Saved' })
        this.router.navigate(['training', this.training.id])
      })
  }

  saveTrainingExercise() {
    if (this.trainingExerciseAddDialog.trainingExercise.trainingId !== undefined) {
      this.firestore.patchTrainingExercise(this.trainingExerciseAddDialog.trainingExercise)
      .then(() => {
        this.trainingExerciseAddDialog = new TrainingExerciseAddDialog() // close dialog when save
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Exercise Updated' })
      })
      return
    }

    this.trainingExerciseAddDialog.trainingExercise.trainingId = this.training.id
    this.trainingExerciseAddDialog.trainingExercise.order = getLastOrder(this.trainingExercises)

    console.log(this.trainingExerciseAddDialog.trainingExercise)
    this.firestore.addTrainingExercise(this.trainingExerciseAddDialog.trainingExercise)
      .then(() => {
        this.trainingExerciseAddDialog = new TrainingExerciseAddDialog() // close dialog when save
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Exercise Added' })
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
    this.firestore.deleteTraining(this.training)
      .then(() => this.gotoTrainingProgramDetail())
  }

  deleteTrainingExercise() {
    this.firestore.deleteTrainingExercise(this.trainingExerciseAddDialog.trainingExercise)
      .then(() => this.trainingExerciseAddDialog = new TrainingExerciseAddDialog() )
  }

  // Training Exercise Reps Dialog

  openTrainingExerciseAddDialog() {
    this.trainingExerciseAddDialog = new TrainingExerciseAddDialog()
    this.trainingExerciseAddDialog.visible = true
  }

  editTrainingExerciseAddDialog(trainingExercise: TrainingExercise) {
    this.trainingExerciseAddDialog = new TrainingExerciseAddDialog()
    this.trainingExerciseAddDialog.trainingExercise = TrainingExercise.fromTrainingExercise(trainingExercise)
    this.trainingExerciseAddDialog.header = "Edit Training Exercise"
    this.trainingExerciseAddDialog.visible = true
  }

  toggleEditRep(rep: Rep) {
    if (this.isEditingRep(rep)) 
      this.trainingExerciseAddDialog.rep = new Rep()
    else 
      this.trainingExerciseAddDialog.rep = Rep.fromRep(rep)
  }

  isEditingRep(rep: Rep): boolean {
    return rep.order === this.trainingExerciseAddDialog.rep.order
  }

  isEditing(): boolean {
    return this.trainingExerciseAddDialog.rep.order !== undefined
  }

  addRep() {
    // add new rep in training exercise. keep the values in the dialog 
    const newRep = Rep.fromRep(this.trainingExerciseAddDialog.rep)
    newRep.order = getLastOrder(this.trainingExerciseAddDialog.trainingExercise.reps)
    this.trainingExerciseAddDialog.trainingExercise.reps.push(newRep)
  }

  saveRep() {
    // update selected rep in training exercise. keep the values in the dialog 
    const toUpdateRep = this.trainingExerciseAddDialog.trainingExercise.reps.find(r => r.order === this.trainingExerciseAddDialog.rep.order)!!
    toUpdateRep.value = this.trainingExerciseAddDialog.rep.value
    toUpdateRep.max = this.trainingExerciseAddDialog.rep.max
    this.trainingExerciseAddDialog.rep = new Rep()
    this.trainingExerciseAddDialog.rep.value = toUpdateRep.value
    this.trainingExerciseAddDialog.rep.max = toUpdateRep.max
  }

  removeRep() {
    const toRemoveRep = this.trainingExerciseAddDialog.trainingExercise.reps.find(r => r.order === this.trainingExerciseAddDialog.rep.order)!!
    this.trainingExerciseAddDialog.trainingExercise.reps = this.trainingExerciseAddDialog.trainingExercise.reps.filter(rep => rep.order !== toRemoveRep.order)
    this.trainingExerciseAddDialog.rep = new Rep()
  }

  gotoTrainingProgramDetail() {
    this.router.navigate(['training-program', this.training.trainingProgramId])
  }

  // Styles and redering

  repsString(reps: Rep[]): string {
    return reps.map(rep => rep.toString()).join(", ")
  }

  exerciseName(trainingExercise: TrainingExercise) {
    const e = this.exercises.find(e => e.id === trainingExercise.exerciseId)!!
    return capitalizeWords(e.name)
  }

  exerciseGroup(trainingExercise: TrainingExercise) {
    const e = this.exercises.find(e => e.id === trainingExercise.exerciseId)!!
    return capitalizeWords(e.group)
  }

  exerciseGroupChipStyle() {
    return {
      'background-color': '#ae3c60',
      'color': getContrastColor('#ae3c60')
    }
  }

  // Training Exercise Order 

  toggleChangeTrainingExerciseOrder() {
    this.changeTrainingExerciseOrder = !this.changeTrainingExerciseOrder
  }

  isLastTrainingExercise(trainingExercise: TrainingExercise) {
    return trainingExercise.order === getLastItem(this.trainingExercises)?.order
  }

  orderDown(trainingExercise: TrainingExercise) {
    const index1 = this.trainingExercises.indexOf(trainingExercise)
    this.trainingExercises = swapItems(this.trainingExercises, index1, index1 + 1)
  }

  isFirstTrainingExercise(trainingExercise: TrainingExercise) {
    return trainingExercise.order === 0
  }

  orderUp(trainingExercise: TrainingExercise) {
    const index1 = this.trainingExercises.indexOf(trainingExercise)
    this.trainingExercises = swapItems(this.trainingExercises, index1, index1 - 1)
  }

}
