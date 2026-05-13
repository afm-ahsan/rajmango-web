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

  public getPermissionList(): PermissionModel[] {
    return [
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
