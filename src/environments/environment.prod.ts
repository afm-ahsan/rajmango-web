// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const baseUrl = 'http://localhost:4215';
// const apiUrl = 'https://localhost:7215';
// const issuerUrl = 'https://localhost:7215';

const baseUrl = 'https://rajmangoz.com';
const apiUrl = 'https://api.rajmangoz.com';
const issuerUrl = 'https://api.rajmangoz.com';

export const environment = {
  production: true,
  appVersion: 'v1.0.1',
  USERID_KEY: 'authf172fc2a1f98',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  application: {
    baseUrl,
    name: 'RajMango',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: issuerUrl,
    redirectUri: baseUrl,
    clientId: 'RajMango_App',
    responseType: 'code',
    scope: 'offline_access openid profile role email phone RajMango',
    requireHttps: true,
  },
  apis: {
    default: {
      url: apiUrl,
      rootNamespace: 'RajMango',
    },
  },
};
