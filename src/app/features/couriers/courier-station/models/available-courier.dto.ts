export interface AvailableCourierDto {
  stationId: number;
  stationName: string;
  providerName: string;
  city: string;
  area: string;
  phone: string;
  mapUrl: string;
  /** 1 = InsideDhaka, 2 = OutsideDhaka */
  locationType: number;
}