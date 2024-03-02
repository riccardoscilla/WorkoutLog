import { Injectable } from '@angular/core'
import { Observable, combineLatest } from 'rxjs'
import { capitalizeWords, groupByKey, sortByKey } from '../common/utils'
import { Document } from '../model/_document'
import { Exercise } from '../model/exercise'
import { Training } from '../model/training'
import { TrainingExercise } from '../model/training-exercise'
import { TrainingExerciseLog } from '../model/training-exercise-log'
import { TrainingProgram } from '../model/training-program'
import { FireQuery } from './FireQuery'
import { Firestore } from './firestore.service'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore
  ) { }  

  get_TrainingProgram_Join_Training(): Observable<TrainingProgram[]> {
    const query = FireQuery.select(TrainingProgram)
    const query2 = FireQuery.select(Training)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query), 
        this.firestore.get(query2), 
      ]).subscribe({
        next: ([trainingPrograms, trainings]) => {
          const groupedTrainings = groupByKey(trainings, "trainingProgramId")
          trainingPrograms.forEach(trainingProgram => {
            trainingProgram.trainings = sortByKey(groupedTrainings.get(trainingProgram.id)!, "order")
          })
          trainingPrograms = sortByKey(trainingPrograms, "date")
          observer.next(trainingPrograms)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_TrainingProgram_ById_Join_Training(trainingProgramId: string): Observable<TrainingProgram> {
    const query = FireQuery.select(TrainingProgram).where("id", "==", trainingProgramId)
    const query2 = FireQuery.select(Training).where("trainingProgramId", "==", trainingProgramId)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query), 
        this.firestore.get(query2), 
      ]).subscribe({
        next: ([trainingProgram, trainings]) => {
          trainingProgram[0].trainings = sortByKey(trainings, "order")
          observer.next(trainingProgram[0])
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Training_ById_Join_TrainingExercise(trainingId: string): Observable<Training> {
    const query = FireQuery.select(Training).where("id", "==", trainingId)
    const query2 = FireQuery.select(TrainingExercise).where("trainingId", "==", trainingId)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query), 
        this.firestore.get(query2)
      ]).subscribe({
        next: ([training, trainingExercises]) => {
          trainingExercises = sortByKey(trainingExercises, "order")

          training[0].trainingExercises = trainingExercises
          observer.next(training[0])
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Training_ById_Join_TrainingExercise_Join_Exercise(trainingId: string): Observable<Training> {
    const query = FireQuery.select(Training).where("id", "==", trainingId)
    const query2 = FireQuery.select(TrainingExercise).where("trainingId", "==", trainingId)
    const query3 = FireQuery.select(Exercise)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query), 
        this.firestore.get(query2),
        this.firestore.get(query3),
      ]).subscribe({
        next: ([training, trainingExercises, exercises]) => {
          trainingExercises.forEach(trainingExercise => {
            const exercise = exercises.find(exercise => exercise.id === trainingExercise.exerciseId)!
            trainingExercise.exercise = exercise
          })
          trainingExercises = sortByKey(trainingExercises, "order")

          training[0].trainingExercises = trainingExercises
          observer.next(training[0])
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Exercise_DropdownOptions(): Observable<object[]> {
    const query = FireQuery.select(Exercise)

    return new Observable(observer => {
      this.firestore.get(query).subscribe({
        next: (exercises) => {
          const exerciseDropdownOptions: object[] = []
          groupByKey(exercises, 'group').forEach((value: Exercise[], key: string) => {
            const option = {
              label: capitalizeWords(key),
              items: [] as object[]
            }
            value.forEach(exercise => option.items.push({
              label: capitalizeWords(exercise.name),
              id: exercise.id,
              data: exercise
            }))
            exerciseDropdownOptions.push(option)
          });
          observer.next(exerciseDropdownOptions)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Group_DropdownOptions(): Observable<object[]> {
    const query = FireQuery.select(Exercise)

    return new Observable(observer => {
      this.firestore.get(query).subscribe({
        next: (exercises) => {
          const groupDropdownOptions: object[] = []
          groupByKey(exercises, 'group').forEach((value: Exercise[], key: string) => {
            const option = {
              label: capitalizeWords(key),
              id: key
            }
            groupDropdownOptions.push(option)
          });
          observer.next(groupDropdownOptions)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Training_DropdownOptions(): Observable<object[]> {
    return new Observable(observer => {
      this.get_TrainingProgram_Join_Training().subscribe({
        next: (trainingPrograms) => {
          const trainingProgramsDropdownOptions: object[] = []
          trainingPrograms.forEach(trainingProgram => {
            const option = {
              label: capitalizeWords(trainingProgram.name),
              items: [] as object[]
            }
            trainingProgram.trainings.forEach(training => option.items.push({
              label: capitalizeWords(training.name),
              id: training.id,
              data: training
            }))
            trainingProgramsDropdownOptions.push(option)
          })
          observer.next(trainingProgramsDropdownOptions)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Exercise(): Observable<Map<string, Exercise[]>> {
    const query = FireQuery.select(Exercise)

    return new Observable(observer => {
      this.firestore.get(query).subscribe({
        next: (exercises: Exercise[]) => {
          const exercisesGrouped = groupByKey(exercises, "group")
          observer.next(exercisesGrouped)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_Exercise_ById(exerciseId: string): Observable<Exercise> {
    const query = FireQuery.select(Exercise).where("id", "==", exerciseId)

    return new Observable(observer => {
      this.firestore.get(query).subscribe({
        next: (exercise) => {
          observer.next(exercise[0])
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_TrainingExerciseLog_InDate(date: Date): Observable<TrainingExerciseLog[]> {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

    const query = FireQuery.select(TrainingExerciseLog).where("date", ">=", start).and("date", "<", end)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query),
        this.get_TrainingExercise_Join_Exercise()
      ]).subscribe({
        next: ([trainingExerciseLogs, trainingExercises]) => {
          trainingExerciseLogs.forEach(trainingExerciseLog => {
            const trainingExercise = trainingExercises.find(trainingExercise => trainingExercise.id === trainingExerciseLog.trainingExerciseId)!
            trainingExerciseLog.trainingExercise = trainingExercise
          })
          trainingExerciseLogs = sortByKey(trainingExerciseLogs, "order")
          observer.next(trainingExerciseLogs)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })
  }

  get_TrainingExercise_Join_Exercise(): Observable<TrainingExercise[]> {
    const query = FireQuery.select(TrainingExercise)
    const query2 = FireQuery.select(Exercise)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query),
        this.firestore.get(query2)
      ]).subscribe({
        next: ([trainingExercises, exercises]) => {
          trainingExercises.forEach(trainingExercise => {
            const exercise = exercises.find(exercise => exercise.id === trainingExercise.exerciseId)!
            trainingExercise.exercise = exercise
          })
          observer.next(trainingExercises)
        },
        error: (error) => {
          observer.error(error)
        }
      })
    })

  }

  add<T extends Document>(obj: T) {
    return new Observable(observer => {
      this.firestore.add(obj).then(() => observer.next(obj))
    })
  }

  patch<T extends Document>(obj: T) {
    return new Observable(observer => {
      this.firestore.patch(obj).then(() => observer.next(obj))
    })
  }

  delete_TrainingProgram_Cascade_Training(trainingProgram: TrainingProgram) {
    const query = FireQuery.select(Training).where("trainingProgramId", "==", trainingProgram.id)
    this.firestore.delete(trainingProgram)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query)
      ]).subscribe({
        next: ([trainings]) => {
          trainings.forEach(t => this.delete_Training_Cascade_TrainingExercise(t))
          observer.next()
        }
      })
    })
  }

  delete_Training_Cascade_TrainingExercise(training: Training) {
    const query = FireQuery.select(TrainingExercise).where("trainingId", "==", training.id)
    this.firestore.delete(training)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query)
      ]).subscribe({
        next: ([trainingExercises]) => {
          trainingExercises.forEach(te => this.delete_TrainingExercise(te))
          observer.next()
        }
      })
    })
  }

  delete_Exercise_Cascade_TrainingExercise(exercise: Exercise) {
    const query = FireQuery.select(TrainingExercise).where("exerciseId", "==", exercise.id)
    this.firestore.delete(exercise)

    return new Observable(observer => {
      combineLatest([
        this.firestore.get(query)
      ]).subscribe({
        next: ([trainingExercises]) => {
          trainingExercises.forEach(te => this.delete_TrainingExercise(te))
          observer.next()
        }
      })
    })
  }

  delete_TrainingExercise(trainingExercise: TrainingExercise) {
    return new Observable(observer => {
      this.firestore.delete(trainingExercise)
      observer.next()
    })
  }
 
}
