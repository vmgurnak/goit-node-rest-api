import jwt from 'jsonwebtoken';

import User from '../models/users.js';

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader !== 'string') {
    return res.status(401).send({ status: 401, message: 'Not authorized' });
  }

  const [bearer, token] = authorizationHeader.split(' ', 2);

  if (bearer !== 'Bearer') {
    return res.status(401).send({ status: 401, message: 'Not authorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ status: 401, message: 'Not authorized' });
    }

    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        return res.status(401).send({ status: 401, message: 'Not authorized' });
      }

      if (user.token !== token) {
        return res.status(401).send({ status: 401, message: 'Not authorized' });
      }

      req.user = { userId: decode.id };
      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;
