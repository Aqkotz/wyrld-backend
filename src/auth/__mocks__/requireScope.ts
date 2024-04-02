import { RequestHandler } from 'express';
// import { UserRole } from 'authentication/scopes';
import { mockUser } from '../../../__jest__/helpers';

const requireScope = (): RequestHandler => (req, res, next) => {
  // Reject with 403 if user scope is not sufficient
  if (!req.get('Authorization')) return res.status(403).json({ message: 'Unauthorized' });

  req.user = mockUser;
  return next();
};

export default requireScope;
