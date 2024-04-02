/* eslint-disable func-names */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { RequestHandler } from 'express';
import prisma from 'db/prisma_client';
import { User } from '@prisma/client';
import { getFieldNotFoundError } from 'errors';
import { CompareCallback } from 'util/constants';
import bcrypt from 'bcrypt';

// Configure what LocalStrategy will check for as a username
const localOptions = { usernameField: 'email' };

// Make a login strategy to check email and password against DB
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    if (!user) return done(null, false, { message: 'Email address not associated with a user' });

    bcrypt.compare(password, user.password, (error, same) => {
      if (error) {
        done(error);
      } else {
        if (!same) {
          done(null, false, { message: 'Incorrect password' });
        } else {
          done(null, user);
        }
      }
    });

  } catch (e) {
    return done(e, false); // Error return
  }
});


passport.use(localLogin);

// Create function to transmit result of authenticate() call to user or next middleware
const requireSignin: RequestHandler = (req, res, next) => {
  // Validation of parameters
  if (!req.body.email) {
    return res.status(400).json({ message: getFieldNotFoundError('email') });
  }

  if (!req.body.password) {
    return res.status(400).json({ message: getFieldNotFoundError('password') });
  }

  // eslint-disable-next-line prefer-arrow-callback
  return passport.authenticate('local', { session: false }, function (err, user, info) {
    // Return any existing errors
    if (err) { return next(err); }

    // If no user found, return appropriate error message
    if (!user) { return res.status(401).json({ message: info.message || 'Error authenticating email and password' }); }

    req.user = user;

    return next();
  })(req, res, next);
};

export default requireSignin;
