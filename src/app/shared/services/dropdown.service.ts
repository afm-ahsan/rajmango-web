// core/services/dropdown.service.ts
import { Injectable } from '@angular/core';
import { DropdownModel, EntityDropdownModel } from '../models/dropdown.model';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  constructor() {}

  getCrateTypeOptions(): DropdownModel[] {
    return [
      { id: 1, label: '10Kg' },
      { id: 2, label: '20Kg' }
    ];
  }

  getOrderStatusOptions(): DropdownModel[] {
    return [
      { id: 0, label: 'Pending' },
      { id: 1, label: 'Confirmed' },
      { id: 2, label: 'Processing' },
      { id: 3, label: 'Shipped' },
      { id: 4, label: 'Delivered' },
      { id: 5, label: 'Cancelled' },
      { id: 6, label: 'Returned' },
      { id: 7, label: 'Failed' }
    ];
  }

  getPaymentStatusOptions(): DropdownModel[] {
    return [
      { id: 0, label: 'Unpaid' },
      { id: 1, label: 'Paid' },
      { id: 2, label: 'Partial' },
      { id: 3, label: 'Failed' },
      { id: 4, label: 'Refunded' },
      { id: 5, label: 'Cancelled' },
      { id: 6, label: 'Pending' }
    ];
  }

  getPaymentMethodOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Cash' },
      { id: 2, label: 'Bank Transfer' },
      { id: 3, label: 'Mobile Payment' },
      { id: 4, label: 'Credit Card' },
      { id: 5, label: 'Debit Card' },
      { id: 6, label: 'Visa Card' },
      { id: 7, label: 'Master Card' },
      { id: 8, label: 'Wallet' },
      { id: 9, label: 'bKash' },
    ];
  }

  getSweetnessLevelOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Low' },
      { id: 2, label: 'Medium' },
      { id: 3, label: 'High' },
      { id: 4, label: 'Very High' },
    ];
  }

  getMangoGradeOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Premium' },
      { id: 2, label: 'Standard' },
      { id: 3, label: 'Economy' },
      { id: 4, label: 'Export Quality' },
      { id: 5, label: 'Organic' },
    ];
  }

  getMangoAvailabilityStatusOptions(): DropdownModel[] {
    return [
      { id: 0, label: 'Upcoming' },
      { id: 1, label: 'Available' },
      { id: 2, label: 'Sold Out' },
      { id: 3, label: 'Closed' },
    ];
  }

  getAddressTypeOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Home' },
      { id: 2, label: 'Office' },
      { id: 3, label: 'Billing' },
      { id: 4, label: 'Shipping' },
    ];
  }

  getLocationTypeOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Inside Dhaka' },
      { id: 2, label: 'Outside Dhaka' }
    ];
  }

  getDeliveryStatusOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Pending' },
      { id: 2, label: 'Dispatched' },
      { id: 3, label: 'InTransit' },
      { id: 4, label: 'Delivered' },
      { id: 5, label: 'Failed' },
      { id: 6, label: 'Returned' },
      { id: 7, label: 'Cancelled' }
    ];
  }

  /**
   * Converts any list into enum dropdown model
   */
  mapToDropdown<T>(
    list: T[],
    idKey: keyof T,
    labelKey: keyof T
    ): DropdownModel[] {
      return list.map(item => ({
        id: item[idKey] as unknown as number | string,
        label: item[labelKey] as unknown as string
      }));
    }

    /**
   * Converts any list into entity type dropdown model
   */
    mapToEntityDropdown<T>(
    list: T[],
    idKey: keyof T,
    nameKey: keyof T
    ): EntityDropdownModel[] {
      return list.map(item => ({
        id: item[idKey] as unknown as number | string,
        name: item[nameKey] as unknown as string
      }));
    }
}
