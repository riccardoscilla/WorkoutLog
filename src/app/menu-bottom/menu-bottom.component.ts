import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.scss']
})
export class MenuBottomComponent {
  selected: string

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { 
    console.log(router.url)
  }

  gotoExerciseList() {
    this.selected = "exercise"
    this.router.navigate(['exercise'])
  }

  gotoTrainingProgramList() {
    this.selected = "training-program"
    this.router.navigate(['training-program'])
  }

  gotoWorkout() {
    this.selected = ""
    this.router.navigate(['workout'])
  }

  goToUser() {
    this.selected = "user"
    this.router.navigate(['user'])
  }

  getActivatedRoute(route: string): boolean {
    // console.log(this.route.snapshot.url.map(segment => segment.path))
    return this.router.url.includes(route)
    console.log(this.route.snapshot)
  }

}
