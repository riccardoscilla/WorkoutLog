import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Data } from 'src/app/common/data';
import { capitalizeWords } from 'src/app/common/utils';
import { Exercise } from 'src/app/model/exercise';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: [],
  providers: [ConfirmationService, MessageService]
})
export class ExerciseDetailComponent {
  header: string
  data: Data = new Data()
  exercise: Exercise = new Exercise()
  groupDropdownOptions: object[] = []
  
  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['exerciseId']
    this.getExercise(id)
    this.getGroupDropdownOptions()
  }

  getExercise(id: string) {
    this.data.isLoading()

    this.dataService.get_Exercise_ById(id).subscribe({
      next: (exercise) => {
        this.exercise = exercise
        this.header = exercise.name
        this.data.isData()
      },
      error: (error) => {
        this.data.isError()
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Exercise' })
      }
    })
  }

  getGroupDropdownOptions() {
    this.dataService.get_Group_DropdownOptions().subscribe({
      next: (groupDropdownOptions) => {
        this.groupDropdownOptions = groupDropdownOptions
      },
      error: (error) => {
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting Group Dropdown Options' })
      }
    })
  }

  saveExercise() {
    this.dataService.patch(this.exercise).subscribe({
      next: () => {
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Exercise Saved'})
        this.router.navigate(['exercise', this.exercise.id])
      }
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
    this.dataService.delete_Exercise_Cascade_TrainingExercise(this.exercise).subscribe({
      next: () => this.gotoExerciseList()
    })
  }

  gotoExerciseList() {
    this.router.navigate(['exercise'])
  }

}
