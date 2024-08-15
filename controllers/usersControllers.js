import * as fs from 'node:fs/promises';
import path, { format } from 'node:path';
import Jimp from 'jimp';

import User from '../models/users.js';
import mail from '../mail.js';
import { verifyEmailSchema } from '../schemas/verifyEmailSchemas.js';
import { saveFileToCloudinary } from '../utilits/saveFileToCloudinary.js';
// import { env } from 'node:process';
// import { env } from '../utilits/env.js';

const ENABLE_CLOUDINARY = process.env.ENABLE_CLOUDINARY;

async function updateAvatar(req, res, next) {
  try {
    console.log(req.file);

    if (!req.file) {
      res.status(400).send({ message: 'Please add an avatar file' });
    }

    const img = await Jimp.read(req.file.path);
    await img.resize(250, 250).quality(85).writeAsync(req.file.path);

    let newPath;

    if (ENABLE_CLOUDINARY === 'true') {
      newPath = await saveFileToCloudinary(req.file);
    } else {
      newPath = path.resolve('public', 'avatars', req.file.filename);
      await fs.rename(req.file.path, newPath);
    }

    // const newPath = path.resolve('public', 'avatars', req.file.filename);
    // await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        // avatarURL: `/avatars/${req.file.filename}`,
        // avatarURL: path.join(`${newPath}`, req.file.filename),
        avatarURL: newPath,
      },
      { new: true }
    );
    res.send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken: verificationToken });

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).send({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  const { error } = verifyEmailSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).send({ message: 'missing required field email' });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (user.verify) {
      return res
        .status(400)
        .send({ message: 'Verification has already been passed' });
    }
    const resendMail = {
      to: email,
      from: 'admin@contacts.com',
      subject: 'Account Verification for MyContacts App',
      html: `<a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">To confirm you email please click on</a>`,
      text: `http://localhost:3000/users/verify/${user.verificationToken}`,
    };
    mail.sendMail(resendMail);
    res.status(200).send({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
}

export default { updateAvatar, verifyEmail, resendVerifyEmail };
