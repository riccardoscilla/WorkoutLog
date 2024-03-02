import { DocumentData, DocumentSnapshot } from "@angular/fire/compat/firestore"

export interface Document {
    id: string
    fromSnapshot(snapshot: DocumentSnapshot<DocumentData>): Document
    toDocument() : object
  }