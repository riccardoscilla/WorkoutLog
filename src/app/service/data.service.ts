import { Injectable } from '@angular/core';
import { Firestore } from './firestore.service';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map, throwError } from 'rxjs';
import { DocumentData } from '@angular/fire/compat/firestore';
import { Exercise } from '../model/exercise/exercise';
import { capitalizeWords, groupByKey } from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore, 
    private messageService: MessageService
  ) { }

  getGroupDropdownOptions(): Observable<{ label: string, id: string }[]> {
    return this.firestore.getExercises().pipe(
      map(response => {
        if (response.length === 0) {
          return [];
        } else {
          const exercises = response.map((data: DocumentData) => Exercise.fromSnapshot(data.payload.doc));
          const exercisesGrouped = groupByKey(exercises, "group");

          const groupDropdownOptions: { label: string, id: string }[] = [];
          exercisesGrouped.forEach((value: Exercise[], key: string) => {
            const option = {
              label: capitalizeWords(key),
              id: key
            };
            groupDropdownOptions.push(option);
          });

          return groupDropdownOptions;
        }
      })
    );
  }
}
