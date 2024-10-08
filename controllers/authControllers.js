import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';

import { createUserSchema } from '../schemas/authScemas.js';

import mail from '../mail.js';
import User from '../models/users.js';

async function register(req, res, next) {
  const user = req.body;
  const { email, password } = req.body;

  const { error } = createUserSchema.validate(user, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send({ message: error.details.map((err) => err.message).join(', ') });
  }

  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).send({ message: 'Email in use' });
    }

    const avatarURL = gravatar.url(email, { protocol: 'https' }, true);
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: 'admin@contacts.com',
      subject: 'Account Verification for MyContacts App',
      html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">To confirm you email please click on</a>`,
      text: `http://localhost:3000/users/verify/${verificationToken}`,
    });

    await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    res.status(201).send({
      user: {
        email,
        subscription: 'starter',
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = req.body;

  const { error } = createUserSchema.validate(user, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send({ message: error.details.map((err) => err.message).join(', ') });
  }

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (passwordCompare === false) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }
    if (user.verify === false) {
      return res.status(401).send({ message: 'Please verify your email' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.send({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.userId, { token: null });
    res.sendStatus(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    res.send({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  current,
};
