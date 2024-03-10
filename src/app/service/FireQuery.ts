import { WhereFilterOp } from '@firebase/firestore'
import { Document } from '../model/_document'
import { Exercise } from '../model/exercise'
import { Training } from '../model/training'
import { TrainingExercise } from '../model/training-exercise'
import { TrainingExerciseLog } from '../model/training-exercise-log'
import { TrainingProgram } from '../model/training-program'

export class FireQueryWhere {
    param: string
    comparator: WhereFilterOp
    value: any
  
    constructor (param: string, comparator: WhereFilterOp, value: any) {
      this.param = param
      this.comparator = comparator
      this.value = value
    }
}

export class FireQuery<T extends Document> {
    type: new() => T
    fromParam: string;
    whereParam: FireQueryWhere[] = []

    static objectToCollection<T extends Document>(obj: T): string {
      const objName = obj.constructor.name
      if (objName == TrainingProgram.name)
        return "trainingProgram"
      if (objName == Training.name)
        return "training"
      if (objName == TrainingExercise.name)
        return "trainingExercise"
      if (objName == TrainingExerciseLog.name)
        return "trainingExerciseLog"
      if (objName == Exercise.name)
        return "exercise"
      return ""
    }

    classToCollection(): string {
      const objName = new this.type().constructor.name
      if (objName == TrainingProgram.name)
        return "trainingProgram"
      if (objName == Training.name)
        return "training"
      if (objName == TrainingExercise.name)
        return "trainingExercise"
      if (objName == TrainingExerciseLog.name)
        return "trainingExerciseLog"
      if (objName == Exercise.name)
        return "exercise"
      return ""
    }

    static select<T extends Document>(type: new() => T): FireQuery<T> {
      const query = new FireQuery<T>()
      query.type = type
      query.fromParam = query.classToCollection()
      return query
    }

    where(param: string, comparator: WhereFilterOp, value: any): FireQuery<T> {
        this.whereParam.push(new FireQueryWhere(param, comparator, value))
        return this
    }

    and(param: string, comparator: WhereFilterOp, value: any): FireQuery<T> {
        this.whereParam.push(new FireQueryWhere(param, comparator, value))
        return this
    }
}