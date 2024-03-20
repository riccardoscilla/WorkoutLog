import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CapitalizeWordsPipe } from './common/capitalize-words.pipe';
import { ToStringJoinPipe } from './common/to-string-join.pipe';
import { MenuBottomComponent } from './menu-bottom/menu-bottom.component';
import { ExerciseDetailComponent } from './pages/exercise-detail/exercise-detail.component';
import { ExerciseListComponent } from './pages/exercise-list/exercise-list.component';
import { TrainingDetailComponent } from './pages/training-detail/training-detail.component';
import { TrainingExerciseDetailComponent } from './pages/training-exercise-detail/training-exercise-detail.component';
import { TrainingProgramDetailComponent } from './pages/training-program-detail/training-program-detail.component';
import { TrainingProgramListComponent } from './pages/training-program-list/training-program-list.component';
import { WorkoutComponent } from './pages/workout/workout.component';
import { PrimeNgModule } from './primeng.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UserComponent } from './user/user.component';
import { WorkoutDetailComponent } from './pages/workout-detail/workout-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    MenuBottomComponent,
    TopbarComponent,
    UserComponent,
    ExerciseListComponent,
    TrainingProgramListComponent,
    TrainingProgramDetailComponent,
    TrainingDetailComponent,
    CapitalizeWordsPipe,
    ExerciseDetailComponent,
    WorkoutComponent,
    ToStringJoinPipe,
    TrainingExerciseDetailComponent,
    WorkoutDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    PrimeNgModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
