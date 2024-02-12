import { Pipe, PipeTransform } from '@angular/core';
import { capitalizeWords } from './utils';

@Pipe({
  name: 'capitalizeWords',
  
})
export class CapitalizeWordsPipe implements PipeTransform {

  transform(value: string): unknown {
    return capitalizeWords(value);
  }

}
