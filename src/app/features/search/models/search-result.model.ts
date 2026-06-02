export interface GlobalSearchResult {
  orders: OrderSearchItem[];
  customers: CustomerSearchItem[];
  courierStations: StationSearchItem[];
  mangoes: MangoSearchItem[];
}

export interface OrderSearchItem {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderStatus: number;
  totalAmount: number;
  orderDate: string;
  mangoTypeName?: string;
}

export interface CustomerSearchItem {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export interface StationSearchItem {
  id: number;
  name: string;
  area: string;
  city: string;
  providerName: string;
}

export interface MangoSearchItem {
  id: number;
  name: string;
  region?: string;
}
