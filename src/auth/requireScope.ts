import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { isSubScope } from 'auth/scopes';
import { UserRole } from '@prisma/client';
import prisma from 'db/prisma_client';
import { User } from '@prisma/client';

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: payload.sub,
      },
    });
    if (user) {
      return done(null, user); // Valid user return
    } else {
      return done(null, false); // Catch no valid user return
    }
  } catch (e) {
    return done(e, false); // Error return
  }
});

passport.use(jwtLogin);

/**
 * Middleware that requires a minimum scope to access the protected route
 * @param scope minimum scope to require on protected route
 * @returns express middleware handler
 */
const requireScope = (scope: UserRole): RequestHandler => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user: User, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: info?.message || 'Error authenticating email and password' }); }
    // TODO: Fix typing
    if (!isSubScope(user.role, scope)) { return res.status(403).json({ message: 'Unauthorized' }); }

    req.user = user;
    return next();
  })(req, res, next);
};

export default requireScope;
