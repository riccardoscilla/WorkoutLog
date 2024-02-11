import { Exercise } from "../exercise/exercise"
import { Rep } from "./rep"
import { TrainingExercise } from "./training-exercise"

export class TrainingExerciseAddDialog {
    header: string = "New Training Exercise"
    visible: boolean = false
    trainingExercise: TrainingExercise = new TrainingExercise()
    rep: Rep = new Rep()
}