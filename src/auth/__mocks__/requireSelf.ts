import { RequestHandler } from 'express';
// import { isSubScope, UserRole } from 'authentication/scopes';
// import { mockUser } from '../../../__jest__/helpers';

// ? How can this be mocked to test against cross-user editing?
// const requireSelf = (adminScope: UserRole): RequestHandler => (req, res, next) => {
//   // Reject with 403 if url param different than test user and not admin user
//   if (req.params?.id !== mockUser.id && !isSubScope(mockUser.scope, adminScope)) return res.status(403).json({ message: 'Unauthorized' });

//   return next();
// };

const requireSelf = (): RequestHandler => (req, res, next) => {
  return next();
};

export default requireSelf;
