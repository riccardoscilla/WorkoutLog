import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureInnerPageGuard } from './auth/guards/secure-inner-page.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { ExerciseAddComponent } from './exercise/exercise-add/exercise-add.component';
import { UserComponent } from './user/user.component';
import { TrainingProgramListComponent } from './pages/training-program-list/training-program-list.component';
import { TrainingProgramDetailComponent } from './pages/training-program-detail/training-program-detail.component';
import { TrainingDetailComponent } from './pages/training-detail/training-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/training-program', pathMatch: 'full' },

  { path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard] },
  
  { path: 'user', component: UserComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'exercise', component: ExerciseListComponent, canActivate: [SecureInnerPageGuard] },
  { path: 'exercise/add', component: ExerciseAddComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'training-program', component: TrainingProgramListComponent, canActivate: [SecureInnerPageGuard] },
  { path: 'training-program/:trainingProgramId', component: TrainingProgramDetailComponent, canActivate: [SecureInnerPageGuard] },

  { path: 'training/:trainingId', component: TrainingDetailComponent, canActivate: [SecureInnerPageGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
