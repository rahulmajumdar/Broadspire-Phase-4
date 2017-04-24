// truncate.ts
import {Pipe} from '@angular/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, startno:number, endno:number) : string {
    var res = value.substring(startno, endno);
    return res;
  }
}
