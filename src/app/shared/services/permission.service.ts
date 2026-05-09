import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PermissionModel } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  private apiUrl: string = `${environment.apis.default.url}/api/permission`;

  constructor(private http: HttpClient) {}

  public getPermissions() {
    return this.http.get(`${this.apiUrl}`);
  }

  //static permission list
  public getPermissionList(){
    var permissionList: PermissionModel[] = [
      //permissionList.push(
      {
        area: '',
        featureModels: [
          {
            id: 1,
            title: 'Home',
            hasAccess: false,
            actionModels: [],
          },
        ],
      },
      {
        area: 'GC Reservation',
        featureModels: [
          {
            id: 2,
            title: 'Reservation',
            hasAccess: false,
            actionModels: [],
          },
        ],
      },
      {
        area: 'GC Reservation',
        featureModels: [
          {
            id: 3,
            title: 'GC Premises',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'BookConventionHall', hasAccess: false },
              { id: 2, action: 'BookVipSuite', hasAccess: false },
              { id: 3, action: 'BookFamilySuite', hasAccess: false },
              { id: 4, action: 'BookDeluxRoom', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: '',
        featureModels: [
          {
            id: 4,
            title: 'Manage Sales',
            hasAccess: false,
            actionModels: [],
          },
        ],
      },
      {
        area: 'RSO',
        featureModels: [
          {
            id: 5,
            title: 'Remove Sale Order',
            hasAccess: false,
            actionModels: [],
          },
        ],
      },
      {
        area: 'Portal Area',
        featureModels: [
          {
            id: 6,
            title: 'Restaurant',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Portal Area',
        featureModels: [
          {
            id: 7,
            title: 'Billing in Restaurant',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Portal Area',
        featureModels: [
          {
            id: 8,
            title: 'Kitchen',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Portal Area',
        featureModels: [
          {
            id: 9,
            title: 'Bakery',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Food Area',
        featureModels: [
          {
            id: 10,
            title: 'Manage Food Category',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Food Area',
        featureModels: [
          {
            id: 11,
            title: 'Manage Food Item',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Food Area',
        featureModels: [
          {
            id: 12,
            title: 'Manage Modifiers',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Food Area',
        featureModels: [
          {
            id: 13,
            title: 'Manage Ingredients',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Expense Area',
        featureModels: [
          {
            id: 14,
            title: 'Manage Expense Type',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Expense Area',
        featureModels: [
          {
            id: 15,
            title: 'Manage Expenses',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'People Area',
        featureModels: [
          {
            id: 16,
            title: 'Manage Users',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'People Area',
        featureModels: [
          {
            id: 17,
            title: 'Manage User Roles',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'People Area',
        featureModels: [
          {
            id: 18,
            title: 'Manage Customers',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'People Area',
        featureModels: [
          {
            id: 36,
            title: 'Chef',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Report Area',
        featureModels: [
          {
            id: 19,
            title: 'Overall Report',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Report Area',
        featureModels: [
          {
            id: 20,
            title: 'Tax Report',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Report Area',
        featureModels: [
          {
            id: 21,
            title: 'Exponse Report',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Report Area',
        featureModels: [
          {
            id: 22,
            title: 'Stock Alerts',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Advance Area',
        featureModels: [
          {
            id: 23,
            title: 'Imports and Exports',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Advance Area',
        featureModels: [
          {
            id: 24,
            title: 'Manage Service Table',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Advance Area',
        featureModels: [
          {
            id: 25,
            title: 'Manage Payment Methods',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Advance Area',
        featureModels: [
          {
            id: 26,
            title: 'Manage Pickup Points',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Advance Area',
        featureModels: [
          {
            id: 27,
            title: 'Database Backup',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Advance Area',
        featureModels: [
          {
            id: 28,
            title: 'Manage Language',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 29,
            title: 'General Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 30,
            title: 'Appearance Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 31,
            title: 'Localization Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 32,
            title: 'Outgoing Mail Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 33,
            title: 'Authentication Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 34,
            title: 'Captcha Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'Configuration Area',
        featureModels: [
          {
            id: 35,
            title: 'Printer Configuration',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 37,
            title: 'Store',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 38,
            title: 'Brand',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 39,
            title: 'Category',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 40,
            title: 'Vendor',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 41,
            title: 'Product',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 42,
            title: 'Order',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
      {
        area: 'GC Inventory',
        featureModels: [
          {
            id: 43,
            title: 'Report',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'Create', hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'View', hasAccess: false },
            ],
          },
        ],
      },
    ];

    return permissionList;
  }
}