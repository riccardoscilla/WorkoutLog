import { Training } from "src/app/model/training"

export class WorkoutAddDialog {
    header: string = "Add New Workout"
    visible: boolean = false
    training: Training = new Training()

    canAdd(): boolean {
        return this.training !== undefined &&  this.training !== null
    }
}