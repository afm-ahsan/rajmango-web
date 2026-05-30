export interface CourierRateConfigDto {
  id: number;
  courierProviderId: number;
  courierProviderName: string;
  locationType: number;
  ratePerKg: number;
  minimumCharge: number;
  sequence: number;
  isActive: boolean;
}
