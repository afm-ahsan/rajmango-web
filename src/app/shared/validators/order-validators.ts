import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DomainUtils } from '../utils/domain-utils';

export function minOrderKgValidator(minKg: number): ValidatorFn {
  return (group: AbstractControl) => {
    const crateType = +(group.get('crateType')?.value ?? 0);
    const quantity = +(group.get('quantity')?.value ?? 0);
    const crateWeight = DomainUtils.getCrateWeight(crateType);

    if (crateWeight === 0 || quantity < 1) {
      return null;
    }

    const totalKg = quantity * crateWeight;
    return totalKg < minKg
      ? { minOrderKg: { required: minKg, actual: totalKg } }
      : null;
  };
}
