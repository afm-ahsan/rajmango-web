// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const baseUrl = 'http://localhost:4215';
// const apiUrl = 'https://localhost:7215';
// const issuerUrl = 'https://localhost:7215';

const baseUrl = 'https://ajwadfarms.com';
const apiUrl = 'https://api.ajwadfarms.com';
const issuerUrl = 'https://api.ajwadfarms.com';

export const environment = {
  production: true,
  appVersion: 'v1.0.0',
  USERID_KEY: 'authf172fc2a1f98',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  turnstile: {
    // Replace with your production site key from the Cloudflare dashboard
    siteKey: '0x4AAAAAADRoFVu2_xec2NJH',
  },
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
