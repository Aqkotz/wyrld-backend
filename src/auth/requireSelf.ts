import { RequestHandler } from 'express';
import { isSubScope, ScopeNames } from 'auth/scopes';
import { IUser } from 'db/models/user_model';

/**
 * Middleware enforcing that a user can only edit their own model (user id matches params.id)
 * @param adminScope scope that will override user and params id matching
 * @returns express request handler
 */
const requireSelf = (adminScope: ScopeNames): RequestHandler => (req, res, next) => {
  const user = req.user as IUser;

  if (!user) { return res.status(400).json({ message: 'No user object attached' }); }
  if (!req.params._id) { return res.status(400).json({ message: 'Invalid URL _id' }); }

  if (req.user !== req.params.id && !isSubScope(user.role, adminScope)) { return res.status(403).json({ message: 'Unauthorized' }); }

  return next();
};

export default requireSelf;
