import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Data } from 'src/app/common/data';
import { Training } from 'src/app/model/training';
import { TrainingProgram } from 'src/app/model/training-program';
import { TrainingProgramAddDialog } from 'src/app/pages/training-program-list/dialog/training-program-add-dialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-training-program-list',
  templateUrl: './training-program-list.component.html',
  styleUrls: [],
  providers: [MessageService]
})
export class TrainingProgramListComponent implements OnInit {
  data: Data = new Data()  
  trainingPrograms: TrainingProgram[] = []

  trainingProgramAddDialog: TrainingProgramAddDialog = new TrainingProgramAddDialog()

  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTrainingPrograms()
  }

  getTrainingPrograms() {
    this.data.isLoading()

    this.dataService.get_TrainingProgram_Join_Training().subscribe({
      next: (trainingPrograms) => {
        if (trainingPrograms.length === 0) {
          this.data.isNoData()
        } 
        else {
          this.trainingPrograms = trainingPrograms
          this.data.isData()
        }
      },
      error: (error) => {
        this.data.isError()
        this.messageService.clear()
        this.messageService.add({severity: 'error', detail: 'Error getting TrainingPrograms' })
      }
    })
  }

  gotoTrainingProgramDetail(trainingProgram: TrainingProgram) {
    this.router.navigate(['training-program', trainingProgram.id])
  }

  openTrainingProgramDialog() {
    this.trainingProgramAddDialog.visible = true
  }

  saveTrainingProgram() {
    this.dataService.add(this.trainingProgramAddDialog.trainingProgram).subscribe({
      next: () => {
        this.trainingProgramAddDialog = new TrainingProgramAddDialog()
        this.messageService.clear()
        this.messageService.add({severity: 'success', detail: 'Training Program Added' })
        this.getTrainingPrograms()
      }
    })
  }

  gotoTrainingDetail(training: Training) {
    this.router.navigate(['training', training.id])
  }

}
