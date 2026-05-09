import { ContentChild, ContentChildren, Directive, QueryList } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { merge } from 'rxjs';
import { SelectGroupDirective } from './select-group.directive';

@UntilDestroy()
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[checkChildren]'
})
export class CheckChildrenDirective {
  @ContentChildren(NgControl, { descendants: true }) controls: QueryList<NgControl>;
  @ContentChild(SelectGroupDirective) selectGroup: SelectGroupDirective;

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterContentInit() {
    this.selectGroup.checkChanges$.pipe(
      untilDestroyed(this)
    ).subscribe((checked) => {
      this.controls.forEach(({ control }) => control?.patchValue(checked));
    });

    const changes = this.controls.map(({ control }) => control?.valueChanges);

    merge(...changes).pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      // every is more readbale
      this.selectGroup.checked = this.controls.toArray().every(({ control }) => control?.value);
      // this.selectGroup.checked = !(this.controls.some(c => !c.control.value));
    })
  }
}
