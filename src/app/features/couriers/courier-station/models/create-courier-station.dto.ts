export interface CreateCourierStationDto {
  id?: number;

  courierProviderId: number;

  name: string;
  addressLine: string;
  city: string;
  area: string;

  supportPhone1: string;
  supportPhone2: string | null;
  email: string | null;

  latitude: number | null;
  longitude: number | null;

  googleMapUrl: string | null;

  isActive: boolean;

  createdBy?: number;
  updatedBy?: number;
}
