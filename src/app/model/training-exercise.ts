import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Rep, RepDocument } from "./rep"
import { Exercise } from "./exercise"
import { Document } from "./_document"

export class TrainingExercise implements Document {
    id: string
    order: number
    trainingId: string
    exerciseId: string
    reps: Rep[] = []
    recover: number
    note: string = ""

    exercise: Exercise = new Exercise()

    fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingExercise {
        this.id = snapshot.id
        this.order = snapshot.data()?.order
        this.trainingId = snapshot.data()?.trainingId
        this.exerciseId = snapshot.data()?.exerciseId

        this.reps = snapshot.data()?.reps?.map((rep: RepDocument) => Rep.fromDocument(rep))
        this.recover = snapshot.data()?.recover

        this.note = snapshot.data()?.note
        return this
    }

    static deepcopy(te: TrainingExercise): TrainingExercise {
        const trainingExercise = new TrainingExercise()
        trainingExercise.id = te.id
        trainingExercise.order = te.order
        trainingExercise.trainingId = te.trainingId
        trainingExercise.exerciseId = te.exerciseId

        trainingExercise.reps = te.reps.map(rep => Rep.deepcopy(rep))
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
