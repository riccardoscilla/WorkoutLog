import { Training } from "src/app/model/training"

export class TrainingAddDialog {
    header: string = "New Training"
    visible: boolean = false
    training: Training = new Training()
}