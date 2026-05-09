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

  getMangoTypeOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Gopalbhog' },
      { id: 2, label: 'Himsagor' },
      { id: 3, label: 'Langra' },
      { id: 4, label: 'Amrupali' },
      { id: 5, label: 'Brindabon' },
      { id: 6, label: 'Fazli' },
    ];
  }

  getOrderStatusOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Pending' },
      { id: 2, label: 'Confirmed' },
      { id: 3, label: 'Processing' },
      { id: 4, label: 'Shipped' },
      { id: 5, label: 'Delivered' },
      { id: 6, label: 'Cancelled' },
      { id: 7, label: 'Returned' },
      { id: 8, label: 'Failed' }
    ];
  }

  getPaymentStatusOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Unpaid' },
      { id: 2, label: 'Paid' },
      { id: 3, label: 'Partial' },
      { id: 4, label: 'Failed' },
      { id: 5, label: 'Refunded' },
      { id: 6, label: 'Cancelled' }
    ];
  }

  getPaymentMethodOptions(): DropdownModel[] {
    return [
      { id: 1, label: 'Cash' },
      { id: 2, label: 'bKash' },
      { id: 3, label: 'Nagad' },
      { id: 4, label: 'Rocket' },
      { id: 5, label: 'Bank Transfer' },
      { id: 6, label: 'Cheque' },
      { id: 7, label: 'Card' },
      { id: 8, label: 'Other' },
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
