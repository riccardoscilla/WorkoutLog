import { Component } from '@angular/core';
import { DateDialog } from './model/date-dialog';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: []
})
export class WorkoutComponent {
  workout: any
  day = new Date()
  dateDialog = new DateDialog()


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

  setTodayAndClose() {
    this.day = new Date()
    this.closeDateDialog()
  }

  openDateDialog() {
    this.dateDialog.visible = true
  }

  closeDateDialog() {
    this.dateDialog.visible = false
  }

}
