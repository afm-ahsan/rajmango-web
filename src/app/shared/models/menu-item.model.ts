import { UserPermissionKey } from "src/app/core/constants/user-permission-keys.enum";

export interface MenuItem {
  label: string;
  route?: string;
  icon: string;
  permissionKey: UserPermissionKey;
  children?: MenuItem[];
}
