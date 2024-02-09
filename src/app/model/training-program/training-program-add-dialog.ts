import { TrainingProgram } from "./training-program"

export class TrainingProgramAddDialog {
    header: string = "New Training Program"
    visible: boolean = false
    trainingProgram: TrainingProgram = TrainingProgram.now()
}