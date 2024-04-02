import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { isSubScope, ScopeNames } from 'auth/scopes';
import UserModel, { IUser } from 'db/models/user_model';

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  UserModel.findOne({ _id: payload.sub }, (err, user: IUser) => {
    if (err) { return done(err, false); } // Error return 
    if (user) { return done(null, user); } // Valid user return
    return done(null, false); // Catch no valid user return
  });
});

passport.use(jwtLogin);

/**
 * Middleware that requires a minimum scope to access the protected route
 * @param scope minimum scope to require on protected route
 * @returns express middleware handler
 */
const requireScope = (scope: ScopeNames): RequestHandler => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user: IUser, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: info?.message || 'Error authenticating email and password' }); }
    if (!isSubScope(user.role, scope)) { return res.status(403).json({ message: 'Unauthorized' }); }

    req.user = user;
    return next();
  })(req, res, next);
};

export default requireScope;
