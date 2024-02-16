import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureInnerPageGuard } from './auth/guards/secure-inner-page.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { ExerciseListComponent } from './pages/exercise-list/exercise-list.component';
import { ExerciseDetailComponent } from './pages/exercise-detail/exercise-detail.component';
import { TrainingProgramListComponent } from './pages/training-program-list/training-program-list.component';
import { TrainingProgramDetailComponent } from './pages/training-program-detail/training-program-detail.component';
import { TrainingDetailComponent } from './pages/training-detail/training-detail.component';
import { WorkoutComponent } from './workout/workout.component';

const routes: Routes = [
  { path: '', redirectTo: '/workout', pathMatch: 'full' },

  { path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard] },
  
  { path: 'user', component: UserComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'exercise', component: ExerciseListComponent, canActivate: [SecureInnerPageGuard] },
  { path: 'exercise/:exerciseId', component: ExerciseDetailComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'training-program', component: TrainingProgramListComponent, canActivate: [SecureInnerPageGuard] },
  { path: 'training-program/:trainingProgramId', component: TrainingProgramDetailComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'training/:trainingId', component: TrainingDetailComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'workout', component: WorkoutComponent, canActivate: [SecureInnerPageGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
