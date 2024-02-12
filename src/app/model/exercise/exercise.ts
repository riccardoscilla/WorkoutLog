import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Data } from "src/app/common/data"

export class Exercise extends Data {
  id: string
  name: string
  group: string

  static fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): Exercise {
    const exercise = new Exercise()
    exercise.id = snapshot.id
    exercise.name = snapshot.data()!.name
    exercise.group = snapshot.data()!.group
    return exercise
  }

  toDocument() {
    return {
      'name': this.name,
      'group': this.group
    }
  }
  
  isValid(): boolean {
    return this.name != undefined && this.group != undefined && this.name.trim() != "" && this.group.trim() != ""
  }
    
}