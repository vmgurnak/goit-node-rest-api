import * as fs from 'node:fs/promises';
import path from 'node:path';

import User from '../models/users.js';
import Jimp from 'jimp';

async function updateAvatar(req, res, next) {
  try {
    console.log(req.file);
    const img = await Jimp.read(req.file.path);
    await img.resize(250, 250).quality(85).writeAsync(req.file.path);
    const newPath = path.resolve('public', 'avatars', req.file.filename);
    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      { new: true }
    );
    res.send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export default { updateAvatar };
