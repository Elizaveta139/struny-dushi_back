import jwt from 'jsonwebtoken';

import HttpError from '../helpers/HttpError.js';
import { User } from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
  }

  const { SECRET_KEY } = process.env;

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    console.log(user);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, 'Not authorized'));
  }
};
