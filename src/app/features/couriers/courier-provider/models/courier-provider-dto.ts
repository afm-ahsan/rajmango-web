import { CourierStationDto } from "../../courier-station/models/courier-station-dto";

export interface CourierProviderDto {
  id: number;
  name: string;
  description?: string;
  supportPhone?: string;
  email?: string;
  isActive: boolean;
  courierStations?: CourierStationDto[]; // optional if needed
}
