import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
// import { DataService } from 'src/app/service/firestore.service';
import { Exercise } from '../../model/exercise/exercise';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss']
})
export class ExerciseListComponent implements OnInit {

  exercises: Exercise[]
  loading: boolean = true

  constructor(
    public authService: AuthService, 
    // public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getExercises()
  }

  getExercises() {
    // this.loading = true

    // this.dataService.getExercises().subscribe({
    //   next: (response) => {
    //     this.loading = false
        
    //     if (response === undefined || response.length == 0)
    //       return

    //     this.exercises = response.map((e: any) => {
    //       const data = e.payload.doc.data()
    //       data.id = e.payload.doc.id
    //       return data as Exercise
    //     })
    //   },
    //   error: (error) => {
    //     this.loading = false
    //     alert('Error while fetching exercises')
    //   }
    // })
  }

}
