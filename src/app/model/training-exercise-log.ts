import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Rep, RepDocument } from "./rep"
import { TrainingExercise } from "./training-exercise"
import { Document } from "./_document"

export class TrainingExerciseLog implements Document {
    id: string
    order: number
    trainingExerciseId: string
    date: Date
    reps: Rep[]
    difficulty: number

    trainingExercise: TrainingExercise = new TrainingExercise()


    fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingExerciseLog {
        this.id = snapshot.id
        this.order = snapshot.data()?.order
        this.trainingExerciseId = snapshot.data()?.trainingExerciseId
        this.date = snapshot.data()?.date.toDate()
        this.reps = snapshot.data()?.reps.map((rep: RepDocument) => Rep.fromDocument(rep))
        this.difficulty = snapshot.data()?.difficulty
        return this
    }

    static fromTrainingExercise(trainingExercise: TrainingExercise, date: Date): TrainingExerciseLog {
        const trainingExerciseLog = new TrainingExerciseLog()
        trainingExerciseLog.order = trainingExercise.order
        trainingExerciseLog.trainingExerciseId = trainingExercise.id
        trainingExerciseLog.date = date
        trainingExerciseLog.reps = trainingExercise.reps.map(rep => Rep.deepcopy(rep))
        trainingExerciseLog.difficulty = 0
        return trainingExerciseLog
    }

    toDocument(): object {
        return {
            'order': this.order,
            'trainingExerciseId': this.trainingExerciseId,
            'date': this.date,
            'reps': this.reps.map(rep => rep.toDocument()),
            'difficulty': this.difficulty
        }
    }
}