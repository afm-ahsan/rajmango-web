import { CourierAreaMapDto } from "../../courier-area-map/models/courier-area-map-dto";

export interface CourierStationDto {
  id: number;

  name: string;
  addressLine: string;
  city: string;
  area: string;

  supportPhone1: string;
  supportPhone2?: string;
  email?: string;

  latitude?: number;
  longitude?: number;
  googleMapUrl?: string;

  isActive: boolean;

  courierProviderId: number;
  courierProviderName?: string;

  courierAreaMaps: CourierAreaMapDto[]; // Optional nested detail
}
