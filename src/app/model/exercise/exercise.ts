import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"

export class Exercise {
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
  
  isValid(): boolean {
    return this.name != undefined && this.group != undefined && this.name.trim() != "" && this.group.trim() != ""
  }
    
}