import { Component } from '@angular/core';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: []
})
export class WorkoutComponent {
  workout: any
  day = new Date()



  minusDay() {
    let timestamp = this.day.getTime()
    let oneDayInMilliseconds = 24 * 60 * 60 * 1000
    let newTimestamp = timestamp - oneDayInMilliseconds
    this.day = new Date(newTimestamp)
  }
 
  plusDay() {
    let timestamp = this.day.getTime()
    let oneDayInMilliseconds = 24 * 60 * 60 * 1000
    let newTimestamp = timestamp + oneDayInMilliseconds
    this.day = new Date(newTimestamp)
  }
}
