import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Rep } from "./rep"
import { TrainingExerciseDocument } from "./training-exercise-document"
import { Exercise } from "../exercise/exercise"
import { getLastItem } from "src/app/common/utils"

export class TrainingExercise {
    id: string
    order: number
    trainingId: string
    exerciseId: string

    reps: Rep[] = []

    recover: number

    note: string = ""

    static fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingExercise {
        const trainingExercise = new TrainingExercise()
        trainingExercise.id = snapshot.id
        trainingExercise.order = snapshot.data()!.order
        trainingExercise.trainingId = snapshot.data()!.trainingId
        trainingExercise.exerciseId = snapshot.data()!.exerciseId

        trainingExercise.reps = snapshot.data()!.reps.map((rep: Rep) => Rep.fromDocument(rep))
        trainingExercise.recover = snapshot.data()!.recover

        trainingExercise.note = snapshot.data()!.note
        return trainingExercise
    }

    static fromTrainingExercise(te: TrainingExercise): TrainingExercise {
        const trainingExercise = new TrainingExercise()
        trainingExercise.id = te.id
        trainingExercise.order = te.order
        trainingExercise.trainingId = te.trainingId
        trainingExercise.exerciseId = te.exerciseId

        trainingExercise.reps = te.reps.map(rep => Rep.fromRep(rep))
        trainingExercise.recover = te.recover

        trainingExercise.note = te.note
        return trainingExercise
    }

    isValid() {
        return this.exerciseId != undefined 
            && this.reps.length > 0
            && this.reps.map(rep => rep.isValid()).filter(valid => valid === false).length === 0
            && this.recover != undefined
    }

    toDocument(): object {
        return {
            'order': this.order,
            'trainingId': this.trainingId,
            'exerciseId': this.exerciseId,
            'reps': this.reps.map(rep => rep.toDocument()),
            'recover': this.recover,
            'note': this.note
        }
    }

    hasNote(): boolean {
        return this.note !== undefined && this.note.trim() !== ""
    }
}
