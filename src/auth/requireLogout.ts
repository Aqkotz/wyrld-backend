import { RequestHandler } from 'express';

const requireLogout: RequestHandler = (req, res, next) => {
  try {
    delete req.user;
    next();
  } catch (e) {
    next(e);
  }
};

export default requireLogout;