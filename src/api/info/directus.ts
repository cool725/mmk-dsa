import { api } from '..';

const METHOD = 'directus()';

export async function directus() {
  try {
    const url = await api.directus.url;
    const activity = await api.directus.activity;
    const auth = await api.directus.auth;
    const collections = await api.directus.collections;
    const fields = await api.directus.fields;
    const folders = await api.directus.folders;
    const permissions = await api.directus.permissions;
    const presets = await api.directus.presets;
    const relations = await api.directus.relations;
    const revisions = await api.directus.revisions;
    const roles = await api.directus.roles;
    const server = await api.directus.server;
    const setting = await api.directus.settings;
    const users = await api.directus.users;
    const utils = await api.directus.utils;
    return {
      url,
      activity,
      auth,
      collections,
      fields,
      folders,
      permissions,
      presets,
      relations,
      revisions,
      roles,
      server,
      setting,
      users,
      utils,
    };
  } catch (error) {
    console.error(METHOD, error);
  }
  return null;
}

export default directus;
