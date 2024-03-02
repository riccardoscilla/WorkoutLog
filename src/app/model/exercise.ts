import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"
import { Document } from "./_document"

export class Exercise implements Document {
  id: string
  name: string
  group: string

  static fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): Exercise {
    const exercise = new Exercise()
    exercise.id = snapshot.id
    exercise.name = snapshot.data()?.name
    exercise.group = snapshot.data()?.group
    return exercise
  }

  fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): Exercise {
    this.id = snapshot.id
    this.name = snapshot.data()?.name
    this.group = snapshot.data()?.group
    return this
  }

  isValid(): boolean {
    return this.name != undefined && this.group != undefined && this.name.trim() != "" && this.group.trim() != ""
  }

  toDocument(): object {
    return {
      'name': this.name,
      'group': this.group
    }
  }
    
}