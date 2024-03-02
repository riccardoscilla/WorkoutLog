import { Rep } from "../../../model/rep"
import { TrainingExercise } from "../../../model/training-exercise"

export class TrainingExerciseDialog {
    header: string = "New Training Exercise"
    visible: boolean = false
    trainingExercise: TrainingExercise = new TrainingExercise()
    rep: Rep = new Rep()
}