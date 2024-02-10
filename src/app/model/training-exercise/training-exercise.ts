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

    note: string = ""

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

    static fromTrainingExercise(te: TrainingExercise): TrainingExercise {
        const trainingExercise = new TrainingExercise()
        trainingExercise.id = te.id
        trainingExercise.order = te.order
        trainingExercise.trainingId = te.trainingId
        trainingExercise.exerciseId = te.exerciseId

        trainingExercise.reps = te.reps.map(rep => Rep.fromRep(rep))

        trainingExercise.note = te.note
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
            'reps': this.reps.map(rep => rep.toDocumentValue()),
            'note': this.note
        }
    }

    addRep() {
        const lastRep = getLastItem(this.reps)
        if (lastRep === undefined) {
            this.reps.push(new Rep())
        }
        else { // add rep with equal values of the last inserted
            const rep = new Rep()
            rep.value = lastRep!!.value
            rep.max = lastRep!!.max
            this.reps.push(rep)
        }
    }

    removeRep() {
        this.reps.pop()
    }

    hasNote(): boolean {
        return this.note !== undefined && this.note.trim() !== ""
    }
}
