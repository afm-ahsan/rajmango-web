import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[selectGroup]',
})
export class SelectGroupDirective {
  checkChanges$ = fromEvent(this.host.nativeElement, 'change').pipe(
    map((e) => (e.target as any).checked)
  );

  constructor(private host: ElementRef<HTMLInputElement>) {}

  set checked(checked: boolean) {
    this.host.nativeElement.checked = checked;
  }
}
