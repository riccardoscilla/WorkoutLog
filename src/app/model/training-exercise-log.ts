import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Rep, RepDocument } from "./rep"
import { TrainingExercise } from "./training-exercise"
import { Document } from "./_document"
import { Exercise } from "./exercise"

export class TrainingExerciseLog implements Document {
    id: string
    order: number
    trainingExerciseId: string
    exerciseId: string

    date: Date
    reps: Rep[] = []
    difficulty: number = 0

    trainingExercise: TrainingExercise = new TrainingExercise()
    exercise: Exercise = new Exercise()


    fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingExerciseLog {
        this.id = snapshot.id
        this.order = snapshot.data()?.order
        this.exerciseId = snapshot.data()?.exerciseId
        this.trainingExerciseId = snapshot.data()?.trainingExerciseId
        this.date = snapshot.data()?.date?.toDate()
        this.reps = snapshot.data()?.reps?.map((rep: RepDocument) => Rep.fromDocument(rep))
        this.difficulty = snapshot.data()?.difficulty
        return this
    }

    static fromTrainingExercise(trainingExercise: TrainingExercise, date: Date): TrainingExerciseLog {
        const trainingExerciseLog = new TrainingExerciseLog()
        trainingExerciseLog.order = trainingExercise.order
        trainingExerciseLog.exerciseId = trainingExercise.exerciseId
        trainingExerciseLog.trainingExerciseId = trainingExercise.id
        trainingExerciseLog.date = date
        return trainingExerciseLog
    }

    static fromExercise(exercise: Exercise, date: Date, order: number): TrainingExerciseLog {
        const trainingExerciseLog = new TrainingExerciseLog()
        trainingExerciseLog.order = order
        trainingExerciseLog.exerciseId = exercise.id
        trainingExerciseLog.trainingExerciseId = ""
        trainingExerciseLog.date = date
        return trainingExerciseLog
    }

    toDocument(): object {
        return {
            'order': this.order,
            'trainingExerciseId': this.trainingExerciseId,
            'exerciseId': this.exerciseId,
            'date': this.date,
            'reps': this.reps?.map(rep => rep.toDocument()),
            'difficulty': this.difficulty
        }
    }
}