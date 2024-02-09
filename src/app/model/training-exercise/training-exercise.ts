import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Rep } from "./rep"
import { TrainingExerciseDocument } from "./training-exercise-document"
import { Exercise } from "../exercise/exercise"

export class TrainingExercise {
    id: string
    order: number
    trainingId: string
    exerciseId: string

    reps: Rep[] = []

    note?: string

    static fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingExercise {
        const trainingExercise = new TrainingExercise()
        trainingExercise.id = snapshot.id
        trainingExercise.order = snapshot.data()!.order
        trainingExercise.trainingId = snapshot.data()!.trainingId
        trainingExercise.exerciseId = snapshot.data()!.exerciseId

        trainingExercise.reps = snapshot.data()!.reps.map((rep: string) => Rep.fromDocument(rep))

        trainingExercise.note = snapshot.data()!.note
        return trainingExercise
    }

    isValid() {
        return this.exerciseId != undefined 
            && this.reps.map(rep => rep.toDocumentValue()).filter(value => value === '').length === 0
    }

    toDocument(): object {
        return {
            'order': this.order,
            'trainingId': this.trainingId,
            'exerciseId': this.exerciseId,
            'reps': this.reps.map(rep => rep.toDocumentValue())
        }
    }

    addRep() {
        this.reps.push(new Rep())
    }

    removeRep() {
        this.reps.pop()
    }
}
