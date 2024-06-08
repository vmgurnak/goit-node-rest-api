import express from 'express';

const jsonParser = express.json();

import AuthControllers from '../controllers/authControllers.js';

import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', jsonParser, AuthControllers.register);
router.post('/login', jsonParser, AuthControllers.login);
router.get('/logout', jsonParser, authMiddleware, AuthControllers.logout);

export default router;
