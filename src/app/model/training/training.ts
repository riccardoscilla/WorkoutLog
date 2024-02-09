import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Data } from "src/app/common/data"

export class Training extends Data {
    id: string
    name: string
    trainingProgramId: string
    order: number

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
        const { id, ...documentWithoutId } = this;
        return documentWithoutId;
    }
}