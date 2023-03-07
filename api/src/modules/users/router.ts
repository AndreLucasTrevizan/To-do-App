import { Router } from 'express';
import { auth } from '../../middleware/auth';
import {
  handleCheckCode,
  handleGetUserDetails,
  handleSendVerificationCode,
  handleSignIn,
  handleSignUp,
  handleUpdatePassword
} from './controller';

const router = Router();

router.route('/users').post(handleSignUp);
router.route('/sign_in').post(handleSignIn);

router.route('/users/me').get(auth, handleGetUserDetails);
router.route('/users/verification_code').post(handleSendVerificationCode);
router.route('/users/code').patch(handleCheckCode);
router.route('/users/password').patch(handleUpdatePassword);

export {router as UsersRouter};