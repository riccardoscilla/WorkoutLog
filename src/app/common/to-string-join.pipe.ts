import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toStringJoin'
})
export class ToStringJoinPipe implements PipeTransform {

  transform(value: object[], ...args: unknown[]): string {
    return value.map(v => v.toString()).join(", ")
  }

}
