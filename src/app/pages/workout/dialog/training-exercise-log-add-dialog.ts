import { Exercise } from "src/app/model/exercise"

export class TrainingExerciseLogAddDialog {
    header: string = "Add New Training Exercise Log"
    visible: boolean = false
    exercise: Exercise = new Exercise()

    canAdd(): boolean {
        return this.exercise !== undefined &&  this.exercise !== null
    }
}