import { Exercise } from "../exercise/exercise"
import { TrainingExercise } from "./training-exercise"

export class TrainingExerciseAddDialog {
    header: string = "New Training Exercise"
    visible: boolean = false
    trainingExercise: TrainingExercise = new TrainingExercise()
}