export interface CreateCourierRateConfigDto {
  id: number;
  courierProviderId: number;
  locationType: number;
  ratePerKg: number;
  minimumCharge: number;
  sequence: number;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
}
