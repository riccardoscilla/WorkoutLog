import { Exercise } from "../../../model/exercise"

export class ExerciseAddDialog {
    header: string = "New Exercise"
    visible: boolean = false
    exercise: Exercise = new Exercise()
}