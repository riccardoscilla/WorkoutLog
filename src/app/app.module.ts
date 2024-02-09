import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule, PERSISTENCE_SETTINGS } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from './primeng.module';
import { MenuBottomComponent } from './menu-bottom/menu-bottom.component';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { ExerciseAddComponent } from './exercise/exercise-add/exercise-add.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UserComponent } from './user/user.component';
import { TrainingProgramListComponent } from './pages/training-program-list/training-program-list.component';
import { TrainingProgramDetailComponent } from './pages/training-program-detail/training-program-detail.component';
import { TrainingDetailComponent } from './pages/training-detail/training-detail.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    MenuBottomComponent,
    ExerciseListComponent,
    ExerciseAddComponent,
    TopbarComponent,
    UserComponent,
    TrainingProgramListComponent,
    TrainingProgramDetailComponent,
    TrainingDetailComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
