import directus from './directus';
import * as auth from './auth';
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
  token: directus.auth.token,
  // API "modules"
  auth,
  customData,
  customFile,
  file,
  dsa,
  info,
};

export default api;
