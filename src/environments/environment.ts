const baseUrl = 'http://localhost:4215';
const apiUrl = 'https://localhost:7215';
const issuerUrl = 'https://localhost:7215';

// const baseUrl = 'https://ajwadfarms.com';
// const apiUrl = 'https://api.ajwadfarms.com';
// const issuerUrl = 'https://api.ajwadfarms.com';

export const environment = {
  production: false,
  appVersion: 'v1.0.0',
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
