import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance, subDays, subMinutes } from 'date-fns';
import { cs } from 'date-fns/locale';

@Pipe({
  name: 'dateAgo',
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) return null;
    
    let now = Date.now();
    let then = Date.parse(value as string);

    let relative = formatDistance(then, now, { locale: cs, addSuffix: true})

    return relative;
  }

}
