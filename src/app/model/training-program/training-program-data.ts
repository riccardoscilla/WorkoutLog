import { Data } from "src/app/common/data";
import { TrainingProgram } from "./training-program";
import { DocumentChangeAction, DocumentData, } from "@angular/fire/compat/firestore";

export class TrainingProgramData extends Data {
    trainingPrograms: TrainingProgram[] = []

    setFromResponse(response: DocumentChangeAction<DocumentData>[]) {
        this.trainingPrograms = response.map((data: DocumentData) => TrainingProgram.fromSnapshot(data.payload.doc))
    }

    sortByDate() {
        this.trainingPrograms.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    getTrainingProgram(id: string): TrainingProgram {
        return this.trainingPrograms.find(trainingProgram => trainingProgram.id === id)!
    }
}