import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ArraySortById'
})
export class ArraySortByIdPipe implements PipeTransform {

  transform(array: Array<any>): Array<string> {
    if (array === null) { return null; }
    array.sort((a: any, b: any) => {
      if (a.id < b.id){
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}