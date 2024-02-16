import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Data } from "src/app/common/data"

export class Training extends Data {
    id: string
    name: string
    order: number
    trainingProgramId: string

    static fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): Training {
        const training = new Training()
        training.id = snapshot.id
        training.name = snapshot.data()!.name
        training.trainingProgramId = snapshot.data()!.trainingProgramId
        training.order = snapshot.data()!.order
        return training
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