export interface CourierAreaMapDto {
  id: number;
  courierStationId: number;
  area: string;

  // Optional for display purposes
  courierStationName?: string;
}
