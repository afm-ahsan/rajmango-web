import { CrateType } from '../enums/crate-type.enum';
import { MangoType } from '../enums/mango-type.enum';

export class DomainUtils {
  static getCrateWeight(crateType: CrateType): number {
    switch (crateType) {
      case CrateType.Crate10Kg: return 10;
      case CrateType.Crate20Kg: return 20;
      default: return 0;
    }
  }

  static getCrateLabel(crateType: CrateType): string {
    switch (crateType) {
      case CrateType.Crate10Kg: return '10Kg';
      case CrateType.Crate20Kg: return '20Kg';
      default: return 'Unknown';
    }
  }
}
