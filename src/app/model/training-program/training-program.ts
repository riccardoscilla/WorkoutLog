import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Data } from "src/app/common/data"

export class TrainingProgram extends Data {
    id: string
    name: string
    date: Date
    
    static now(): TrainingProgram {
        const trainingProgram = new TrainingProgram()
        trainingProgram.date = new Date()
        return trainingProgram
    }

    static fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): TrainingProgram {
        const trainingProgram = new TrainingProgram()
        trainingProgram.id = snapshot.id
        trainingProgram.name = snapshot.data()!.name
        trainingProgram.date = snapshot.data()!.date.toDate()
        return trainingProgram
    }

    static doNotExists(): TrainingProgram {
        const trainingProgram = new TrainingProgram()
        trainingProgram.id = "DO NOT EXIST"
        return trainingProgram
    }

    isValid(): boolean {
        return this.name != undefined && this.date != undefined
    }

    toDocument(): object {
        return {
            name: this.name,
            date: this.date
        }
    }
}