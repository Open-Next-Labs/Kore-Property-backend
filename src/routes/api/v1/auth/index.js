import express from 'express';
import AuthController from '../../../../controllers/Auth';
import {
  loginSchema,
  signupSchema,
  initPasswordResetSchema,
  completePasswordResetSchema,
} from './auth.validators';

import asyncHandler from '../../../../middlewares/asyncHandler';
import checkPhoneNumber from '../../../../middlewares/checkPhoneNumber';
import checkEmail from '../../../../middlewares/checkEmail';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  signupSchema,
  checkPhoneNumber,
  checkEmail,
  asyncHandler(AuthController.signup),
);

authRouter.post('/login', loginSchema, asyncHandler(AuthController.login));

authRouter.post(
  '/password-reset/init',
  initPasswordResetSchema,
  asyncHandler(AuthController.initiateResetPassword),
);

authRouter.post(
  '/password-reset/complete',
  completePasswordResetSchema,
  asyncHandler(AuthController.completeResetPassword),
);

// authRouter.post(
//   '/confirm-email/:token',
//   completePasswordResetSchema,
//   asyncHandler(AuthController.confirmEmail),
// );

export default authRouter;
