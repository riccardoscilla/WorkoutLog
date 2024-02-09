export interface TrainingExerciseDocument {
    order: number;
    trainingId: string;
    exerciseId: string;
    sets?: number;
    reps?: number[];
    max?: boolean;
  }