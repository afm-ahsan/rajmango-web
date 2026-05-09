export interface CreateCourierAreaMapDto {
  id?: number; // Optional for edit mode
  area: string;
  courierStationId: number;
  createdBy?: number;  // optional, typically set server-side or injected before submit
}
