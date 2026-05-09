export interface CreateCourierStationDto {
  id?: number; // Optional for edit mode

  courierProviderId: number;

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

  createdBy?: number;
  updatedBy?: number;
}

