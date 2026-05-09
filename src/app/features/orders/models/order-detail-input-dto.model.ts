import { CrateType } from "src/app/shared/enums/crate-type.enum";

export interface OrderDetailInputDto {
  mangoTypeId: number;
  crateType: CrateType;
  quantity: number;
  unitPrice: number;
  //discount: number;
  note?: string;
}
