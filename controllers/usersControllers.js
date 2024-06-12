import * as fs from 'node:fs/promises';
import path from 'node:path';

import User from '../models/users.js';

async function updateAvatar(req, res, next) {
  try {
    console.log(req.file);
    const newPath = path.resolve('public', 'avatars', req.file.filename);
    console.log({ newPath });
    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      { new: true }
    );

    console.log(user);

    res.send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export default { updateAvatar };
