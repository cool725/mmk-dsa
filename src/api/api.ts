import directus from './directus';
import * as auth from './auth';
import * as otp from './otp';
import * as file from './file';
import * as dsa from './dsa';
import * as info from './info';
import * as customData from './customData';
import * as customFile from './customFile';

const api = {
  // Object instances
  directus,
  axios: directus?.axios,
  url: directus?.url || directus?.axios?.defaults?.baseURL,
  get token() {
    return directus.auth.token;
  },
  // API "modules"
  auth,
  otp,
  customData,
  customFile,
  file,
  dsa,
  info,
};

export default api;
