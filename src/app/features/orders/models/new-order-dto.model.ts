import { CrateType } from "src/app/shared/enums/crate-type.enum";

export interface NewOrderDto {
  id: number;
  mangoType: number;
  area: number;
  crateType: CrateType;
  quantity: number;
  note: string;
  courierStationId: number;
  fallbackAddress: string;
}
