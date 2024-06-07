import express from 'express';

const jsonParser = express.json();

import authControllers from '../controllers/authControllers.js';

import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', jsonParser, authControllers.register);
router.post('/login', jsonParser, authControllers.login);

export default router;
