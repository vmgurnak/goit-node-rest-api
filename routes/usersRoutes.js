import express from 'express';

import UserController from '../controllers/usersControllers.js';

import uploadMiddleware from '../middlewares/upload.js';

const usersRouter = express.Router();

usersRouter.patch(
  '/avatars',
  uploadMiddleware.single('avatar'),
  UserController.updateAvatar
);

export default usersRouter;
