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

  private readonly permissionMap: { [featureId: number]: { [actionId: number]: string } } = {
    1:  { 1: 'order.view',               2: 'order.create',                3: 'order.update',                4: 'order.delete',                5: 'order.approve'             },
    2:  { 1: 'mango.type.view',           2: 'mango.type.manage',           3: 'mango.type.manage',           4: 'mango.type.manage'                                           },
    3:  { 1: 'mango.availability.view',   2: 'mango.availability.manage',   3: 'mango.availability.manage',   4: 'mango.availability.manage'                                   },
    4:  { 1: 'customer.view',             2: 'customer.create',             3: 'customer.update',             4: 'customer.delete'                                             },
    5:  { 1: 'payment.view',              2: 'payment.create',              3: 'payment.update',              4: 'payment.delete'                                              },
    6:  { 1: 'expense.type.view',         2: 'expense.type.create',         3: 'expense.type.update',         4: 'expense.type.delete'                                         },
    7:  { 1: 'expense.view',              2: 'expense.create',              3: 'expense.update',              4: 'expense.delete'                                              },
    8:  { 1: 'courier.provider.view',     2: 'courier.provider.create',     3: 'courier.provider.update',     4: 'courier.provider.delete'                                     },
    9:  { 1: 'courier.station.view',      2: 'courier.station.create',      3: 'courier.station.update',      4: 'courier.station.delete'                                      },
    10: { 1: 'courier.area.map.view',     2: 'courier.area.map.create',     3: 'courier.area.map.update',     4: 'courier.area.map.delete'                                     },
    20: { 1: 'courier.rate.config.view',  2: 'courier.rate.config.create',  3: 'courier.rate.config.update',  4: 'courier.rate.config.delete'                                  },
    11: { 1: 'feedback.admin.view'                                                                                                                                             },
    12: { 1: 'complaint.admin.view',      2: 'complaint.admin.manage'                                                                                                         },
    13: { 1: 'policy.view',               2: 'policy.manage',               3: 'policy.manage',               4: 'policy.manage'                                               },
    14: { 1: 'report.view'                                                                                                                                                     },
    15: { 1: 'user.view',                 2: 'user.create',                 3: 'user.update',                 4: 'user.delete',                 5: 'user.permission.grant'     },
    16: { 1: 'role.view',                 2: 'role.create',                 3: 'role.update',                 4: 'role.delete'                                                 },
    17: { 1: 'dashboard.admin.view'                                                                                                                                            },
    18: { 1: 'dashboard.customer.view'                                                                                                                                         },
    19: { 1: 'order.admin.view',          2: 'order.admin.manage'                                                                                                              },
  };

  getPermissionString(featureId: number, actionId: number): string | null {
    return this.permissionMap[featureId]?.[actionId] ?? null;
  }

  public getPermissionList(): PermissionModel[] {
    return [
      // ─── Dashboard ────────────────────────────────────────────────────
      {
        area: 'Dashboard',
        featureModels: [
          {
            id: 17,
            title: 'Admin Dashboard',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View', hasAccess: false },
            ],
          },
          {
            id: 18,
            title: 'Customer Dashboard',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View', hasAccess: false },
            ],
          },
        ],
      },

      // ─── Operations ───────────────────────────────────────────────────
      {
        area: 'Operations',
        featureModels: [
          {
            id: 1,
            title: 'Orders',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
              { id: 5, action: 'Approve', hasAccess: false },
              { id: 6, action: 'Export', hasAccess: false },
            ],
          },
          {
            id: 19,
            title: 'Admin Order Management',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Manage', hasAccess: false },
            ],
          },
          {
            id: 2,
            title: 'Mango Types',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
          {
            id: 3,
            title: 'Mango Availability',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
          {
            id: 4,
            title: 'Customers',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
              { id: 5, action: 'Export', hasAccess: false },
            ],
          },
        ],
      },

      // ─── Finance ──────────────────────────────────────────────────────
      {
        area: 'Finance',
        featureModels: [
          {
            id: 5,
            title: 'Payments',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',    hasAccess: false },
              { id: 2, action: 'Create',  hasAccess: false },
              { id: 3, action: 'Update',  hasAccess: false },
              { id: 4, action: 'Approve', hasAccess: false },
              { id: 5, action: 'Export',  hasAccess: false },
            ],
          },
          {
            id: 6,
            title: 'Expense Types',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
          {
            id: 7,
            title: 'Expenses',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',    hasAccess: false },
              { id: 2, action: 'Create',  hasAccess: false },
              { id: 3, action: 'Update',  hasAccess: false },
              { id: 4, action: 'Delete',  hasAccess: false },
              { id: 5, action: 'Approve', hasAccess: false },
              { id: 6, action: 'Export',  hasAccess: false },
            ],
          },
        ],
      },

      // ─── Logistics ────────────────────────────────────────────────────
      {
        area: 'Logistics',
        featureModels: [
          {
            id: 8,
            title: 'Courier Providers',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
          {
            id: 9,
            title: 'Courier Stations',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
          {
            id: 10,
            title: 'Area Mapping',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
          {
            id: 20,
            title: 'Courier Rate Config',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
        ],
      },

      // ─── Customer Relations ───────────────────────────────────────────
      {
        area: 'Customer Relations',
        featureModels: [
          {
            id: 11,
            title: 'Feedback',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Delete', hasAccess: false },
              { id: 3, action: 'Export', hasAccess: false },
            ],
          },
          {
            id: 12,
            title: 'Complaints',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Update', hasAccess: false },
              { id: 3, action: 'Delete', hasAccess: false },
              { id: 4, action: 'Export', hasAccess: false },
            ],
          },
        ],
      },

      // ─── Content ──────────────────────────────────────────────────────
      {
        area: 'Content',
        featureModels: [
          {
            id: 13,
            title: 'Policies',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
        ],
      },

      // ─── Reports ──────────────────────────────────────────────────────
      {
        area: 'Reports',
        featureModels: [
          {
            id: 14,
            title: 'Reports',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Export', hasAccess: false },
            ],
          },
        ],
      },

      // ─── Administration ───────────────────────────────────────────────
      {
        area: 'Administration',
        featureModels: [
          {
            id: 15,
            title: 'Users',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
              { id: 5, action: 'Assign', hasAccess: false },
            ],
          },
          {
            id: 16,
            title: 'Role Management',
            hasAccess: false,
            actionModels: [
              { id: 1, action: 'View',   hasAccess: false },
              { id: 2, action: 'Create', hasAccess: false },
              { id: 3, action: 'Update', hasAccess: false },
              { id: 4, action: 'Delete', hasAccess: false },
            ],
          },
        ],
      },
    ];
  }
}
