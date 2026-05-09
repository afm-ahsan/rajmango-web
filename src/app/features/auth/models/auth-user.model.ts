export class AuthUserModel {
  authToken: string;
  refreshToken: string;
  expiresIn: Date;

  setAuth(auth: AuthUserModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}

export class AuthUserDto {
  userName: string;
  imagePath: string;
  email: string;
  phoneNumber: string;
  authUserRole: AuthUserRole[];
}

export class AuthUserRole
{
    id: number
    name: string
}
