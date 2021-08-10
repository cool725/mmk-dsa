import create from './create';
import read, { getIncompleteDsaApplications } from './read';
import del from './delete';
import update from './update';

export { create, create as new, create as add, read, read as get, del as delete, del as remove, update, getIncompleteDsaApplications };
