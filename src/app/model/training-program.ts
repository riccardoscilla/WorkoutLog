import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Document } from "./_document"
import { Training } from "./training"

export class TrainingProgram implements Document {
    id: string
    name: string
    date: Date

    trainings: Training[] = []
    
    static now(): TrainingProgram {
        const trainingProgram = new TrainingProgram()
        trainingProgram.date = new Date()
        return trainingProgram
    }

    fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingProgram {
        this.id = snapshot.id
        this.name = snapshot.data()?.name
        this.date = snapshot.data()?.date.toDate()
        return this
    }

    isValid(): boolean {
        return this.name != undefined && this.date != undefined
    }

    toDocument(): object {
        return {
            'name': this.name,
            'date': this.date
        }
    }
}