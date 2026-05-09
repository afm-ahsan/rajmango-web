import { CrateType } from "src/app/shared/enums/crate-type.enum";

export interface OrderDetailDto {
  id: number;
  mangoTypeId: number;
  mangoName?: string;
  crateType: CrateType;
  crateName?: string;
  quantity: number;
  unitPrice: number;
  //discount: number;
  totalPrice: number;
  note?: string;
}
