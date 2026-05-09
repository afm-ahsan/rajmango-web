export interface AppUserModel {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  email: string;
  emailConfirmed: boolean;
  isLocked: boolean;
  isActive: boolean;
  pic: string;
}
