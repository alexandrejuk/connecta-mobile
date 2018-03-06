import { Pipe } from '@angular/core';

@Pipe({
  name: 'cep'
})
export class CepPipe {

  transform(value: string): any {
    value = value.toString();

    return value.substring(0,5)
                .concat('-')
                .concat(value.substring(5,8))
  }
}