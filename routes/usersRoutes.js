import express from 'express';

import UserController from '../controllers/usersControllers.js';

import uploadMiddleware from '../middlewares/upload.js';
import authMiddleware from '../middlewares/auth.js';

const usersRouter = express.Router();

usersRouter.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  UserController.updateAvatar
);

usersRouter.get('/verify/:verificationToken', UserController.verifyEmail);
usersRouter.post('/verify', UserController.resendVerifyEmail);

export default usersRouter;
