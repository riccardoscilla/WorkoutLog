import { Pipe, PipeTransform } from '@angular/core';
import { capitalizeWords } from './utils';

@Pipe({
  name: 'capitalizeWords',
  
})
export class CapitalizeWordsPipe implements PipeTransform {

  transform(value: string): string {
    return capitalizeWords(value);
  }

}
