import { RequestHandler } from 'express';
import { isSubScope } from 'auth/scopes';
import { UserRole } from '@prisma/client';
import { User } from '@prisma/client';

/**
 * Middleware enforcing that a user can only edit their own model (user id matches params.id)
 * @param adminScope scope that will override user and params id matching
 * @returns express request handler
 */
const requireSelf = (adminScope: UserRole): RequestHandler => (req, res, next) => {
  const user = req.user as User;

  if (!user) { return res.status(400).json({ message: 'No user object attached' }); }
  if (!req.params.id) { return res.status(400).json({ message: 'Invalid URL id' }); }

  // TODO: Fix typing
  if (req.user !== req.params.id && !isSubScope(user.role, adminScope)) { return res.status(403).json({ message: 'Unauthorized' }); }

  return next();
};

export default requireSelf;
