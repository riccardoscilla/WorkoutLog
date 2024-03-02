import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { TrainingExercise } from "./training-exercise"
import { Document } from "./_document"

export class Training implements Document {
    id: string
    name: string
    order: number
    trainingProgramId: string

    trainingExercises: TrainingExercise[] = []

    fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): Training {
        this.id = snapshot.id
        this.name = snapshot.data()?.name
        this.trainingProgramId = snapshot.data()?.trainingProgramId
        this.order = snapshot.data()?.order
        return this
    }

    isValid(): boolean {
        return this.name != undefined && this.name.trim() != ""
    }

    toDocument(): object {
        return {
            'name': this.name,
            'order': this.order,
            'trainingProgramId': this.trainingProgramId
        }
    }
}