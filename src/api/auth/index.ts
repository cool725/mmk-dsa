import signup, { activateAgent } from './signup';
import loginWithEmail from './loginWithEmail';
import loginWithPhone from './loginWithPhone';
import logout from './logout';
import refresh from './refresh';
import userExist from './userExist';

import recoverPassword from './recoverPassword';
import recoverPin from './recoverPin';
import resetPassword from './resetPassword';
import { verifyEmail, confirmEmail } from './emailVerification';

export { signup, loginWithEmail, loginWithPhone, logout, refresh, userExist, recoverPassword, recoverPin, resetPassword, verifyEmail, confirmEmail, activateAgent };
