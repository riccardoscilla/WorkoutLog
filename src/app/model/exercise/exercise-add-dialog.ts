import { Training } from "src/app/model/training/training"
import { Exercise } from "./exercise"

export class ExerciseAddDialog {
    header: string = "New Exercise"
    visible: boolean = false
    exercise: Exercise = new Exercise()
}